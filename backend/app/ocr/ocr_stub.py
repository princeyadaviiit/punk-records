"""
Punk Records — OCR Stub

⚠️  OCR IS INTENTIONALLY DISABLED FOR THIS MVP BUILD.

Reason: Live Tesseract OCR on document images introduces significant
demo-stability risk (image quality variance, Tesseract tuning, live
camera availability) with no proportional demo payoff. The citizen
dropdown selector in the UI provides an honest, labeled substitute.

This module exists so the OCR pathway is visible in the codebase and
clearly marked as a named scope cut — it is NOT silently absent.

Phase B: Re-enable with real Tesseract tuning and image-variance testing
before demoing on actual document images.

See: docs/rules.md §"Named MVP Scope Cuts"
     docs/TRD.md §7 "Explicit Scope Cuts"
"""

# OCR_ENABLED is a guard used by any future caller.
# It MUST remain False for the MVP build.
OCR_ENABLED = False


def extract_fields_from_image(image_bytes: bytes, doc_type: str) -> dict:
    """
    [STUB — DISABLED]

    In the live pipeline this would:
      1. Run pytesseract.image_to_data() on the image.
      2. Parse the returned hOCR/TSV for document-specific regions.
      3. Return a structured dict matching the `documents.fields` schema.

    For MVP: raises NotImplementedError to make accidental invocation obvious.
    Citizen dropdown + pre-structured seed JSON replaces this flow.
    """
    raise NotImplementedError(
        "OCR pipeline is intentionally disabled for the Punk Records MVP. "
        "Citizen selection via dropdown replaces image-based document scan for the demo. "
        "Set OCR_ENABLED = True and implement this function for Phase B real-image pipeline."
    )
