#!/usr/bin/env python3
"""
Production entrypoint: APScheduler + HTTP trigger API in one process.

Endpoints:
  GET  /health
  POST /ingest   (requires Authorization: Bearer <INGEST_API_TOKEN>)
"""

from __future__ import annotations

import os
import threading
from typing import Optional

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from fastapi import Depends, FastAPI, Header, HTTPException
from fastapi.responses import JSONResponse

from config.settings import CRON_HOURS, RUN_ON_START
from services.ingestion import run_ingestion

INGEST_API_TOKEN = os.getenv("INGEST_API_TOKEN", "").strip()
SCRAPER_API_PORT = int(os.getenv("SCRAPER_API_PORT", "8080"))

app = FastAPI(title="Ethio News Scraper", version="1.0.0")

_ingest_lock = threading.Lock()
_last_result: Optional[dict] = None
_running = False


def _require_token(authorization: Optional[str] = Header(default=None)) -> None:
    if not INGEST_API_TOKEN:
        raise HTTPException(
            status_code=503,
            detail="INGEST_API_TOKEN is not configured",
        )
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing Bearer token")
    token = authorization.split(" ", 1)[1].strip()
    if token != INGEST_API_TOKEN:
        raise HTTPException(status_code=403, detail="Invalid token")


def _run_ingest_safe() -> dict:
    global _running, _last_result
    if not _ingest_lock.acquire(blocking=False):
        return {"status": "busy", "message": "Ingestion already running"}
    _running = True
    try:
        stats = run_ingestion()
        result = {"status": "ok", "stats": stats}
        _last_result = result
        return result
    except Exception as exc:
        result = {"status": "error", "error": str(exc)}
        _last_result = result
        return result
    finally:
        _running = False
        _ingest_lock.release()


@app.get("/health")
def health():
    return {
        "ok": True,
        "running": _running,
        "cron_hours": CRON_HOURS,
        "last_result": _last_result,
    }


@app.post("/ingest")
def ingest(_: None = Depends(_require_token)):
    result = _run_ingest_safe()
    if result.get("status") == "busy":
        return JSONResponse(status_code=409, content=result)
    if result.get("status") == "error":
        return JSONResponse(status_code=500, content=result)
    return result


def start_scheduler() -> BackgroundScheduler:
    scheduler = BackgroundScheduler(timezone="Africa/Addis_Ababa")
    for hour in CRON_HOURS:
        scheduler.add_job(
            _run_ingest_safe,
            CronTrigger(hour=hour, minute=0),
            id=f"ingest_{hour}",
            replace_existing=True,
        )
        print(f"[Scheduler] Registered job at {hour:02d}:00 Africa/Addis_Ababa")
    scheduler.start()
    print("[Scheduler] Background scheduler started")
    return scheduler


@app.on_event("startup")
def on_startup():
    start_scheduler()
    if RUN_ON_START:
        print("[Scheduler] RUN_ON_START=true — kicking off initial ingestion in background")
        threading.Thread(target=_run_ingest_safe, daemon=True).start()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app_server:app",
        host="0.0.0.0",
        port=SCRAPER_API_PORT,
        reload=False,
    )
