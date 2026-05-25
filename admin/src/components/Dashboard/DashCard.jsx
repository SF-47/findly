function DashCard({ icon, label, value, bgColor }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
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
