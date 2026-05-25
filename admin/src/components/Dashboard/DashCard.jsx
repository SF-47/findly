function DashCard({ icon, label, value, bgColor }) {
  return (
    <div className="group rounded-2xl border border-white/80 bg-white/90 p-6 text-gray-900 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:bg-white/95 hover:shadow-xl dark:border-zinc-700/80 dark:bg-zinc-900/90 dark:text-white dark:hover:bg-zinc-900/95">
      <div
        className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white shadow-md ${bgColor}`}
      >
        {icon}
      </div>

      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>

      <h1 className="mt-2 text-3xl font-bold">{value}</h1>
    </div>
  );
}

export default DashCard;



