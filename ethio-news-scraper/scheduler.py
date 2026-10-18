#!/usr/bin/env python3
from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

from config.settings import CRON_HOURS, RUN_ON_START
from services.ingestion import run_ingestion


def main() -> None:
    scheduler = BlockingScheduler(timezone="Africa/Addis_Ababa")

    for hour in CRON_HOURS:
        scheduler.add_job(
            run_ingestion,
            CronTrigger(hour=hour, minute=0),
            id=f"ingest_{hour}",
            replace_existing=True,
        )
        print(f"[Scheduler] Registered job at {hour:02d}:00 Africa/Addis_Ababa")

    if RUN_ON_START:
        print("[Scheduler] Running initial ingestion on start")
        run_ingestion()

    print("[Scheduler] Waiting for scheduled runs...")
    scheduler.start()


if __name__ == "__main__":
    main()
