import { useNavigate } from "react-router-dom";
import { Ban, House } from "lucide-react";

function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] items-center justify-center">
      <div className="w-full max-w-xl rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-md dark:border-zinc-700 dark:bg-zinc-900">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-400">
          <Ban size={28} />
        </div>

        <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white">
          403
        </h1>

        <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
          Forbidden
        </h2>

        <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
          You do not have permission to access this page.
        </p>

        <button
          onClick={() => navigate("/dashboard", { replace: true })}
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-5 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700"
        >
          <House />
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default Forbidden;
