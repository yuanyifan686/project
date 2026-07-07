"""轻量级 SQLite 结构迁移（MVP 无 Alembic）"""
from sqlalchemy import inspect, text

from backend.database import engine


def _column_exists(table: str, column: str) -> bool:
    inspector = inspect(engine)
    if table not in inspector.get_table_names():
        return False
    return column in {col["name"] for col in inspector.get_columns(table)}


def run_migrations() -> None:
    with engine.begin() as conn:
        if not _column_exists("consultations", "status"):
            conn.execute(
                text(
                    "ALTER TABLE consultations "
                    "ADD COLUMN status VARCHAR(20) DEFAULT 'pending'"
                )
            )
            conn.execute(
                text(
                    "UPDATE consultations SET status = 'pending' "
                    "WHERE status IS NULL"
                )
            )