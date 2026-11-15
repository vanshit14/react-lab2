"""Run the section-9 sample exercise, restoring the production page in finally.

Original ai-sample/ and test/ files are never modified. Browser observations are
not part of this script. Requires the project's already installed npm packages.
"""
from pathlib import Path
import hashlib
import json
import subprocess
import tempfile

ROOT = Path(__file__).resolve().parent.parent
PAGE = ROOT / "src/courses/CoursesPage.jsx"
SAMPLE = ROOT / "ai-sample/CoursesPage.jsx"


def replace_once(text, before, after):
    assert text.count(before) == 1, before
    return text.replace(before, after, 1)


def variants():
    source = SAMPLE.read_text(encoding="utf-8")
    yield "Original supplied sample", source
    source = replace_once(source,
        '  const sortedCourses = useMemo(() => {\n'
        '    return [...courses].sort((a, b) => a.code.localeCompare(b.code));\n'
        '  }, [courses]);',
        '  const sortedCourses = [...courses].sort((a, b) => a.code.localeCompare(b.code));')
    yield "Removed useMemo", source
    source = replace_once(source,
        '  const fetchCourses = useCallback(async () => {',
        '  async function fetchCourses() {')
    source = replace_once(source, '  }, []);', '  }')
    source = replace_once(source, '  }, [fetchCourses]);', '  }, []);')
    yield "Removed fetch useCallback", source
    source = replace_once(source,
        '  const handleSubmit = useCallback(\n    async (e) => {',
        '  async function handleSubmit(e) {')
    source = replace_once(source,
        '    },\n    [code, title, department, credits, capacity, description, fetchCourses]\n  );',
        '  }')
    yield "Removed submit useCallback", source
    source = replace_once(source, '  const codeInputRef = useRef(null);\n', '')
    source = replace_once(source, ' ref={codeInputRef}', '')
    source = replace_once(source, '        codeInputRef.current?.focus();\n', '')
    source = replace_once(source,
        'import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";',
        'import { useState, useEffect } from "react";')
    yield "Removed useRef and unused imports", source


def main():
    production = PAGE.read_bytes()
    rows = []
    try:
        for label, source in variants():
            PAGE.write_text(source, encoding="utf-8")
            with tempfile.TemporaryDirectory(prefix="lab2-strip-") as temporary:
                report = Path(temporary) / "result.json"
                command = ["npm.cmd", "exec", "--", "vitest", "run",
                           "test/courses/CoursesPage.test.jsx", "--reporter=json",
                           f"--outputFile={report}"]
                result = subprocess.run(command, cwd=ROOT, capture_output=True,
                                        text=True, encoding="utf-8", errors="replace")
                data = json.loads(report.read_text(encoding="utf-8")) if report.exists() else {}
                row = {"step": label, "passed": data.get("numPassedTests", 0),
                       "failed": data.get("numFailedTests", 0), "exit_code": result.returncode}
                rows.append(row)
                print(json.dumps(row), flush=True)
                if result.returncode != 0 or row["passed"] != 4 or row["failed"]:
                    raise RuntimeError(result.stdout + result.stderr)
                (ROOT / "verification/stripped-sample.jsx.txt").write_text(source, encoding="utf-8")
    finally:
        PAGE.write_bytes(production)
        report = {"method": "Supplied page tests against temporary sample variants",
                  "browser_checked": False, "steps": rows,
                  "production_restored": PAGE.read_bytes() == production,
                  "production_sha256": hashlib.sha256(production).hexdigest()}
        (ROOT / "verification/strip-check.json").write_text(json.dumps(report, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
