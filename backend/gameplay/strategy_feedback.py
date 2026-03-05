from __future__ import annotations


def summarize_strategy_decisions(
    decisions: list[dict[str, object]],
) -> tuple[bool, str, str]:
    """
    Return overall correctness and a representative (played, recommended) pair.

    If any decision is incorrect, the first incorrect decision is returned so the
    summary text always explains the actual miss. If all decisions are correct,
    the first decision pair is returned.
    """
    if not decisions:
        return False, "", ""

    for decision in decisions:
        if not bool(decision.get("correct", False)):
            return (
                False,
                str(decision.get("action", "")),
                str(decision.get("recommended", "")),
            )

    first = decisions[0]
    return True, str(first.get("action", "")), str(first.get("recommended", ""))
