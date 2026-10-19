
import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";
import {
  fetchTasks,
  addTask,
  editTask,
  removeTask,
} from "../features/tasks/taskSlice";

const initialFilters = {
  search: "",
  status: "",
  priority: "",
  sort: "newest",
};

export default function Tasks() {
  const dispatch = useDispatch();
  const { items, loading, tasksError } = useSelector((state) => state.tasks);

  const [filters, setFilters] = useState(initialFilters);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
      );

      dispatch(fetchTasks(activeFilters));
    }, 250);

    return () => clearTimeout(timer);
  }, [dispatch, filters]);

  const changeFilter = (event) => {
    setFilters((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const openCreateForm = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const openEditForm = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const handleSubmit = async (data) => {
    setSaving(true);

    try {
      if (editingTask) {
        await dispatch(
          editTask({ id: editingTask._id, data })
        ).unwrap();

        toast.success("Task updated successfully");
      } else {
        await dispatch(addTask(data)).unwrap();
        toast.success("Task created successfully");
      }

      closeForm();

      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
      );

      await dispatch(fetchTasks(activeFilters)).unwrap();
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Could not save task");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    try {
      await dispatch(removeTask(task._id)).unwrap();
      toast.success("Task deleted successfully");

      const activeFilters = Object.fromEntries(
        Object.entries(filters).filter(([, value]) => value !== "")
      );

      dispatch(fetchTasks(activeFilters));
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Could not delete task");
    }
  };

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-indigo-600">TASK MANAGEMENT</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Tasks
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Organize your work and track your progress.
          </p>
        </div>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={openCreateForm}
        >
          <Plus size={18} aria-hidden="true" />
          New task
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 xl:grid-cols-4">
        <div className="relative">
          <Search
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            aria-hidden="true"
          />
          <input
            name="search"
            placeholder="Search tasks..."
            value={filters.search}
            onChange={changeFilter}
            className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
          />
        </div>

        <select
          name="status"
          value={filters.status}
          onChange={changeFilter}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
        >
          <option value="">All statuses</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          name="priority"
          value={filters.priority}
          onChange={changeFilter}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
        >
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <select
          name="sort"
          value={filters.sort}
          onChange={changeFilter}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
        >
          <option value="newest">Newest first</option>
          <option value="dueDate">Due date</option>
        </select>
      </div>

      {loading && <p className="text-sm text-slate-500">Loading tasks...</p>}

      {tasksError && (
        <div
          className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          role="alert"
        >
          <p>{tasksError}</p>
          <button
            className="mt-2 font-semibold underline underline-offset-2"
            onClick={() => {
              const activeFilters = Object.fromEntries(
                Object.entries(filters).filter(([, value]) => value !== "")
              );
              dispatch(fetchTasks(activeFilters));
            }}
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !tasksError && items.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <Search size={36} className="text-slate-400" aria-hidden="true" />
          <h3 className="mt-4 text-base font-semibold text-slate-900">No matching tasks</h3>
          <p className="mt-1 text-sm text-slate-500">
            Try changing your filters or create a new task.
          </p>
          <button
            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            onClick={openCreateForm}
          >
            Create task
          </button>
        </div>
      )}

      {!tasksError && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {items.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={openEditForm}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {showForm && (
        <TaskForm
          initialTask={editingTask}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          loading={saving}
        />
      )}
    </section>
  );
}
