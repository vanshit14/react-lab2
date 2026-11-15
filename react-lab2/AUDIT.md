# Audit - React Lab 2

Name: Vanshit Shah. Roll number: MT2026112.

**Provenance:** This is an assistant-authored technical audit draft of the first
stage-2 implementation, for the learner to review. It is not a claim that the
learner independently performed the audit or browser checks. The assistant read
CONTRACT.md section 4 before generation; the separate new-chat prompt-1 exercise
was not performed. PROMPTS.md records the actual order. No post-audit fix prompt
or refactor occurred in stage 2. The stage-3 supplement below records later work.

Paths below are relative to src/courses/. Line references describe this initial
stage-2 version. The first generated implementation is preserved in its Git
commit, so later stages can be compared with it.

## 0. What came back

| File | Contents | Lines |
| --- | --- | --- |
| useCourses.js | useCourses: initial fetch, list state, addCourse | 1-40 |
| CoursesView.jsx | Render-only CoursesView | 1-20 |
| AddCourseForm.jsx | Controlled form and submit/error handling | 1-73 |
| CoursesPage.jsx | Composes the hook, view and form | 1-14 |

- Automated initial-draft result: `npm.cmd test` passed 62/62 tests in 9 files;
  `npm.cmd run build` passed. No code fix was needed to obtain this result.
- The supplied page tests verify list load, sorted successful add, duplicate-code
  failure and server validation. Form tests verify field placement and accessibility.
- Browser rendering and Network-panel counts: **not observed**. Learner check pending.
- Expected requests from code/tests: one GET /api/courses per normal mount;
  StrictMode performs an extra effect setup in development. One POST /api/courses
  per add, without another list GET. The supplied client also logs in through
  POST /api/auth/login before its first mutation if it has no cached token.

## 1. Part A - allowed structure

| Element | Location | Assessment |
| --- | --- | --- |
| View only renders | CoursesView.jsx:1 | No hooks, fetch or mutations; keep. |
| Fetch and logic separated | useCourses.js:4 | All Courses API work stays in the hook; keep. |
| Course-list state at shared level | useCourses.js:5 | One object contains courses, status and error; keep. |
| Form input state local to form | AddCourseForm.jsx:16 | Six values in one object; keep. |
| Initial effect with cleanup | useCourses.js:11 | Empty dependency array and cleanup ignore flag; keep. |
| Props down, callbacks up | CoursesPage.jsx:6; AddCourseForm.jsx:25 | Form awaits onAdd; no API calls in form; keep. |
| Stable list key | CoursesView.jsx:8 | course.id identifies each course; keep. |
| Loading/error/empty states | CoursesView.jsx:2 | One status drives the list state; keep. |

## 2. Part B - not-yet scan

Scope: src/courses/, excluding the supplied API client and mock implementation.

| Item | Found? | Decision |
| --- | --- | --- |
| useMemo | No | Not introduced. |
| useCallback | No | Not introduced. |
| useReducer | No | Not introduced. |
| useRef | No | Not introduced. |
| createContext / useContext | No | Not introduced. |
| axios or data-fetching library | No | Supplied apiFetch is used instead. |
| Raw fetch | No | apiFetch occurs only in useCourses.js. |
| TypeScript | No | Plain .js and .jsx. |
| Extra frameworks or packages | No | package.json is unchanged. |

The FIELDS and EMPTY_FORM constants in AddCourseForm.jsx are ordinary JavaScript
values, not frameworks: the former describes the six repeated fields; the latter
supplies the initial/reset values. They do not own mutable application state.

## 3. The rule - each hook and component

| Hook/component | Job in this slice | Recommendation |
| --- | --- | --- |
| useCourses, useCourses.js:4 | Supplies the list lifecycle and add action to its caller | Keep |
| useState, useCourses.js:5 | Remembers courses and the initial request outcome | Keep |
| useEffect, useCourses.js:11 | Fetches once per mount and ignores obsolete replies | Keep |
| CoursesView, CoursesView.jsx:1 | Displays supplied status and course data | Keep |
| AddCourseForm, AddCourseForm.jsx:15 | Owns half-typed fields and their submission feedback | Keep |
| useState, AddCourseForm.jsx:16 | Remembers six controlled input strings | Keep |
| useState, AddCourseForm.jsx:17 | Disables submit while an add is pending | Keep |
| useState, AddCourseForm.jsx:18 | Retains the last error and its fieldErrors | Keep |
| CoursesPage, CoursesPage.jsx:5 | Composes the Courses slice without duplicating logic | Keep |
| useCourses call, CoursesPage.jsx:6 | Connects the page to the hook-owned data and callback | Keep |

The form's two local feedback fields describe a submission, while the hook's
status describes initial list loading. They have different jobs. Counts and
sorted views are not stored as duplicate state. The form's numeric values stay
strings while being edited and become numbers at the API boundary.

## 4. Decisions before any fix prompt

**Assistant recommendations; learner confirmation pending.**

