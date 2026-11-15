# React Lab 2 - Feature Requests

Name: Vanshit Shah
Roll number: MT2026112
AI tool: Codex


## Prompt 1 - Build the course search

```text
Create a course-search feature with a controlled search input labelled Search
courses and a heading Search the catalogue. Use the existing apiFetch client to
request matching courses. Trim the query and encode it with URLSearchParams.
Do not send requests for blank queries. Show searching, error, no-match and
result states. Ignore outdated responses when the query changes. Keep the
fetching logic in a custom hook and the results component render-only. Use only
useState and useEffect, and do not add packages or change the supplied tests.
```

**Implementation:** SearchResults.jsx, useCourseSearch.js and CourseSearch.jsx.
The query is controlled by state, results use course IDs as keys, and effect
cleanup prevents stale responses from replacing newer results.

**Validation:** 20 search tests and 7 supplied API-client tests passed.

## Prompt 2 - Add the Courses list and form

```text
Implement the Courses list and add-course form according to CONTRACT.md. Load
the list when the page mounts and show loading, error and empty states. Display
each course's code, title, credits, department and available seats. Provide the
six labelled fields Code, Title, Department, Credits, Capacity and Description.
Send credits and capacity as numbers and an empty description as null. Disable
submission while waiting. On success, insert the returned course in code order
without reloading the list and clear the form. On failure, keep the entered
values and show the server message and accessible errors beneath their inputs.
Separate the hook, render-only view, form and page composition. Use the supplied
API client and only the allowed hooks.
```

**Implementation:** useCourses.js, CoursesView.jsx, AddCourseForm.jsx and
CoursesPage.jsx. The hook owns list state and requests; the form owns input and
submission state; the page passes data and callbacks between them.

**Validation:** All 62 core tests and the production build passed.

## Prompt 3 - Add debounce and finish verification

```text
Add a useDebounced hook so the search waits until typing has stopped for 250 ms
before requesting results. Cancel obsolete timers during cleanup. Apply the
class names provided by the existing stylesheet. Complete the sample exercise
by removing unnecessary memoization and ref hooks one at a time, checking the
page after each change and restoring the production implementation afterward.
Keep the optional practice examples separate from the default application.
Finish the technical audit, run all core and stretch checks, and prepare the
submission files with the Git history.
```

**Implementation:** useDebounced.js and its search integration, styling class
names, sample-strip verification records and separate optional practice examples.
AUDIT.md contains the technical review and clearly labelled suggested reflections.

**Validation:** 62 core tests and 4 stretch tests passed. The production build
and practice-module import check passed. All four page tests passed for each of
the five sample-strip versions. Browser verification remains to be performed.
