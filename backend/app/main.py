"""
Punk Records — FastAPI Application Entry Point

Startup sequence:
  1. Initialize DB (SQLite local mode by default; Postgres if DATABASE_URL is set).
  2. Run seed_all() — idempotent, safe to call every startup.
  3. Mount Satellite routers.
  4. Serve.

CORS: allows the Vite dev server (localhost:5173) and any origin for demo flexibility.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.client import get_db
from app.seed.seed_data import seed_all
from app.routes import citizens, checkpoint_traffic, checkpoint_legal, vault

from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app_: FastAPI):
    """Initialise DB and seed demo data on startup."""
    with get_db() as db:
        seed_all(db)
    yield

app = FastAPI(
    title="Punk Records API",
    description=(
        "Cross-document identity verification with purpose-scoped Satellite views. "
        "Each Satellite route returns a structurally scoped Pydantic response — "
        "the OpenAPI schema is itself the proof of the access-control claim.\n\n"
        "**MVP Scope:** Traffic Satellite (live) + Legal Satellite (seeded/disclosed preview)."
    ),
    version="0.1.0-mvp",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Demo mode — tighten per deployment environment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Router registration — routers are declared here in dependency order
# ---------------------------------------------------------------------------
app.include_router(citizens.router)
app.include_router(checkpoint_traffic.router)
app.include_router(checkpoint_legal.router)
app.include_router(vault.router)


@app.get("/", tags=["Health"])
def root():
    return {
        "service": "Punk Records API",
        "status": "ok",
        "mvp_satellites": {
            "traffic": "/api/checkpoint/traffic/{citizen_id}  — live",
            "legal":   "/api/checkpoint/legal/{citizen_id}   — seeded preview",
            "vault":   "/api/vault/{citizen_id}              — read-only citizen view",
        },
        "scope_cuts_disclosed": [
            "OCR pipeline disabled (ocr/ocr_stub.py) — citizen dropdown replaces DL scan",
            "Legal Satellite is a seeded/static preview — live challan DB is Phase B",
            "Vault is read-only static view — full interactivity is Phase B",
            "Civic Literacy Bridge is slide/mockup only — not a live route",
            "Third live Satellite is Phase B",
        ],
    }
