
import { useState } from "react";
import { X } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  status: "todo",
  priority: "medium",
  dueDate: "",
};

export default function TaskForm({
  initialTask,
  onSubmit,
  onCancel,
  loading = false,
}) {
  const [form, setForm] = useState(() =>
    initialTask
      ? {
          title: initialTask.title || "",
          description: initialTask.description || "",
          status: initialTask.status || "todo",
          priority: initialTask.priority || "medium",
          dueDate: initialTask.dueDate
            ? new Date(initialTask.dueDate).toISOString().slice(0, 10)
            : "",
        }
      : emptyForm
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit({
      ...form,
      dueDate: form.dueDate
        ? new Date(`${form.dueDate}T12:00:00`).toISOString()
        : null,
    });
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm">
      <form
        className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
        onSubmit={handleSubmit}
      >
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {initialTask ? "Edit task" : "Create a task"}
          </h2>

          <button
            type="button"
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onCancel}
            aria-label="Close form"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="title">
          Task title
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="e.g. Finish the project"
          maxLength={100}
          className="mb-4 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
          required
        />

        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Add task details..."
          rows={4}
          maxLength={2000}
          className="mb-4 w-full resize-y rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
        />

        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="status">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
            >
              <option value="todo">To do</option>
              <option value="in-progress">In progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="priority">
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        <label className="mb-1 block text-sm font-medium text-slate-700" htmlFor="dueDate">
          Due date
        </label>
        <input
          id="dueDate"
          type="date"
          name="dueDate"
          value={form.dueDate}
          onChange={handleChange}
          className="mb-6 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
        />

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : initialTask
                ? "Save changes"
                : "Create task"}
          </button>
        </div>
      </form>
    </div>
  );
}
