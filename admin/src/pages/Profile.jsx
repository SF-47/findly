import Appearance from "../components/Profile/Appearance";
import ProfileInfoCard from "../components/Profile/ProfileInfoCard";
import ProfileSecurityCard from "../components/Profile/ProfileSecurityCard";
import {
  FaClipboardCheck,
  FaSearch,
  FaTags,
  FaUsers,
  FaPlus,
} from "react-icons/fa";

function ProfileStat({ icon, label, value, bgColor }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${bgColor}`}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        {value}
      </h3>

      <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
    </div>
  );
}

function Profile() {
  const stats = [
    {
      label: "Managed Students",
      value: "--",
      icon: <FaUsers />,
      bgColor: "bg-blue-600",
    },
    {
      label: "Categories",
      value: "--",
      icon: <FaTags />,
      bgColor: "bg-indigo-600",
    },
    {
      label: "Reports",
      value: "--",
      icon: <FaClipboardCheck />,
      bgColor: "bg-emerald-600",
    },
    {
      label: "Matches",
      value: "--",
      icon: <FaSearch />,
      bgColor: "bg-purple-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
            Manage your admin profile, security settings, and system access.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700  cursor-pointer">
            <FaPlus />
            Add Admin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <ProfileStat
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <ProfileInfoCard />
        </div>

        <div className="flex h-full flex-col gap-6 xl:col-span-2">
          <ProfileSecurityCard />
          <Appearance />
        </div>
      </div>
    </div>
  );
}

export default Profile;
