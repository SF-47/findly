import { useState } from "react";
import Appearance from "../components/Profile/Appearance";
import ProfileInfoCard from "../components/Profile/ProfileInfoCard";
import ProfileSecurityCard from "../components/Profile/ProfileSecurityCard";
import AdminsManagement from "../components/Profile/AdminsManagement";

function Profile() {
  const [activeView, setActiveView] = useState("profile");

  if (activeView === "admins") {
    return <AdminsManagement onBack={() => setActiveView("profile")} />;
  }

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
