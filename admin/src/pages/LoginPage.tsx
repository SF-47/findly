import React, { useState } from "react";
import {
  LockKeyhole,
  LogIn,
  Mail,
  MapPinned,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../services/authService";
import toast from "react-hot-toast";
import { Checkbox } from "@mantine/core";

function LoginPage() {
  const navigate = useNavigate();
  const [formInputs, setFormInputs] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
    loginError: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function validateForm() {
    const newErrors = { emailError: "", passwordError: "", loginError: "" };
    if (!formInputs.email.trim()) newErrors.emailError = "Email is required.";
    if (!formInputs.password.trim())
      newErrors.passwordError = "Password is required.";
    setErrors(newErrors);
    return Object.values(newErrors).some((e) => e !== "");
  }

  //! TS CHANGE : Annotated the form submission event type to prevent implicit any errors
  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (validateForm()) return;
    try {
      setIsLoading(true);
      //! TS CHANGE : Explicitly typecheck payload passed to loginAdmin API service
      const data = await loginAdmin({
        email: formInputs.email,
        password: formInputs.password,
      });
      if (rememberMe) {
        localStorage.setItem("admin", JSON.stringify(data));
        sessionStorage.removeItem("admin");
      } else {
        sessionStorage.setItem("admin", JSON.stringify(data));
        localStorage.removeItem("admin");
      }
      toast.success("Logged in successfully.");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      console.log(error);
      const backendErrors = error.response?.data?.errors;
      const newErrors = { emailError: "", passwordError: "", loginError: "" };
      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        backendErrors.forEach((err: string) => {
          if (err.toLowerCase().includes("invalid")) newErrors.loginError = err;
        });
        setErrors(newErrors);
        return;
      }
      toast.error("Failed to login.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-gray-100 text-gray-900 dark:bg-zinc-950 dark:text-white">
      <div className="flex h-full overflow-hidden">
        {/* ── Left Panel ── */}
        <div className="animate-slide-in-left hidden w-1/2 flex-col justify-between overflow-hidden bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 lg:flex relative">
          {/* Subtle pattern overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />

          {/* Glow blobs */}
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-15 -left-15 w-64 h-64 rounded-full bg-purple-900/30 blur-3xl pointer-events-none" />
          <div className="animate-soft-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-white/20 blur-2xl" />

          {/* Brand */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur-sm">
              <MapPinned size={20} />
            </div>
            <span className="font-semibold text-white text-sm tracking-wide">
              Findly
            </span>
          </div>

          {/* Hero copy */}
          <div className="relative z-10 space-y-6">
            <h1 className="text-4xl xl:text-5xl font-bold text-white leading-tight">
              Everything lost,
              <br />
              <span className="text-blue-200">always found.</span>
            </h1>
            <p className="text-blue-100 text-base leading-relaxed max-w-sm">
              Admin dashboard for managing students, categories, lost & found
              items, and possible matches across the university.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              {[
                { val: "24/7", label: "Campus support" },
                { val: "Smart", label: "Item matching" },
                { val: "Live", label: "Status tracking" },
                { val: "Fast", label: "Verification" },
              ].map((s) => (
                <div
                  key={s.val}
                  className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 px-5 py-4 transition-all hover:bg-white/15"
                >
                  <p className="text-2xl font-bold text-white">{s.val}</p>
                  <p className="text-xs text-blue-100 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <p className="relative z-10 text-xs text-blue-200/60">
            Findly · Admin Panel
          </p>
        </div>

        {/* ── Right Panel ── */}
        <div className="animate-slide-in-right flex h-full w-full items-center justify-center overflow-hidden px-6 py-8 lg:w-1/2">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile logo */}
            <div className="flex flex-col items-center text-center lg:hidden">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-white shadow-lg">
                <MapPinned size={26} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Findly
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Admin Dashboard
              </p>
            </div>

            {/* Page heading */}
            <div className="hidden lg:block">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Sign in to manage the Findly platform.
              </p>
            </div>

            {/* Card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
              <form className="space-y-5" onSubmit={handleLogin} noValidate>
                {/* Email */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <Mail size={15} className="text-blue-500" />
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="admin@university.edu"
                    value={formInputs.email}
                    onChange={(e) => {
                      setFormInputs((p) => ({ ...p, email: e.target.value }));
                      setErrors((p) => ({
                        ...p,
                        emailError: "",
                        loginError: "",
                      }));
                    }}
                    className={`w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition
                      focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                      dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500
                      ${
                        errors.emailError
                          ? "border-red-400 dark:border-red-500"
                          : "border-gray-300 dark:border-zinc-700"
                      }`}
                  />
                  {errors.emailError && (
                    <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">
                      {errors.emailError}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <LockKeyhole size={15} className="text-blue-500" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formInputs.password}
                      onChange={(e) => {
                        setFormInputs((p) => ({
                          ...p,
                          password: e.target.value,
                        }));
                        setErrors((p) => ({
                          ...p,
                          passwordError: "",
                          loginError: "",
                        }));
                      }}
                      className={`w-full rounded-xl border bg-gray-50 px-4 py-3 pr-11 text-sm text-gray-900 outline-none transition
                        focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                        dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500
                        ${
                          errors.passwordError
                            ? "border-red-400 dark:border-red-500"
                            : "border-gray-300 dark:border-zinc-700"
                        }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.passwordError && (
                    <p className="mt-1.5 text-xs font-medium text-red-500 dark:text-red-400">
                      {errors.passwordError}
                    </p>
                  )}
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <Checkbox
                    checked={rememberMe}
                    onChange={(event) =>
                      setRememberMe(event.currentTarget.checked)
                    }
                    label="Remember me"
                    color="blue"
                    size="sm"
                    classNames={{
                      label:
                        "cursor-pointer select-none text-sm text-gray-500 dark:text-gray-400",
                      input: "cursor-pointer",
                    }}
                  />
                </div>

                {/* Login-level error */}
                {errors.loginError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400">
                    {errors.loginError}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg duration-300 hover:from-blue-600 hover:to-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? (
                    <RefreshCw size={17} className="animate-spin" />
                  ) : (
                    <LogIn size={17} />
                  )}
                  {isLoading ? "Signing in…" : "Sign In"}
                </button>
              </form>
            </div>

            <p className="text-center text-xs text-gray-400 dark:text-zinc-600">
              Findly · Admin Panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
