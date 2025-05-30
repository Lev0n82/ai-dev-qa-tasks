import argparse
import re
from pathlib import Path


def parse_tasks(path: Path):
    tasks = []
    if not path.is_file():
        return tasks
    in_tasks_section = False
    task_pattern = re.compile(r"^\s*- \[( |x)\] \d+\.\d+ (.+)")
    with path.open() as f:
        for line in f:
            if line.strip().lower().startswith('## tasks'):
                in_tasks_section = True
                continue
            if in_tasks_section:
                if line.strip().startswith('##') and not line.strip().lower().startswith('## tasks'):
                    break
                m = task_pattern.match(line)
                if m:
                    status = 'Done' if m.group(1) == 'x' else 'Todo'
                    tasks.append(f"[{status}] {m.group(2).strip()}")
    return tasks


def read_text(path: Path):
    if path and path.is_file():
        return path.read_text().strip()
    return ''


def generate_summary(args):
    tasks = parse_tasks(args.tasks_file) if args.tasks_file else []
    coverage = read_text(args.test_coverage)
    bugs = read_text(args.bugs_fixed)

    output_lines = [
        '# QA Summary',
        '',
    ]

    if tasks:
        output_lines.append('## Task Names')
        for t in tasks:
            output_lines.append(f'- {t}')
        output_lines.append('')

    if args.qa_reviewers:
        output_lines.append('## QA Reviewer(s)')
        for name in args.qa_reviewers.split(','):
            output_lines.append(f'- {name.strip()}')
        output_lines.append('')

    if coverage:
        output_lines.append('## Test Coverage Results')
        output_lines.append(coverage)
        output_lines.append('')

    if bugs:
        output_lines.append('## Bugs Found / Fixed')
        output_lines.append(bugs)
        output_lines.append('')

    if args.cicd_log_url:
        output_lines.append('## CI/CD Logs')
        output_lines.append(args.cicd_log_url)
        output_lines.append('')

    Path(args.output).write_text('\n'.join(output_lines))


def main():
    parser = argparse.ArgumentParser(description='Generate qa-summary.md for compliance audits')
    parser.add_argument('--tasks-file', type=Path, help='Path to tasks markdown file')
    parser.add_argument('--qa-reviewers', help='Comma-separated list of QA reviewer names')
    parser.add_argument('--test-coverage', type=Path, help='Path to test coverage results file')
    parser.add_argument('--bugs-fixed', type=Path, help='Path to bugs found/fixed file')
    parser.add_argument('--cicd-log-url', help='Link to CI/CD logs')
    parser.add_argument('--output', default='qa-summary.md', help='Output markdown file')
    args = parser.parse_args()
    generate_summary(args)


if __name__ == '__main__':
    main()
