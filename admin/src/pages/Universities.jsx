import { useEffect, useState } from "react";
import { Plus, University } from "lucide-react";
import UniversityCard from "../components/Universites/UniversityCard";
import UniversityFormModal from "../components/Universites/UniversityFormModal";
import UniversitiesToolbar from "../components/Universites/UniversityToolBar";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";

function Universities() {
  const [universities, setUniversities] = useState([]);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData() {
    try {
      setIsLoading(true);

      const response = await axiosClient.get("/universities");
      setUniversities(response.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load data.");
    } finally {
      setIsLoading(false);
    }
  }

  const filteredUniversities = universities.filter((uni) => {
    if (
      search &&
      !uni.fullName?.toLowerCase().includes(search.toLowerCase()) &&
      !uni.shortName?.toLowerCase().includes(search.toLowerCase()) &&
      !uni.branch?.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [refresh]);

  function handleRefresh() {
    setRefresh((prev) => !prev);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Universities
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
            Manage universities, abbreviations, and campus branches used across
            the lost and found platform.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 to-indigo-600 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700 cursor-pointer"
          >
            <Plus />
            Add University
          </button>
        </div>
      </div>

      <UniversitiesToolbar search={search} setSearch={setSearch} />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="w-full animate-pulse rounded-3xl border border-blue-100 bg-linear-to-br from-white via-slate-50 to-blue-50 p-6 shadow-md dark:border-zinc-700 dark:bg-none dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div className="h-14 w-14 rounded-2xl bg-gray-300 dark:bg-zinc-700" />
                <div className="h-8 w-8 rounded-lg bg-gray-300 dark:bg-zinc-700" />
              </div>

              <div className="mt-7 space-y-3">
                <div className="h-4 w-3/4 rounded bg-gray-300 dark:bg-zinc-700" />
                <div className="h-4 w-1/2 rounded bg-gray-300 dark:bg-zinc-700" />
              </div>

              <div className="mt-5 h-7 w-32 rounded-full bg-gray-300 dark:bg-zinc-700" />

              <div className="mt-7 h-12 w-full rounded-2xl bg-gray-300 dark:bg-zinc-700" />
            </div>
          ))}
        </div>
      ) : filteredUniversities.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredUniversities.map((university) => (
            <UniversityCard
              key={university.id}
              university={university}
              onRefresh={handleRefresh}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
            <University size={28} />
          </div>

          <h2 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
            No universities found
          </h2>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Try changing the search keyword or add a new university.
          </p>
        </div>
      )}

      <UniversityFormModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        selectedUniversity={null}
        onSuccess={handleRefresh}
      />
    </div>
  );
}

export default Universities;




