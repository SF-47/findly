import { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaSearchLocation,
  FaSignInAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";

function LoginPage() {
  const navigate = useNavigate();
  const [formInputs, setFormInputs] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
    loginError: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  function validateForm() {
    const newErrors = {
      emailError: "",
      passwordError: "",
      loginError: "",
    };

    if (!formInputs.email.trim()) {
      newErrors.emailError = "Email is required.";
    }

    if (!formInputs.password.trim()) {
      newErrors.passwordError = "Password is required.";
    }

    setErrors(newErrors);

    return Object.values(newErrors).some((error) => error !== "");
  }

  async function handleLogin(e) {
    e.preventDefault();
    const hasErrors = validateForm();

    if (hasErrors) {
      return;
    }
    try {
      setIsLoading(true);
      const response = await axiosClient.post("/auth/admin/login", formInputs);

      if (rememberMe) {
        localStorage.setItem("admin", JSON.stringify(response.data));
        sessionStorage.removeItem("admin");
      } else {
        sessionStorage.setItem("admin", JSON.stringify(response.data));
        localStorage.removeItem("admin");
      }

      toast.success("Logged in successfully.");
      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      const backendErrors = error.response?.data?.errors;

      const newErrors = {
        emailError: "",
        passwordError: "",
        loginError: "",
      };

      if (Array.isArray(backendErrors) && backendErrors.length > 0) {
        backendErrors.forEach((err) => {
          const lowerError = err.toLowerCase();
          if (lowerError.includes("invalid")) {
            newErrors.loginError = err;
          }
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
    <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-zinc-950 dark:text-white">
      <div className="flex min-h-screen">
        {/* Left Side */}
        <div className="hidden w-1/2 items-center justify-center bg-linear-to-br from-blue-600 via-indigo-600 to-purple-700 p-10 lg:flex">
          <div className="max-w-lg text-white">
            <div className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 text-4xl shadow-xl backdrop-blur-sm">
              <FaSearchLocation />
            </div>

            <h1 className="text-5xl font-bold leading-tight">
              Smart Lost & Found
            </h1>

            <p className="mt-5 text-lg leading-8 text-blue-50">
              Admin dashboard for managing students, categories, lost items,
              found items, and possible matches inside the university.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-sm">
                <h3 className="text-3xl font-bold">24/7</h3>
                <p className="mt-1 text-sm text-blue-50">Campus support</p>
              </div>

              <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-sm">
                <h3 className="text-3xl font-bold">Smart</h3>
                <p className="mt-1 text-sm text-blue-50">Item matching</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex w-full items-center justify-center px-6 py-10 lg:w-1/2">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-8 flex flex-col items-center text-center lg:hidden">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-r from-blue-500 to-indigo-600 text-3xl text-white shadow-lg">
                <FaSearchLocation />
              </div>

              <h1 className="text-3xl font-bold">Smart Lost & Found</h1>

              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Admin Dashboard
              </p>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl dark:border-zinc-700 dark:bg-zinc-900">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Admin Login
                </h2>

                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Sign in to manage the Smart Lost & Found platform.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    <FaEnvelope className="text-blue-600 dark:text-blue-400" />
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={formInputs.email}
                    onChange={(e) => {
                      setFormInputs((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        emailError: "",
                        loginError: "",
                      }));
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
                  />
                  {errors.emailError && (
                    <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                      {errors.emailError}
                    </p>
                  )}
                </div>

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300">
                    <FaLock className="text-blue-600 dark:text-blue-400" />
                    Password
                  </label>

                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={formInputs.password}
                    onChange={(e) => {
                      setFormInputs((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }));

                      setErrors((prev) => ({
                        ...prev,
                        passwordError: "",
                        loginError: "",
                      }));
                    }}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-blue-500 focus:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:placeholder:text-zinc-500 dark:focus:bg-zinc-800"
                  />
                  {errors.passwordError && (
                    <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                      {errors.passwordError}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 border-gray-300 "
                    />
                    Remember me
                  </label>

                  <button
                    type="button"
                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Forgot password?
                  </button>
                </div>
                {errors.loginError && (
                  <p className="mt-1 text-xs font-medium text-red-600 dark:text-red-400">
                    {errors.loginError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700"
                >
                  <FaSignInAlt />
                  {isLoading ? "Signing in..." : "Sign In"}
                </button>
              </form>
            </div>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Smart Lost & Found Admin Panel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
