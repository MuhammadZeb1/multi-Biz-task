
import { CalendarDays, Pencil, Trash2 } from "lucide-react";

const statusLabels = {
  todo: "To do",
  "in-progress": "In progress",
  completed: "Completed",
};

const statusStyles = {
  todo: "bg-slate-100 text-slate-700",
  "in-progress": "bg-amber-100 text-amber-800",
  completed: "bg-emerald-100 text-emerald-800",
};

const priorityStyles = {
  low: "bg-sky-100 text-sky-800",
  medium: "bg-orange-100 text-orange-800",
  high: "bg-rose-100 text-rose-800",
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  return (
    <article className="flex min-w-0 flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[task.status] || statusStyles.todo}`}>
            {statusLabels[task.status] || task.status}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${priorityStyles[task.priority] || priorityStyles.medium}`}>
            {task.priority}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => onEdit?.(task)}
            aria-label="Edit task"
            title="Edit task"
          >
            <Pencil size={17} aria-hidden="true" />
          </button>

          <button
            className="rounded-lg p-2 text-slate-500 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
            onClick={() => onDelete?.(task)}
            aria-label="Delete task"
            title="Delete task"
          >
            <Trash2 size={17} aria-hidden="true" />
          </button>
        </div>
      </div>

      <h3 className="break-words text-base font-semibold text-slate-900">{task.title}</h3>
      <p className="mt-2 min-h-10 break-words text-sm leading-6 text-slate-600">
        {task.description || "No description provided."}
      </p>

      <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        <CalendarDays size={16} aria-hidden="true" />
        <span>{dueDate}</span>
      </div>
    </article>
  );
}
