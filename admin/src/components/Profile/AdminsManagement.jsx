import { useState, useEffect } from "react";
import {
  FaEnvelope,
  FaUserShield,
  FaCalendarAlt,
  FaTrash,
  FaCrown,
  FaArrowLeft,
  FaPlus,
} from "react-icons/fa";
import axiosClient from "../../api/axiosClient";
import AddAdminModal from "./AddAdminModal";

function StatSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="h-11 w-11 rounded-xl bg-gray-300 dark:bg-zinc-700"></div>

      <div className="mt-5 h-4 w-24 rounded bg-gray-300 dark:bg-zinc-700"></div>

      <div className="mt-3 h-8 w-16 rounded bg-gray-300 dark:bg-zinc-700"></div>
    </div>
  );
}

function TableRowSkeleton() {
  return (
    <div className="grid animate-pulse grid-cols-12 items-center px-5 py-4">
      <div className="col-span-5 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gray-300 dark:bg-zinc-700"></div>

        <div className="min-w-0">
          <div className="h-4 w-32 rounded bg-gray-300 dark:bg-zinc-700"></div>
          <div className="mt-2 h-3 w-44 rounded bg-gray-300 dark:bg-zinc-700"></div>
        </div>
      </div>

      <div className="col-span-3">
        <div className="h-6 w-20 rounded-full bg-gray-300 dark:bg-zinc-700"></div>
      </div>

      <div className="col-span-3">
        <div className="h-4 w-24 rounded bg-gray-300 dark:bg-zinc-700"></div>
      </div>

      <div className="col-span-1 flex justify-end">
        <div className="h-8 w-8 rounded-lg bg-gray-300 dark:bg-zinc-700"></div>
      </div>
    </div>
  );
}

function AdminsManagement({ onBack }) {
  const [admins, setAdmins] = useState([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData() {
    try {
      setIsLoading(true);

      const response = await axiosClient.get("/admins");

      setAdmins(response.data);
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
  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Manage Admins
            </h1>

            <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
              View administrator accounts, access levels, and account creation
              dates.
            </p>
          </div>
        </div>

        <button
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={() => setShowAddAdmin(true)}
        >
          <FaPlus />
          Add Admin
        </button>
      </div>

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <StatSkeleton />
          <StatSkeleton />
          <StatSkeleton />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
              <FaUserShield />
            </div>

            <p className="mt-5 text-sm font-semibold text-gray-500 dark:text-gray-400">
              Total Admins
            </p>

            <h2 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              {admins.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-500 text-white">
              <FaCrown />
            </div>

            <p className="mt-5 text-sm font-semibold text-gray-500 dark:text-gray-400">
              Owner
            </p>

            <h2 className="mt-1 text-3xl font-bold text-gray-900 dark:text-white">
              1
            </h2>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600 text-white">
              <FaUserShield />
            </div>

            <p className="mt-5 text-sm font-semibold text-gray-500 dark:text-gray-400">
              Access Status
            </p>

            <h2 className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
              Active
            </h2>
          </div>
        </div>
      )}

      {/* Admins Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Admin Accounts
            </h2>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Administrator records will appear here.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-12 border-b border-gray-200 bg-gray-50 px-5 py-4 text-xs font-bold uppercase text-gray-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-400">
          <div className="col-span-5">Admin</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-3">Created</div>
          <div className="col-span-1 text-right">Action</div>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-zinc-700">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRowSkeleton key={index} />
            ))
          ) : admins.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400">
              No admins loaded yet.
            </div>
          ) : (
            admins.map((admin) => (
              <div
                key={admin.id}
                className="grid grid-cols-12 items-center px-5 py-4 transition hover:bg-gray-50 dark:hover:bg-zinc-800"
              >
                <div className="col-span-5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                    {admin.fullName?.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-gray-900 dark:text-white">
                      {admin.fullName}
                    </p>

                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <FaEnvelope />
                      <span className="truncate">{admin.email}</span>
                    </div>
                  </div>
                </div>

                <div className="col-span-3">
                  {admin.role === "Owner" ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                      <FaCrown />
                      Owner
                    </span>
                  ) : (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                      Admin
                    </span>
                  )}
                </div>

                <div className="col-span-3 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <FaCalendarAlt />
                  {new Date(admin.createdAt).toLocaleDateString()}
                </div>

                <div className="col-span-1 flex justify-end">
                  <button
                    type="button"
                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50 hover:text-red-700 dark:hover:bg-red-950/30"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Note */}
      {isLoading ? (
        <div className="animate-pulse rounded-2xl border border-gray-200 bg-white px-5 py-4 dark:border-zinc-700 dark:bg-zinc-900">
          <div className="h-4 w-36 rounded bg-gray-300 dark:bg-zinc-700"></div>
          <div className="mt-3 h-4 w-3/4 rounded bg-gray-300 dark:bg-zinc-700"></div>
        </div>
      ) : (
        <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 dark:border-blue-900/40 dark:bg-blue-950/20">
          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">
            Owner-only feature
          </p>

          <p className="mt-1 text-sm text-blue-600/80 dark:text-blue-300/80">
            Later, only the Owner role should be able to view, add, or remove
            admin accounts.
          </p>
        </div>
      )}

      {showAddAdmin && (
  <AddAdminModal
    onClose={() => setShowAddAdmin(false)}
    onAdminAdded={fetchData}
  />
)}
    </div>
  );
}

export default AdminsManagement;
