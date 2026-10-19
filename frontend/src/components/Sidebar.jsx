
import { LayoutDashboard, ListTodo } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    `flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition md:flex-none md:justify-start ${
      isActive
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <aside className="flex items-center gap-2 border-b border-slate-200 bg-white p-3 md:w-60 md:shrink-0 md:flex-col md:items-stretch md:gap-1 md:border-b-0 md:border-r md:p-4">
      <p className="hidden px-3 pb-2 pt-3 text-xs font-semibold tracking-wider text-slate-400 md:block">
        WORKSPACE
      </p>

      <NavLink to="/dashboard" className={linkClass}>
        <LayoutDashboard size={19} aria-hidden="true" />
        Dashboard
      </NavLink>

      <NavLink to="/tasks" className={linkClass}>
        <ListTodo size={19} aria-hidden="true" />
        My Tasks
      </NavLink>
    </aside>
  );
}
