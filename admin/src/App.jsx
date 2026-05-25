import { useEffect, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Categories from "./pages/Categories";
import LostItems from "./pages/Lost-Items";
import FoundItems from "./pages/Found-Items";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import LoginPage from "./pages/LoginPage";
import Universities from "./pages/Universities";
import Forbidden from "./pages/Forbidden";

import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import OwnerRoute from "./components/OwnerRoute";

function getCurrentTheme() {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function AdminLayout() {
  const location = useLocation();

  return (
    <ProtectedRoute>
      <div className="admin-animated-bg relative isolate min-h-screen overflow-hidden bg-gray-100 dark:bg-zinc-950">
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#2563eb",
              color: "#ffffff",
              border: "1px solid #1d4ed8",
            },
          }}
        />

        <Sidebar />

        <main
          key={location.pathname}
          className="animate-page-fade-in relative z-10 ml-72 min-h-screen p-8 text-gray-900 dark:text-white"
        >
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />

            <Route
              path="/universities"
              element={
                <OwnerRoute>
                  <Universities />
                </OwnerRoute>
              }
            />

            <Route path="/categories" element={<Categories />} />
            <Route path="/lost-items" element={<LostItems />} />
            <Route path="/found-items" element={<FoundItems />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="/404" element={<Forbidden />} />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  const [mantineTheme, setMantineTheme] = useState(getCurrentTheme());

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMantineTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setMantineTheme("light");
    }

    const observer = new MutationObserver(() => {
      const currentTheme = getCurrentTheme();
      setMantineTheme(currentTheme);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <MantineProvider forceColorScheme={mantineTheme}>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/*" element={<AdminLayout />} />
      </Routes>
    </MantineProvider>
  );
}



