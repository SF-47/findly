import {
  Calendar,
  ClipboardCheck,
  LucideUniversity,
  MapPin,
  PackageOpen,
  Palette,
  Tag,
  User,
  X,
} from "lucide-react";

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-blue-500">{icon}</span>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          {label}
        </p>
        <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
          {value || "N/A"}
        </p>
      </div>
    </div>
  );
}

function getUniversityLabel(item, useFullName = false) {
  const name = useFullName
    ? item.universityFullName || item.universityShortName
    : item.universityShortName || item.universityFullName;

  return [name, item.universityBranch].filter(Boolean).join(" - ") || "N/A";
}

function ItemDetails({ item, type }) {
  const isLost = type === "lost";
  const styles = isLost
    ? {
        border: "border-red-100 dark:border-red-900/40",
        background: "bg-red-50 dark:bg-red-950/20",
        icon: <PackageOpen />,
        iconClass: "bg-red-500",
        title: "Lost Item",
      }
    : {
        border: "border-emerald-100 dark:border-emerald-900/40",
        background: "bg-emerald-50 dark:bg-emerald-950/20",
        icon: <ClipboardCheck />,
        iconClass: "bg-emerald-500",
        title: "Found Item",
      };

  return (
    <section
      className={`rounded-2xl border p-5 ${styles.border} ${styles.background}`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${styles.iconClass}`}
        >
          {styles.icon}
        </div>
        <div>
          <p className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
            {styles.title}
          </p>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            {item.itemName}
          </h3>
        </div>
      </div>

      {item.imageUrl && (
        <a href={item.imageUrl} target="_blank" rel="noreferrer">
          <img
            src={item.imageUrl}
            alt={item.itemName}
            className="mt-5 h-48 w-full rounded-xl object-cover"
          />
        </a>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <DetailRow icon={<User size={18} />} label="Student" value={item.studentName} />
        <DetailRow
          icon={<LucideUniversity size={18} />}
          label="University"
          value={getUniversityLabel(item, true)}
        />
        <DetailRow icon={<Tag size={18} />} label="Category" value={item.categoryName} />
        <DetailRow icon={<Palette size={18} />} label="Color" value={item.color} />
        <DetailRow icon={<MapPin size={18} />} label="Location" value={item.location} />
        <DetailRow
          icon={<Calendar size={18} />}
          label={isLost ? "Lost Date" : "Found Date"}
          value={item.date ? new Date(item.date).toLocaleDateString() : "N/A"}
        />
      </div>

      <div className="mt-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">
          Description
        </p>
        <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-gray-200">
          {item.description || "No description available."}
        </p>
      </div>
    </section>
  );
}

function MatchDetailsModal({ match, onClose }) {
  if (!match) {
    return null;
  }

  return (
    <div className="admin-modal-overlay fixed inset-y-0 right-0 z-70 flex items-start justify-center overflow-y-auto bg-black/45 px-4 py-6 backdrop-blur-sm md:items-center">
      <div className="max-h-[calc(100vh-3rem)] w-full max-w-5xl overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Match Details
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Compare the complete lost and found item reports.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-zinc-800 dark:hover:text-white"
          >
            <X />
          </button>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-2">
          <ItemDetails item={match.lostItem} type="lost" />
          <ItemDetails item={match.foundItem} type="found" />
        </div>
      </div>
    </div>
  );
}

export default MatchDetailsModal;
