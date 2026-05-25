import { useState } from "react";
import { MapPin, MoreVertical, Pencil, Trash2, University } from "lucide-react";
import axiosClient from "../../api/axiosClient";
import toast from "react-hot-toast";
import UniversityFormModal from "./UniversityFormModal";
import UniversityDetailsModal from "./UniversityDetailsModal";
import ConfirmDialog from "../ConfirmDialog";

function UniversityCard({ university, onRefresh }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  const createdDate = university.createdAt
    ? new Date(university.createdAt).toLocaleDateString()
    : "N/A";

  function handleEdit() {
    setShowMenu(false);
    setShowEditModal(true);
  }

  async function handleDelete() {
    setShowMenu(false);

    try {
      await axiosClient.delete(`/universities/${university.id}`);

      toast.success("University deleted successfully.");

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete university.");
    }
  }

  return (
    <>
      <div className="group w-full rounded-3xl border border-blue-100 bg-linear-to-br from-white via-slate-50 to-blue-50 p-6 shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-2xl dark:border-zinc-700 dark:bg-none dark:bg-zinc-900 dark:hover:border-blue-300">
        <div className="relative flex items-start justify-between">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 via-indigo-500 to-purple-600 text-xl font-bold text-white shadow-lg ring-2 ring-white/20">
            {university.shortName}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu((prev) => !prev);
            }}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-zinc-800 dark:hover:text-white cursor-pointer"
          >
            <MoreVertical size={14} />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-10 z-50 w-32 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-zinc-700 cursor-pointer"
              >
                <Pencil size={12} />
                Edit
              </button>

              <ConfirmDialog
                title="Delete university?"
                description={`Are you sure you want to delete ${university.shortName} - ${university.branch}? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                onConfirm={handleDelete}
                onCancel={() => setShowMenu(false)}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </ConfirmDialog>
            </div>
          )}
        </div>

        <div className="mt-7 space-y-3 text-sm text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-3">
            <University className="text-blue-500" />
            <span className="line-clamp-1">{university.fullName}</span>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="text-blue-500" />
            <span>{university.branch} Branch</span>
          </div>
        </div>

        <span className="mt-5 inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:border-transparent dark:bg-blue-900/40 dark:text-blue-300">
          Created {createdDate}
        </span>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowDetailsModal(true);
          }}
          className="mt-7 flex w-full items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-4 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-linear-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-800 dark:text-blue-300 dark:hover:border-transparent dark:hover:text-white cursor-pointer"
        >
          <span>View University</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>
      </div>

      <UniversityFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        selectedUniversity={university}
        onSuccess={onRefresh}
      />

      <UniversityDetailsModal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        university={university}
      />
    </>
  );
}

export default UniversityCard;





