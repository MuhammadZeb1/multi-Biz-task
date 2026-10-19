
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CheckCircle2, Clock3, ListTodo, Plus } from "lucide-react";
import { toast } from "react-toastify";
import StatsCard from "../components/StatsCard";
import TaskCard from "../components/TaskCard";
import {
  fetchDashboard,
  removeTask,
} from "../features/tasks/taskSlice";

export default function Dashboard() {
  const dispatch = useDispatch();

  const { stats, recentTasks, dashboardLoading, dashboardError } = useSelector(
    (state) => state.tasks
  );

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  const handleDelete = async (task) => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;

    try {
      await dispatch(removeTask(task._id)).unwrap();
      toast.success("Task deleted");
      dispatch(fetchDashboard());
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Could not delete task");
    }
  };

  const { user } = useSelector((state) => state.auth);

  return (
    <section className="mx-auto w-full max-w-7xl space-y-8">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-widest text-indigo-600">YOUR WORKSPACE</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Good to see you, {user?.name || "there"}!
          </h1>
          <p className="mt-2 text-sm text-slate-600">Here's an overview of your tasks.</p>
        </div>

        <Link
          to="/tasks"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <Plus size={18} aria-hidden="true" />
          Manage tasks
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Total tasks"
          value={stats?.totalTasks}
          icon={<ListTodo size={22} />}
          color="blue"
        />

        <StatsCard
          title="To do"
          value={stats?.todo}
          icon={<Clock3 size={22} />}
          color="orange"
        />

        <StatsCard
          title="In progress"
          value={stats?.["in-progress"]}
          icon={<Clock3 size={22} />}
          color="purple"
        />

        <StatsCard
          title="Completed"
          value={stats?.completed}
          icon={<CheckCircle2 size={22} />}
          color="green"
        />
      </div>

      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Recent tasks</h2>
          <p className="mt-1 text-sm text-slate-500">Your latest activity</p>
        </div>
        <Link
          to="/tasks"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
        >
          View all tasks
        </Link>
      </div>

      {dashboardLoading && (
        <p className="text-sm text-slate-500" role="status">
          Loading dashboard...
        </p>
      )}

      {dashboardError && (
        <div
          className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800"
          role="alert"
        >
          <p>{dashboardError}</p>
          <button
            className="mt-2 font-semibold underline underline-offset-2"
            onClick={() => dispatch(fetchDashboard())}
          >
            Try again
          </button>
        </div>
      )}

      {!dashboardLoading && !dashboardError && recentTasks.length === 0 && (
        <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
          <ListTodo size={38} className="text-slate-400" aria-hidden="true" />
          <h3 className="mt-4 text-base font-semibold text-slate-900">No tasks yet</h3>
          <p className="mt-1 text-sm text-slate-500">Create your first task to get started.</p>
          <Link
            to="/tasks"
            className="mt-5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Create a task
          </Link>
        </div>
      )}

      {!dashboardError && (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {recentTasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
}
