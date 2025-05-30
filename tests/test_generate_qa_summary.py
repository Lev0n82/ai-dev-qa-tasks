import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import argparse

from scripts.generate_qa_summary import parse_tasks, generate_summary


def test_parse_tasks(tmp_path):
    md = tmp_path / "tasks.md"
    md.write_text(
        """## Tasks\n- [ ] 1.1 Setup env\n- [x] 1.2 Implement feature\n- [ ] 2.1 Write tests\n"""
    )
    tasks = parse_tasks(md)
    assert tasks == [
        "[Todo] Setup env",
        "[Done] Implement feature",
        "[Todo] Write tests",
    ]


def test_generate_summary(tmp_path):
    tasks_file = tmp_path / "tasks.md"
    tasks_file.write_text("## Tasks\n- [ ] 1.1 Do stuff\n")
    coverage = tmp_path / "coverage.txt"
    coverage.write_text("85%")
    bugs = tmp_path / "bugs.txt"
    bugs.write_text("None")
    output = tmp_path / "out.md"

    args = argparse.Namespace(
        tasks_file=tasks_file,
        qa_reviewers="Alice,Bob",
        test_coverage=coverage,
        bugs_fixed=bugs,
        cicd_log_url="http://ci.example", 
        output=output,
    )

    generate_summary(args)
    content = output.read_text()

    assert "# QA Summary" in content
    assert "Alice" in content and "Bob" in content
    assert "85%" in content
    assert "None" in content
