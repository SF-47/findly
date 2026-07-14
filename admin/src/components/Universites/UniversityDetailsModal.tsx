import React, { useEffect, useState } from "react";
import {
  CircleCheck,
  Clock3,
  Mail,
  MapPin,
  Users,
  X,
  Building2,
} from "lucide-react";
import { getAllStudents } from "../../services/studentService";
import { getAllAdmins } from "../../services/adminService";
import { University, Student, Admin } from "../../types";

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  iconClass: string;
}

function StatPill({ icon, label, value, iconClass }: StatPillProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40">
      <div className={`mb-2 flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
        {icon}
      </div>
      <p className="text-xl font-bold text-gray-900 dark:text-zinc-100">{value}</p>
      <p className="mt-1 text-sm font-semibold text-gray-500 dark:text-zinc-400">{label}</p>
    </div>
  );
}

interface UniversityDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  university: University | null;
}

function UniversityDetailsModal({ isOpen, onClose, university }: UniversityDetailsModalProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);
        const [studentData, adminData] = await Promise.all([
          getAllStudents(),
          getAllAdmins(),
        ]);
        if (isMounted) {
          setStudents(studentData);
          setAdmins(adminData);
        }
      } catch (error) {
        console.log(error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  if (!isOpen || !university) return null;

  const filteredStudents = students.filter((s) => s.universityId === university.id);
  const verifiedStudents = filteredStudents.filter((s) => s.isVerified);
  const pendingStudents = filteredStudents.filter((s) => !s.isVerified);

  const filteredAdmin = admins.find((a) => a.universityId === university.id);
  const adminFullName = filteredAdmin?.fullName;
  const adminEmail = filteredAdmin?.email;
  const adminRole = filteredAdmin?.role;

  return (
    <div className="admin-modal-overlay fixed inset-y-0 right-0 z-50 flex items-center justify-center bg-black/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-900">
        {/* Header */}
        <div className="flex items-center justify-between bg-linear-to-br from-blue-600 to-violet-600 px-5 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
              <Building2 size={18} className="text-white" />
            </div>
            <div>
              <p className="text-base font-semibold">University Details</p>
              <p className="text-xs text-white/70">Summary, admin, and student status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/15 text-white transition hover:bg-white/25"
          >
            <X size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3.5 p-5">
          {/* University card */}
          <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-gray-50 p-3.5 dark:border-zinc-800 dark:bg-zinc-800/40">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-violet-600 text-xs font-bold tracking-wide text-white">
              {university.shortName}
            </div>
            <div className="min-w-0">
              <p className="truncate text-base font-bold text-gray-900 dark:text-zinc-100">
                {university.shortName}
              </p>
              <p className="mt-0.5 truncate text-sm text-gray-500 dark:text-zinc-400">
                {university.fullName}
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                <MapPin size={10} />
                {university.branch} Branch
              </span>
            </div>
          </div>

          {isLoading ? (
            <>
              {/* Stats Skeleton */}
              <div className="grid grid-cols-3 gap-3 animate-pulse">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div
                    key={index}
                    className="rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-zinc-800 dark:bg-zinc-800/40 h-24"
                  >
                    <div className="mb-2 h-6 w-6 rounded bg-gray-200 dark:bg-zinc-700" />
                    <div className="h-5 w-10 rounded bg-gray-200 dark:bg-zinc-700" />
                    <div className="mt-2 h-3.5 w-14 rounded bg-gray-200 dark:bg-zinc-700" />
                  </div>
                ))}
              </div>

              {/* Admin Skeleton */}
              <div className="flex animate-pulse items-center gap-3.5 rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="h-9 w-9 shrink-0 rounded-xl bg-gray-200 dark:bg-zinc-700" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-gray-200 dark:bg-zinc-700" />
                  <div className="h-3 w-1/2 rounded bg-gray-200 dark:bg-zinc-700" />
                </div>
                <div className="h-5 w-12 rounded-full bg-gray-200 dark:bg-zinc-700 shrink-0" />
              </div>
            </>
          ) : (
            <>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <StatPill
                  icon={<Users size={16} />}
                  label="Students"
                  value={filteredStudents.length}
                  iconClass="bg-indigo-500/10 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400"
                />
                <StatPill
                  icon={<CircleCheck size={16} />}
                  label="Verified"
                  value={verifiedStudents.length}
                  iconClass="bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400"
                />
                <StatPill
                  icon={<Clock3 size={16} />}
                  label="Pending"
                  value={pendingStudents.length}
                  iconClass="bg-yellow-500/10 text-yellow-600 dark:bg-yellow-500/20 dark:text-yellow-400"
                />
              </div>

              {/* Admin row */}
              <div className="flex items-center gap-3.5 rounded-2xl border border-gray-200 bg-gray-50 px-3.5 py-3 dark:border-zinc-800 dark:bg-zinc-800/40">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  {adminFullName?.charAt(0)?.toUpperCase() || "A"}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-gray-900 dark:text-zinc-100">
                    {adminFullName || "No assigned admin"}
                  </p>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-gray-500 dark:text-zinc-400">
                    <Mail size={12} />
                    {adminEmail || "No email available"}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
                  {adminRole || "Admin"}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-gray-200 px-5 py-3.5 dark:border-zinc-800">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UniversityDetailsModal;
