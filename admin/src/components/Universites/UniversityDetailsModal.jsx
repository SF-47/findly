import {
  CircleCheck,
  Clock3,
  Mail,
  MapPin,
  Users,
  X,
  Building2,
} from "lucide-react";
import axiosClient from "../../api/axiosClient";
import { useEffect, useState } from "react";

function StatPill({ icon, label, value, iconClass }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-zinc-800 p-4">
      <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold leading-none text-zinc-100">{value}</p>
      <p className="mt-1.5 text-xs font-medium text-zinc-500">{label}</p>
    </div>
  );
}

function UniversityDetailsModal({ isOpen, onClose, university }) {
  const [students, setStudents] = useState([]);
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    async function fetchData() {
      try {
        const [studentResponse, adminResponse] = await Promise.all([
          axiosClient.get("/students"),
          axiosClient.get("/admins"),
        ]);
        if (isMounted) {
          setStudents(studentResponse.data);
          setAdmins(adminResponse.data);
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();
    return () => { isMounted = false; };
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
      <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/[0.07] bg-zinc-900 shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between bg-linear-to-br from-blue-600 to-violet-600 px-6 py-5">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
              <Building2 size={22} className="text-white" />
            </div>
            <div>
              <p className="text-lg font-semibold text-white">University Details</p>
              <p className="text-xs text-white/60">Summary, admin, and student status</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 text-white transition hover:bg-white/25"
          >
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-5">

          {/* University card */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-zinc-800 p-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-sm font-bold tracking-wide text-white">
              {university.shortName}
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-bold text-zinc-100">{university.shortName}</p>
              <p className="mt-0.5 truncate text-sm text-zinc-400">{university.fullName}</p>
              <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/25 bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-400">
                <MapPin size={11} />
                {university.branch} Branch
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <StatPill
              icon={<Users size={18} />}
              label="Students"
              value={filteredStudents.length}
              iconClass="bg-indigo-500/20 text-indigo-400"
            />
            <StatPill
              icon={<CircleCheck size={18} />}
              label="Verified"
              value={verifiedStudents.length}
              iconClass="bg-green-500/20 text-green-400"
            />
            <StatPill
              icon={<Clock3 size={18} />}
              label="Pending"
              value={pendingStudents.length}
              iconClass="bg-yellow-500/20 text-yellow-400"
            />
          </div>

          {/* Admin row */}
          <div className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-zinc-800 px-4 py-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white">
              {adminFullName?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-zinc-100">
                {adminFullName || "No assigned admin"}
              </p>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-zinc-500">
                <Mail size={12} />
                {adminEmail || "No email available"}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-indigo-500/20 bg-indigo-500/15 px-3 py-1 text-xs font-medium text-indigo-400">
              {adminRole || "Admin"}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/6 px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 bg-zinc-800 px-5 py-2 text-sm font-medium text-zinc-300 transition hover:bg-zinc-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UniversityDetailsModal;
