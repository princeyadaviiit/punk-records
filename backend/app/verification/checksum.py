"""
Punk Records — Checksum Validation

Implements deterministic document checksum / structural validation:
  1. PAN card structural format check (regex, no external API)
  2. Aadhaar number Verhoeff checksum algorithm (hand-implemented)

No LLM involved. These are fully auditable, deterministic checks
with zero external dependencies.

Reference — Verhoeff algorithm tables:
  https://en.wikipedia.org/wiki/Verhoeff_algorithm
"""

import re
from typing import Tuple

# ---------------------------------------------------------------------------
# PAN Card — Structural Format Check
# Format: AAAAA9999A  (5 alpha, 4 digit, 1 alpha)
# ---------------------------------------------------------------------------
_PAN_PATTERN = re.compile(r"^[A-Z]{5}[0-9]{4}[A-Z]{1}$")


def validate_pan_format(pan: str) -> Tuple[bool, str]:
    """
    Validate a PAN number against the structural pattern [A-Z]{5}[0-9]{4}[A-Z]{1}.

    Returns:
        (is_valid: bool, reason: str)
    """
    pan = pan.strip().upper()
    if not pan:
        return False, "PAN number is empty."
    if not _PAN_PATTERN.match(pan):
        return False, (
            f"PAN '{pan}' does not match the required format "
            "[5 uppercase letters][4 digits][1 uppercase letter]. "
            "Example: ABCDE1234F"
        )
    return True, "PAN format is structurally valid."


# ---------------------------------------------------------------------------
# Aadhaar — Verhoeff Checksum Algorithm
# Hand-implemented; auditable, deterministic, no external dependency.
# ---------------------------------------------------------------------------

# Multiplication table d
_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]

# Permutation table p
_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]

# Inverse table inv
_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]


def _verhoeff_checksum(number: str) -> bool:
    """Return True if number passes the Verhoeff checksum."""
    c = 0
    for i, digit in enumerate(reversed(number)):
        c = _D[c][_P[i % 8][int(digit)]]
    return c == 0


def validate_aadhaar(aadhaar: str) -> Tuple[bool, str]:
    """
    Validate an Aadhaar number:
      - Must be 12 digits.
      - Must not start with 0 or 1 (UIDAI specification).
      - Must pass the Verhoeff checksum.

    Returns:
        (is_valid: bool, reason: str)
    """
    aadhaar = re.sub(r"\s+", "", aadhaar.strip())  # strip whitespace / spaces

    if not aadhaar.isdigit():
        return False, "Aadhaar number must contain only digits."
    if len(aadhaar) != 12:
        return False, f"Aadhaar number must be exactly 12 digits (got {len(aadhaar)})."
    if aadhaar[0] in ("0", "1"):
        return False, "Aadhaar number cannot start with 0 or 1 (UIDAI specification)."
    if not _verhoeff_checksum(aadhaar):
        return False, "Aadhaar number fails Verhoeff checksum — structurally invalid."

    return True, "Aadhaar number passes Verhoeff checksum validation."
