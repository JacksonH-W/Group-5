from pathlib import Path
import pytest

CASES = Path(__file__).resolve().parents[1] / "fixtures" / "cases"

def test_all_fixture_cases():
    if not CASES.exists():
        pytest.skip(f"No fixture cases directory found at {CASES}")

    case_dirs = [p for p in CASES.iterdir() if p.is_dir()]
    if not case_dirs:
        pytest.skip(f"No fixture case folders found in {CASES}")

    for case_dir in sorted(case_dirs):
        inp = (case_dir / "input.txt").read_text()
        expected = (case_dir / "expected.txt").read_text()

        # TODO: replace this with your real function/program call
        actual = inp

        assert actual == expected, f"Failed fixture: {case_dir.name}"
