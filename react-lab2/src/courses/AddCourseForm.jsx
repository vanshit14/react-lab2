import { useState } from "react";

const EMPTY_FORM = {
  code: "", title: "", department: "", credits: "", capacity: "", description: "",
};
const FIELDS = [
  { name: "code", label: "Code", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "department", label: "Department", type: "text" },
  { name: "credits", label: "Credits", type: "number" },
  { name: "capacity", label: "Capacity", type: "number" },
  { name: "description", label: "Description" },
];

export function AddCourseForm({ onAdd }) {
  const [fields, setFields] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function changeField(event) {
    const { name, value } = event.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      await onAdd({
        ...fields,
        credits: Number(fields.credits),
        capacity: Number(fields.capacity),
        description: fields.description === "" ? null : fields.description,
      });
      setFields(EMPTY_FORM);
    } catch (error) {
      setError(error);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="add-course" onSubmit={submit} noValidate>
      <h2>Add a course</h2>
      {FIELDS.map(({ name, label, type }) => {
        const fieldError = error?.fieldErrors?.[name];
        const id = `add-course-${name}`;
        const inputProps = {
          id,
          name,
          value: fields[name],
          onChange: changeField,
          "aria-invalid": fieldError ? "true" : undefined,
          "aria-describedby": fieldError ? `${id}-error` : undefined,
        };
        return (
          <div className="field" key={name}>
            <label htmlFor={id}>{label}</label>
            {name === "description"
              ? <textarea {...inputProps} />
              : <input {...inputProps} type={type} />}
            {fieldError && <p className="field-error" id={`${id}-error`}>{fieldError}</p>}
          </div>
        );
      })}
      {error && <p className="form-error" role="alert">{error.message}</p>}
      <button type="submit" disabled={submitting}>Add course</button>
    </form>
  );
}
