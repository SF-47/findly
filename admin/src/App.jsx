import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Categories from "./pages/Categories";
import LostItems from "./pages/Lost-Items";
import FoundItems from "./pages/Found-Items";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";
import LoginPage from "./pages/LoginPage";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";
import Universities from "./pages/Universities";
import OwnerRoute from "./components/OwnerRoute";
import Forbidden from "./pages/Forbidden";

function AdminLayout() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100 dark:bg-zinc-950">
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

        <main className="ml-72 p-8 text-gray-900 dark:text-white">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/students" element={<Students />} />
            <Route
              path="universities"
              element={
                <ProtectedRoute>
                  <OwnerRoute>
                    <Universities />
                  </OwnerRoute>
                </ProtectedRoute>
              }
            />
            <Route path="/categories" element={<Categories />} />
            <Route path="/lost-items" element={<LostItems />} />
            <Route path="/found-items" element={<FoundItems />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/profile" element={<Profile />} />
            <Route
              path="/404"
              element={
                <ProtectedRoute>
                  <Forbidden />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/*" element={<AdminLayout />} />
    </Routes>
  );
}
