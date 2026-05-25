import {
  CircleUserRound,
  ClipboardCheck,
  House,
  List,
  LogOut,
  PackageOpen,
  RefreshCw,
  Search,
  University,
  Users,
} from "lucide-react";

import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { isOwner } from "../../utils/auth";

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
      className={`relative flex w-full items-center gap-3 overflow-hidden rounded-lg p-3 text-start transition-colors cursor-pointer ${
        activeButton === id
          ? "bg-blue-600 text-white dark:bg-blue-500 dark:text-white"
          : "text-gray-700 hover:bg-gray-200 hover:text-blue-600 dark:text-gray-300 dark:hover:bg-zinc-700 dark:hover:text-white"
      }`}
    >
      {activeButton === id && (
        <span className="absolute left-0 top-1/2 h-7 w-1 -translate-y-1/2 rounded-r-full bg-white/80 dark:bg-white" />
      )}
      {icon}
      <span>{label}</span>
    </button>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const owner = isOwner();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const activeButton = getActiveButton(location.pathname);

  function getActiveButton(pathname) {
    if (pathname === "/dashboard") return "dashboard";
    if (pathname === "/students") return "students";
    if (pathname === "/categories") return "categories";
    if (pathname === "/universities") return "universities";
    if (pathname === "/lost-items") return "lost";
    if (pathname === "/found-items") return "found";
    if (pathname === "/matches") return "matches";
    if (pathname === "/profile") return "profile";

    return "";
  }

  function handleLogout() {
    setIsLoggingOut(true);
    localStorage.removeItem("admin");
    sessionStorage.removeItem("admin");

    setTimeout(() => {
      navigate("/", { replace: true });
    }, 250);
  }

  return (
    <aside className="admin-animated-bg fixed left-0 top-0 z-40 isolate flex h-screen w-72 flex-col justify-between overflow-hidden border-r border-blue-100/80 shadow-sm dark:border-zinc-700">
      <div className="absolute inset-0 z-0 bg-white/70 backdrop-blur-[1px] dark:bg-zinc-950/70" />

      <div className="relative z-10">
        <div className="flex items-center gap-4 border-b border-blue-100/80 px-5 py-6 dark:border-zinc-700">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/40">
            <Search size={32} className="text-blue-600 dark:text-blue-400" />
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

          <div className="flex flex-col gap-1">
            <SidebarButton
              id="dashboard"
              icon={<House size={20} />}
              label="Dashboard"
              activeButton={activeButton}
              navigate={navigate}
              destination="/dashboard"
            />

            <SidebarButton
              id="students"
              icon={<Users size={20} />}
              label="Students"
              activeButton={activeButton}
              navigate={navigate}
              destination="/students"
            />
            {owner && (
              <SidebarButton
                id="universities"
                icon={<University size={20} />}
                label="Universities"
                activeButton={activeButton}
                navigate={navigate}
                destination="/universities"
              />
            )}

            <SidebarButton
              id="categories"
              icon={<List size={20} />}
              label="Categories"
              activeButton={activeButton}
              navigate={navigate}
              destination="/categories"
            />

            <SidebarButton
              id="lost"
              icon={<PackageOpen size={20} />}
              label="Lost Items"
              activeButton={activeButton}
              navigate={navigate}
              destination="/lost-items"
            />

            <SidebarButton
              id="found"
              icon={<ClipboardCheck size={20} />}
              label="Found Items"
              activeButton={activeButton}
              navigate={navigate}
              destination="/found-items"
            />

            <SidebarButton
              id="matches"
              icon={<Search size={20} />}
              label="Matches"
              activeButton={activeButton}
              navigate={navigate}
              destination="/matches"
            />
          </div>
        </nav>
      </div>

      <div className="relative z-10 border-t border-blue-100/80 px-4 py-4 dark:border-zinc-700">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-zinc-500">
          Account
        </p>

        <div className="flex flex-col gap-2">
          <SidebarButton
            id="profile"
            icon={<CircleUserRound size={20} />}
            label="Profile"
            activeButton={activeButton}
            navigate={navigate}
            destination="/profile"
          />

          <button
            className="flex w-full items-center gap-3 rounded-lg bg-red-600 p-3 text-start text-white transition-colors hover:bg-red-700 disabled:opacity-70 dark:bg-red-700 dark:hover:bg-red-600"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <RefreshCw size={20} className="animate-spin" />
            ) : (
              <LogOut size={20} />
            )}
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}





