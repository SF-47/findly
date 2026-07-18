import { Search, X } from "lucide-react";
import PrimeDropdown from "../PrimeDropdown";
import { Category, ExtendedStudent } from "../../types";

interface LostItemsFilterProps {
  filters: {
    search: string;
    category: string | number | null | undefined;
    status: string | null | undefined;
    date: string | null | undefined;
    universityId: string | null | undefined;
  };
  categories: Category[];
  students: ExtendedStudent[];
  onChange: (filters: LostItemsFilterProps["filters"]) => void;
  onClose: () => void;
}

function LostItemsFilter({
  filters,
  categories,
  students,
  onChange,
  onClose,
}: LostItemsFilterProps) {
  const categoryOptions = categories.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const universityOptions = Array.from(
    new Map(
      students
        .filter((student) => student.universityId)
        .map((student) => {
          const shortName =
            student.universityShortName || student.university?.shortName || "University";
          const branch = student.universityBranch || student.university?.branch;

          return [
            student.universityId,
            {
              value: student.universityId,
              label: [shortName, branch].filter(Boolean).join(" - "),
            },
          ];
        }),
    ).values(),
  );

  return (
    <div className="absolute right-0 top-14 z-50 w-96 rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          Filter Lost Items
        </h2>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
        >
          <X />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Search Item
          </label>

          <div className="flex items-center rounded-xl border border-gray-300 bg-gray-50 px-3 dark:border-zinc-700 dark:bg-zinc-800">
            <Search className="mr-2 text-gray-400" />

            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              placeholder="Name, description, color, location..."
              className="w-full bg-transparent py-3 text-sm text-gray-900 outline-none dark:text-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Category
          </label>

          <PrimeDropdown
            value={filters.category}
            onChange={(value) => onChange({ ...filters, category: value })}
            placeholder="All Categories"
            options={categoryOptions}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            University
          </label>

          <PrimeDropdown
            value={filters.universityId}
            onChange={(value) => onChange({ ...filters, universityId: value })}
            placeholder="All Universities"
            options={universityOptions}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Status
          </label>

          <PrimeDropdown
            value={filters.status}
            onChange={(value) => onChange({ ...filters, status: value })}
            placeholder="All Status"
            options={[
              { value: "open", label: "Open" },
              { value: "matched", label: "Matched" },
              { value: "closed", label: "Closed" },
            ]}
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Lost Date
          </label>

          <PrimeDropdown
            value={filters.date}
            onChange={(value) => onChange({ ...filters, date: value })}
            placeholder="All Dates"
            options={[
              { value: "today", label: "Today" },
              { value: "yesterday", label: "Yesterday" },
              { value: "week", label: "Last 7 Days" },
              { value: "month", label: "Last 30 Days" },
            ]}
          />
        </div>
      </div>

    </div>
  );
}

export default LostItemsFilter;
