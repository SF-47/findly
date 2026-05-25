import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

function ThemeButton() {
  const [dark, setDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDark(document.documentElement.classList.contains("dark"));
    setMounted(true);
  }, []);

  function toggleTheme() {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  }

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle theme"
      className={`relative h-9 w-16 rounded-full border transition-all duration-300 shadow-lg hover:scale-105 ${
        dark ? "bg-zinc-800 border-zinc-600" : "bg-gray-200 border-gray-300"
      }`}
    >
      <span
        className={`absolute top-1 flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 shadow-md ${
          dark
            ? "left-8 bg-zinc-700 text-yellow-300"
            : "left-1 bg-white text-orange-500"
        }`}
      >
        {dark ? <Moon size={12} /> : <Sun size={12} />}
      </span>
    </button>
  );
}

export default ThemeButton;





