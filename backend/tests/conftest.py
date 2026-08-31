"""
conftest.py — pytest configuration for Punk Records backend tests.

Seeds the database exactly once per session using the lifespan context.
All endpoint tests use the `http_client` fixture which shares the same seeded DB.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture(scope="session")
def http_client():
    """
    Session-scoped HTTP test client. Enters the lifespan context exactly once,
    which calls seed_all() and initializes the SQLite DB before any test runs.
    """
    with TestClient(app) as c:
        yield c
