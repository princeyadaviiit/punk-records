"""
Punk Records — Fuzzy Cross-Match (RapidFuzz)

Wraps RapidFuzz ratio computation for field-level comparison across
document pairs belonging to the same citizen.

No LLM is involved. RapidFuzz produces a deterministic score [0, 100]
for any given input pair.

Threshold: 90.0 — below this, the pair is considered a mismatch and
cross_verification_results.below_threshold is set True.
"""

from typing import Tuple
from rapidfuzz import fuzz

# ---------------------------------------------------------------------------
# Configurable threshold — below this score, a cross-document field pair
# is flagged as a mismatch. 90% balances OCR-variance tolerance against
# catching real mismatches like "Kumar" vs "Kumaar".
# ---------------------------------------------------------------------------
MATCH_THRESHOLD = 90.0


def normalise(value: str) -> str:
    """Lowercase, strip whitespace — minimal normalisation for name/address comparison."""
    return value.lower().strip()


def compute_match_score(val_a: str, val_b: str) -> float:
    """
    Return RapidFuzz token_sort_ratio score [0.0, 100.0] for val_a vs val_b.
    token_sort_ratio handles word-order variation; ratio is used for character
    similarity within the same language.
    """
    return fuzz.ratio(normalise(val_a), normalise(val_b))


def is_below_threshold(score: float, threshold: float = MATCH_THRESHOLD) -> bool:
    return score < threshold


def compare_field(
    val_a: str, val_b: str, field_name: str
) -> Tuple[float, bool, str]:
    """
    Compare two field values and return:
        (match_score, below_threshold, explanation)

    explanation is plain-language, suitable for storage in
    cross_verification_results.explanation and direct rendering in the UI.
    """
    score = compute_match_score(val_a, val_b)
    below = is_below_threshold(score)

    if below:
        explanation = (
            f"{field_name.capitalize()} '{val_a}' vs '{val_b}' — "
            f"similarity score {score:.1f}%, below the {MATCH_THRESHOLD}% confidence threshold. "
            "Likely a transcription variant; manual confirmation required before clearing."
        )
    else:
        explanation = (
            f"{field_name.capitalize()} '{val_a}' matches '{val_b}' "
            f"(similarity {score:.1f}%)."
        )

    return score, below, explanation
