#!/usr/bin/env python3
"""Run a single ingestion cycle (useful for cron or manual trigger)."""

from services.ingestion import run_ingestion

if __name__ == "__main__":
    run_ingestion()
