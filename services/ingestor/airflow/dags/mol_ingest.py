from __future__ import annotations

from datetime import datetime

from airflow.decorators import dag, task


@dag(
    dag_id="mol_ingest",
    schedule=None,
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=["mol", "ingest"],
)
def mol_ingest():
    @task
    def extract() -> int:
        return 0

    @task
    def transform(count: int) -> int:
        return count

    @task
    def load(count: int) -> None:
        _ = count

    load(transform(extract()))


mol_ingest()
