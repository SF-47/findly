import ThemeButton from "../ThemeButton";

function Appearance() {
  return (
    <div className="flex-1 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="border-b border-gray-200 pb-4 dark:border-zinc-700">
        <h1 className="font-semibold text-gray-900 dark:text-white">
          Appearance
        </h1>
      </div>

      <div className="flex flex-col gap-4 pt-4">
        <p className="text-gray-500 dark:text-gray-400">
          Customize your theme preferences.
        </p>

        <ThemeButton />
      </div>
    </div>
  );
}

export default Appearance;


