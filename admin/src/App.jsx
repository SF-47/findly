import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Categories from "./pages/Categories";
import LostItems from "./pages/Lost-Items";
import FoundItems from "./pages/Found-Items";
import Matches from "./pages/Matches";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-zinc-950">
      <Sidebar />

      <main className="ml-72 p-8 text-gray-900 dark:text-white">
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/students" element={<Students />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/lost-items" element={<LostItems />} />
          <Route path="/found-items" element={<FoundItems />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}
