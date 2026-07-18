import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Calendar,
  Crown,
  LucideUniversity,
  Mail,
  Phone,
  Plus,
  ShieldUser,
  Trash2,
} from "lucide-react";
import { getAllUniversities } from "../../services/universitiesService";
import { deleteAdmin, getAllAdmins } from "../../services/adminService";
import AddAdminModal from "./AddAdminModal";
import ConfirmDialog from "../ConfirmDialog";
import toast from "react-hot-toast";
import Pagination from "../Pagination";
import { University, Admin } from "../../types";

interface AdminWithUniDetails extends Admin {
  universityShortName?: string;
  universityBranch?: string;
}

function StatSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
      <div className="h-11 w-11 rounded-xl bg-gray-300 dark:bg-zinc-700"></div>
      <div className="mt-5 h-4 w-24 rounded bg-gray-300 dark:bg-zinc-700"></div>
      <div className="mt-3 h-8 w-16 rounded bg-gray-300 dark:bg-zinc-700"></div>
    </div>
  );
}

interface AdminsManagementProps {
  onBack: () => void;
}

function AdminsManagement({ onBack }: AdminsManagementProps) {
  const [admins, setAdmins] = useState<AdminWithUniDetails[]>([]);
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 3;

  const adminLoggedInString = localStorage.getItem("admin") || sessionStorage.getItem("admin");
  const adminLoggedIn: Admin | null = adminLoggedInString ? JSON.parse(adminLoggedInString) : null;

  async function fetchUniversities() {
    try {
      const data = await getAllUniversities();
      setUniversities(data);
    } catch (error) {
      console.error("Failed to fetch universities:", error);
    }
  }

  async function fetchData() {
    if (!adminLoggedIn?.id) return;
    try {
      setIsLoading(true);
      const data = await getAllAdmins();
      setAdmins(data as AdminWithUniDetails[]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
    fetchUniversities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPage(1);
  }, [admins]);

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedAdmins = admins.slice(start, end);

  async function handleDelete(id: string) {
    try {
      await deleteAdmin(id);
      toast.success("Admin deleted successfully.");
      await fetchData();
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete admin.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-gray-300 dark:hover:bg-zinc-800"
          >
            <ArrowLeft />
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
          <Plus />
          Add Admin
        </button>
      </div>

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
              <ShieldUser />
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
              <Crown />
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
              <ShieldUser />
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

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-bold uppercase text-gray-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-gray-400">
                <th className="px-5 py-4 w-[30%]">Admin</th>
                <th className="px-5 py-4 w-[30%]">University</th>
                <th className="px-5 py-4 w-[20%]">Phone</th>
                <th className="px-5 py-4 w-[15%]">Role</th>
                <th className="px-5 py-4 w-[20%]">Created</th>
                <th className="px-5 py-4 w-[15%] text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-zinc-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-4">
                    <div className="flex justify-center">
                      <div className="animate-pulse text-gray-500">
                        Loading...
                      </div>
                    </div>
                  </td>
                </tr>
              ) : admins.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    No admins loaded yet.
                  </td>
                </tr>
              ) : (
                paginatedAdmins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="transition hover:bg-gray-50 dark:hover:bg-zinc-800"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
                          {admin.fullName?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {admin.fullName}
                          </p>
                          <div className="mt-1 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <Mail className="shrink-0" />
                            <span className="truncate">{admin.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <LucideUniversity className="shrink-0" />
                        <span>
                          {admin.universityShortName
                            ? `${admin.universityShortName}${
                                admin.universityBranch
                                  ? ` (${admin.universityBranch})`
                                  : ""
                              }`
                            : "Not assigned"}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Phone className="shrink-0" />
                        <span>{admin.phoneNumber || "Not provided"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {admin.role === "Owner" ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                          <Crown />
                          Owner
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          Admin
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        <Calendar className="shrink-0" />
                        <span>
                          {new Date(admin.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <ConfirmDialog
                          title="Delete admin?"
                          description={`Are you sure you want to delete ${admin.fullName} ? This action cannot be undone.`}
                          confirmText="Delete"
                          cancelText="Cancel"
                          onConfirm={() => handleDelete(admin.id)}
                        >
                          <button
                            type="button"
                            onClick={(e) => e.stopPropagation()}
                            className="flex cursor-pointer items-center justify-center rounded-xl border border-red-200 bg-red-50 p-3 text-red-600 transition hover:bg-red-100 dark:border-red-900/40 dark:bg-red-950/20 dark:text-red-400 dark:hover:bg-red-950/40"
                          >
                            <Trash2 />
                          </button>
                        </ConfirmDialog>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination
          page={page}
          totalItems={admins.length}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
        />
      </div>

      {showAddAdmin && (
        <AddAdminModal
          onClose={() => setShowAddAdmin(false)}
          onAdminAdded={fetchData}
          universities={universities}
          admins={admins}
        />
      )}
    </div>
  );
}

export default AdminsManagement;
