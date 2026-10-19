
import { LogOut, CheckSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../features/auth/authSlice";
import { clearTasks } from "../features/tasks/taskSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearTasks());
    toast.success("Logged out successfully");
    navigate("/login", { replace: true });
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6">
      <div className="flex items-center gap-2.5 text-indigo-600">
        <CheckSquare size={25} aria-hidden="true" />
        <span className="text-lg font-bold tracking-tight text-slate-900">TaskFlow</span>
      </div>

      <div className="flex items-center gap-3">
        <span className="hidden text-sm font-medium text-slate-600 sm:inline">
          {user?.name || "User"}
        </span>
        <button
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleLogout}
        >
          <LogOut size={17} aria-hidden="true" />
          Logout
        </button>
      </div>
    </header>
  );
}
