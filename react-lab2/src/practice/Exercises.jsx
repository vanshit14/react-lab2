// Optional section-16 examples. The contract's production page is unchanged.
import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";
import { CoursesView } from "../courses/CoursesView.jsx";

const byCode = (a, b) => a.code.localeCompare(b.code);

function useCourseLoader(department = "", attempt = 0) {
  const [state, setState] = useState({ courses: [], status: "loading", error: null });
  useEffect(() => {
    let ignore = false;
    setState({ courses: [], status: "loading", error: null });
    const suffix = department ? `?${new URLSearchParams({ department })}` : "";
    apiFetch(`/api/courses${suffix}`)
      .then((courses) => {
        if (!ignore) setState({ courses, status: "ready", error: null });
      })
      .catch((error) => {
        if (!ignore) setState({ courses: [], status: "error", error: error.message });
      });
    return () => { ignore = true; };
  }, [department, attempt]);
  return [state, setState];
}

export function useOptimisticCourses() {
  const [state, setState] = useCourseLoader();
  async function addCourse(request) {
    if (state.status !== "ready") throw new Error("Wait for courses to load before adding.");
    const temporary = {
      ...request,
      id: `pending-${Date.now()}-${request.code}`,
      seatsLeft: request.capacity,
    };
    setState((prev) => ({ ...prev, courses: [...prev.courses, temporary].sort(byCode) }));
    try {
      const created = await apiFetch("/api/courses", { method: "POST", body: request });
      setState((prev) => ({
        ...prev,
        courses: prev.courses.map((course) => course.id === temporary.id ? created : course).sort(byCode),
      }));
      return created;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        courses: prev.courses.filter((course) => course.id !== temporary.id),
      }));
      throw error;
    }
  }
  return { ...state, addCourse };
}

export function useRetryableCourses() {
  const [attempt, setAttempt] = useState(0);
  const [state] = useCourseLoader("", attempt);
  function retry() { setAttempt((prev) => prev + 1); }
  return { ...state, retry };
}

export function RetryableCoursesView({ courses, status, error, onRetry }) {
  return (
    <>
      <CoursesView courses={courses} status={status} error={error} />
      {status === "error" && <button type="button" onClick={onRetry}>Try again</button>}
    </>
  );
}

export function RetryExample() {
  const { courses, status, error, retry } = useRetryableCourses();
  return <RetryableCoursesView courses={courses} status={status} error={error} onRetry={retry} />;
}

export function useDepartmentCourses(department) {
  const [state] = useCourseLoader(department);
  return state;
}

export function DepartmentExample({ departments = ["Computer Science", "Data Science & AI", "Mathematics"] }) {
  const [department, setDepartment] = useState("");
  const { courses, status, error } = useDepartmentCourses(department);
  return (
    <section>
      <label htmlFor="practice-department">Department</label>
      <select id="practice-department" value={department} onChange={(event) => setDepartment(event.target.value)}>
        <option value="">All departments</option>
        {departments.map((name) => <option key={name} value={name}>{name}</option>)}
      </select>
      <CoursesView courses={courses} status={status} error={error} />
    </section>
  );
}
