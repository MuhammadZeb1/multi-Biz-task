
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { CheckSquare } from "lucide-react";
import { registerUser } from "../features/auth/authSlice";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token, loading } = useSelector((state) => state.auth);

  if (token) return <Navigate to="/dashboard" replace />;

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await dispatch(registerUser(form)).unwrap();
      toast.success("Account created successfully!");
      navigate("/dashboard", { replace: true });
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Registration failed");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-sky-100 px-4 py-12">
      <form
        className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/10 sm:p-10"
        onSubmit={handleSubmit}
      >
        <div className="mb-8 flex items-center gap-3 text-indigo-600">
          <CheckSquare size={32} aria-hidden="true" />
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">TaskFlow</h1>
        </div>

        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Create your account
        </h2>
        <p className="mb-8 mt-2 text-sm text-slate-600">
          Start organizing your work today.
        </p>

        <label className="text-sm font-medium text-slate-700" htmlFor="name">
          Full name
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          placeholder="Your name"
          value={form.name}
          onChange={handleChange}
          minLength={2}
          maxLength={50}
          className="mb-5 mt-1 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
          required
        />

        <label className="text-sm font-medium text-slate-700" htmlFor="email">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          className="mb-5 mt-1 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
          required
        />

        <label className="text-sm font-medium text-slate-700" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="At least 8 characters"
          value={form.password}
          onChange={handleChange}
          className="mb-6 mt-1 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15"
          minLength={8}
          required
        />

        <button
          className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link className="font-medium text-indigo-600 hover:text-indigo-700" to="/login">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  );
}