- Cut: no prohibited hook or package was introduced, so none is proposed for removal.
- Move: none; the four responsibilities already match the supplied section-4 shape.
- Add: no missing core requirement was identified by the original tests/static review.
- Keep server validation: form noValidate at AddCourseForm.jsx:46; no required,
  min/max or pattern rules that could block the request in the browser.
- Keep error association: aria-invalid/aria-describedby at lines 56-57,
  error paragraphs after the controls, and the form alert at line 69.
- Keep immutable insertion: useCourses.js:32 appends into a new array before sort;
  no mutation of the previous list, count state, index key or reload-after-add.
- No fix request is invented merely to create an audit/fix narrative.
- Remaining learner action: read this code and confirm or revise these decisions.

## 5. Strip check

The generated production Courses slice introduced no not-yet hook, so no such
hook had to be stripped from it. The separate section-9 exercise was performed
against a temporary copy of the supplied ai-sample/CoursesPage.jsx. Neither the
original sample nor the original tests were edited. After each change the
original page integration tests were run:

| Temporary sample version | Passed | Failed |
| --- | --- | --- |
| Original supplied sample | 4 | 0 |
| Removed useMemo | 4 | 0 |
| Removed fetch useCallback | 4 | 0 |
| Removed submit useCallback | 4 | 0 |
| Removed useRef and unused imports | 4 | 0 |

The final stripped sample is saved as verification/stripped-sample.jsx.txt.
The production CoursesPage was restored byte-for-byte in a finally block.
The executable check and its results are in verification/run_strip_check.py and
verification/strip-check.json. These are automated results, not claims of
learner browser checks.

Why the removals preserve behavior: sorting can run as an ordinary expression;
the load function and submit handler need no memoized identity for this sample;
the ref only provided optional post-submit focus. Removing it leaves the core
list/add behavior intact. Remaining sample smells include duplicated count
state, thirteen state calls in one component, an index key, refetching after add,
and mixed view/form/network responsibilities. The final production slice does
not use that sample implementation.

## 6. Before / after

This table records the initial stage-2 review. Later stage-3 changes and reruns
are documented in section 7 below.

| Item | First generated version | After assistant review |
| --- | --- | --- |
| Source files / components | Four files; three UI components plus a hook | Unchanged |
| useState calls in Courses slice | 1 in useCourses, 3 in AddCourseForm | Unchanged |
| useEffect calls | 1 in useCourses | Unchanged |
| Prohibited hooks | None | None |
| Automated expected requests | Initial GET; POST per add; no list reload | Unchanged |
| Browser Network observation | Not performed | Not performed |
| Core tests | 62 passed, 0 failed | Same source; no unnecessary rerun claimed |
| Build | Passed | Same source |

## 7. Reflections and stage-3 supplement

The learner delegated the reflection suggestions to the assistant. These are
**assistant-proposed reflections**, not a claim of the
learner's independent recollection:

1. A useful detail in the generated form is the association between each server
   error and its input through aria-invalid and aria-describedby. This makes
   validation understandable to screen-reader users as well as sighted users.
2. Generated code should be checked for unnecessary refetches, stale-response
   handling, mutation of state, numeric conversion, and dropped server errors;
   a page that appears to work is not sufficient evidence of correct structure.

### Later changes and evidence

- Debounce now uses one state value and an effect timer with cleanup. The input
  responds immediately; API search receives its settled value after 250 ms.
- Added className values already defined in the given stylesheet: results,
  courses, add-course, field, field-error and form-error. The course metadata
  uses span to match the existing CSS. No stylesheet or API behavior was changed.
- These class-name omissions were identified during stage-3 static review, after
  the initial stage-2 audit. They are recorded here instead of retroactively
  claiming the first audit had already identified them.
- Optional section-16 examples are isolated in src/practice/Exercises.jsx and
  documented in practice/README.md; they do not alter the contract's default
  Courses page. They are assistant-written examples, not unaided practice.
- Core Courses hook/component counts and state ownership are unchanged from
  the first draft. Stage-3 search adds useDebounced and its state/effect.
- Final checks: 62 core tests passed in 9 files; 4 stretch tests passed; the production build passed; the optional practice module and its imports bundled successfully. All five strip-exercise versions passed their four supplied page tests.

### Browser verification

The learner has not yet checked the browser. No result is claimed by either
party. Before submission, run the app and verify:

- Initial Courses list loads, with the 20 seeded courses and no console errors.
- Searching learn returns Machine Learning and Deep Learning; clearing the box
  settles back to idle; a nonsense query shows No courses match.
- Add CS350 / Compiler Design / Computer Science / 4 credits / capacity 40:
  the item appears in code order and inputs clear.
- A duplicate code such as CS101 shows the server error and retains the inputs.
- Lowercase cs350 with credits 9 shows server validation beneath the inputs.
- Inspect Network to confirm no full-list reload after add. Development
  StrictMode can perform two initial effect requests; the supplied client can
  also perform one admin login before its first POST.

Read and confirm this audit yourself before submitting. The implementation and
recorded automated evidence are separate from that personal review.
