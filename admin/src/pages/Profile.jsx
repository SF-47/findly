import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Appearance from "../components/Profile/Appearance";
import ProfileInfoCard from "../components/Profile/ProfileInfoCard";
import ProfileSecurityCard from "../components/Profile/ProfileSecurityCard";
import AdminsManagement from "../components/Profile/AdminsManagement";

import {
  FaClipboardCheck,
  FaTags,
  FaUser,
  FaUsers,
} from "react-icons/fa";

function ProfileStat({ icon, label, value, bgColor, isLoading }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
      <div
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-white ${bgColor}`}
      >
        {icon}
      </div>

      <h3 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
        {isLoading ? (
          <div className="h-8 w-15 rounded bg-gray-300 dark:bg-zinc-700"></div>
        ) : (
          <div className="text-4xl font-bold tracking-tight">{value}</div>
        )}
      </h3>

      <p className="mt-1 text-sm font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
    </div>
  );
}

function Profile() {
  const [statsValues, setStatsValues] = useState({
    allStudents: [],
    allCategories: [],
    reports: [],
    allAdmins: [],
  });
  const [isLoading, setIsLoading] = useState(false);

  const [activeView, setActiveView] = useState("profile");

  async function fetchData() {
    try {
      setIsLoading(true);

      const studentsResponse = await axiosClient.get("/students");
      const categoriesResponse = await axiosClient.get("/categories");
      const adminsResponse = await axiosClient.get("/admins");

      setStatsValues({
        allStudents: studentsResponse.data,
        allCategories: categoriesResponse.data,
        reports: [],
        allAdmins: adminsResponse.data,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  if (activeView === "admins") {
    return <AdminsManagement onBack={() => setActiveView("profile")} />;
  }

  const stats = [
    {
      label: "Managed Students",
      value: statsValues.allStudents.length,
      icon: <FaUsers />,
      bgColor: "bg-blue-600",
    },
    {
      label: "Categories",
      value: statsValues.allCategories.length,
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
      label: "Admins",
      value: statsValues.allAdmins.length,
      icon: <FaUser />,
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
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <ProfileStat
            key={stat.label}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
            bgColor={stat.bgColor}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        <div className="xl:col-span-1">
          <ProfileInfoCard />
        </div>

        <div className="flex h-full flex-col gap-6 xl:col-span-2">
          <ProfileSecurityCard onManageAdmins={() => setActiveView("admins")} />
          <Appearance />
        </div>
      </div>
    </div>
  );
}

export default Profile;
