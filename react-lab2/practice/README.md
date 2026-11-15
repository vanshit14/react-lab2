# Optional section-16 practice

These are assistant-written examples, not a claim of unaided learner work.
They are kept outside the default page so the production Courses slice retains
the API and composition required by CONTRACT.md. To experiment, temporarily
render an example, then restore the given App.jsx before submission.

- P1: `useOptimisticCourses` in `src/practice/Exercises.jsx` inserts a temporary
  course, replaces it with the POST response, and rolls it back on failure.
  Functional updates preserve other changes. The production hook deliberately
  keeps the simpler server-confirmed insert required by the core exercise.
- P2: `useRetryableCourses`, `RetryableCoursesView` and `RetryExample` add an
  attempt counter and a Try again callback. The view remains render-only.
- P3: `DepartmentExample` owns a controlled select; `useDepartmentCourses`
  delegates loading with a department dependency and encoded query parameters.
  Pass a `departments` array to explore additional department names.
- P4: an async effect returns a Promise where React expects cleanup; no
  dependency array fetches again after each state update; no cleanup also lets
  stale responses win. Use an inner async function or promise chain, explicit
  dependencies and an ignore flag, as the production hooks demonstrate.

The examples are syntax-checked. Interactive browser behavior is not claimed
as verified. No extra packages, TypeScript, context or memoization hooks are used.
