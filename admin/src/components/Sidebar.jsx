import {
  FaBoxOpen,
  FaClipboardCheck,
  FaHome,
  FaList,
  FaSearch,
  FaSignOutAlt,
  FaUserCircle,
  FaUsers,
} from "react-icons/fa";

import { useLocation, useNavigate } from "react-router-dom";

function SidebarButton({
  id,
  icon,
  label,
  activeButton,
  navigate,
  destination,
}) {
  return (
    <button
      onClick={() => navigate(destination)}
      className={`flex w-full items-center gap-3 rounded-lg p-3 text-start font-mono transition-colors  cursor-pointer ${
        activeButton === id
          ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
          : "text-gray-700 hover:bg-gray-200 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-zinc-700 dark:hover:text-white"
      }`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const activeButton = getActiveButton(location.pathname);

  function getActiveButton(pathname) {
    if (pathname === "/dashboard") return "dashboard";
    if (pathname === "/students") return "students";
    if (pathname === "/categories") return "categories";
    if (pathname === "/lost-items") return "lost";
    if (pathname === "/found-items") return "found";
    if (pathname === "/matches") return "matches";
    if (pathname === "/profile") return "profile";

    return "";
  }

  function handleLogout() {
    localStorage.removeItem("admin");
    sessionStorage.removeItem("admin");
    navigate("/", { replace: true });//replace: true so after logout the user cannot click browser Back and visually return to the dashboard page
  }

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-72 flex-col justify-between border-r border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div>
        <div className="flex items-center gap-4 border-b border-gray-200 px-5 py-6 dark:border-zinc-700">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40">
            <FaSearch size={32} className="text-blue-600 dark:text-blue-400" />
          </div>

          <div>
            <h1 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
              Lost & Found
            </h1>

            <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              Admin Dashboard
            </p>
          </div>
        </div>

        <nav className="px-4 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
            Main Menu
          </p>

          <div className="flex flex-col gap-2">
            <SidebarButton
              id="dashboard"
              icon={<FaHome size={20} />}
              label="Dashboard"
              activeButton={activeButton}
              navigate={navigate}
              destination="/dashboard"
            />

            <SidebarButton
              id="students"
              icon={<FaUsers size={20} />}
              label="Students"
              activeButton={activeButton}
              navigate={navigate}
              destination="/students"
            />

            <SidebarButton
              id="categories"
              icon={<FaList size={20} />}
              label="Categories"
              activeButton={activeButton}
              navigate={navigate}
              destination="/categories"
            />

            <SidebarButton
              id="lost"
              icon={<FaBoxOpen size={20} />}
              label="Lost Items"
              activeButton={activeButton}
              navigate={navigate}
              destination="/lost-items"
            />

            <SidebarButton
              id="found"
              icon={<FaClipboardCheck size={20} />}
              label="Found Items"
              activeButton={activeButton}
              navigate={navigate}
              destination="/found-items"
            />

            <SidebarButton
              id="matches"
              icon={<FaSearch size={20} />}
              label="Matches"
              activeButton={activeButton}
              navigate={navigate}
              destination="/matches"
            />
          </div>
        </nav>
      </div>

      <div className="border-t border-gray-200 px-4 py-5 dark:border-zinc-700">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          Account
        </p>

        <div className="flex flex-col gap-2">
          <SidebarButton
            id="profile"
            icon={<FaUserCircle size={20} />}
            label="Profile"
            activeButton={activeButton}
            navigate={navigate}
            destination="/profile"
          />

          <button
            className="flex w-full items-center gap-3 rounded-lg bg-red-600 p-3 text-start font-mono text-white transition-colors hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600"
            onClick={handleLogout}
          >
            <FaSignOutAlt size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
