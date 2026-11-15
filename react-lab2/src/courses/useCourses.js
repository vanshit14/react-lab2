import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export function useCourses() {
  const [state, setState] = useState({
    courses: [],
    status: "loading",
    error: null,
  });

  useEffect(() => {
    let ignore = false;
    apiFetch("/api/courses")
      .then((courses) => {
        if (!ignore) setState({ courses, status: "ready", error: null });
      })
      .catch((error) => {
        if (!ignore) {
          setState({ courses: [], status: "error", error: error.message });
        }
      });
    return () => {
      ignore = true;
    };
  }, []);

  async function addCourse(courseRequest) {
    const created = await apiFetch("/api/courses", {
      method: "POST",
      body: courseRequest,
    });
    setState((prev) => ({
      ...prev,
      courses: [...prev.courses, created].sort((a, b) => a.code.localeCompare(b.code)),
    }));
    return created;
  }

  return { ...state, addCourse };
}
