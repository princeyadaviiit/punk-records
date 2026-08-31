"""
Punk Records — Database client.

Supports two modes:
  1. Local SQLite (default / demo mode) — zero external dependencies,
     guaranteed to run at demo time even on venue wifi.
  2. Supabase/Postgres — activated by setting DATABASE_URL in the environment.

The schema is the same in both modes (translated to SQLite-compatible DDL
where needed). This file provides a single `get_db()` connection factory
and thin query helpers used by every Satellite route.
"""

import os
import sqlite3
import threading
from contextlib import contextmanager
from typing import Any, Generator

DATABASE_URL = os.environ.get("DATABASE_URL", "")

# ---------------------------------------------------------------------------
# SQLite local mode (default for MVP demo)
# ---------------------------------------------------------------------------
_SQLITE_PATH = os.environ.get("SQLITE_PATH", "punk_records.db")
_local = threading.local()

SQLITE_SCHEMA = """
PRAGMA journal_mode=WAL;

CREATE TABLE IF NOT EXISTS citizens (
    id      TEXT PRIMARY KEY,
    name    TEXT NOT NULL,
    dob     TEXT NOT NULL,
    seeded  INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS documents (
    id          TEXT PRIMARY KEY,
    citizen_id  TEXT NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    doc_type    TEXT NOT NULL,
    fields      TEXT NOT NULL DEFAULT '{}',
    status      TEXT NOT NULL DEFAULT 'valid',
    department  TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_citizen_id ON documents(citizen_id);
CREATE INDEX IF NOT EXISTS idx_documents_doc_type   ON documents(doc_type);

CREATE TABLE IF NOT EXISTS cross_verification_results (
    id              TEXT PRIMARY KEY,
    citizen_id      TEXT NOT NULL REFERENCES citizens(id) ON DELETE CASCADE,
    doc_a_id        TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    doc_b_id        TEXT NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    match_field     TEXT NOT NULL,
    match_score     REAL NOT NULL,
    below_threshold INTEGER NOT NULL DEFAULT 0,
    explanation     TEXT NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_cvr_citizen_id ON cross_verification_results(citizen_id);
"""


def _get_sqlite_conn() -> sqlite3.Connection:
    """Return a thread-local SQLite connection, creating and initialising it if needed."""
    if not hasattr(_local, "conn") or _local.conn is None:
        conn = sqlite3.connect(_SQLITE_PATH, check_same_thread=False)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        # Apply schema (idempotent — all CREATE TABLE IF NOT EXISTS)
        conn.executescript(SQLITE_SCHEMA)
        conn.commit()
        _local.conn = conn
    return _local.conn


@contextmanager
def get_db() -> Generator[Any, None, None]:
    """
    Yield a database connection/cursor compatible context.

    Usage:
        with get_db() as db:
            rows = db.execute("SELECT * FROM citizens").fetchall()
    """
    if DATABASE_URL:
        # Postgres path — requires psycopg2
        try:
            import psycopg2
            import psycopg2.extras

            conn = psycopg2.connect(DATABASE_URL, cursor_factory=psycopg2.extras.RealDictCursor)
            try:
                with conn.cursor() as cur:
                    yield cur
                conn.commit()
            except Exception:
                conn.rollback()
                raise
            finally:
                conn.close()
        except ImportError as exc:
            raise RuntimeError(
                "psycopg2 is not installed but DATABASE_URL is set. "
                "Install it with: pip install psycopg2-binary"
            ) from exc
    else:
        # SQLite path — default demo mode
        conn = _get_sqlite_conn()
        try:
            yield conn
            conn.commit()
        except Exception:
            conn.rollback()
            raise


def fetchall(db: Any, query: str, params: tuple = ()) -> list[dict]:
    """Execute a SELECT and return all rows as plain dicts."""
    if DATABASE_URL:
        db.execute(query, params)
        return [dict(row) for row in db.fetchall()]
    else:
        rows = db.execute(query, params).fetchall()
        return [dict(row) for row in rows]


def fetchone(db: Any, query: str, params: tuple = ()) -> dict | None:
    """Execute a SELECT and return the first row as a plain dict, or None."""
    if DATABASE_URL:
        db.execute(query, params)
        row = db.fetchone()
        return dict(row) if row else None
    else:
        row = db.execute(query, params).fetchone()
        return dict(row) if row else None


def execute(db: Any, query: str, params: tuple = ()) -> None:
    """Execute a non-SELECT statement."""
    db.execute(query, params)
