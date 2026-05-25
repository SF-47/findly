import {
  Clock,
  MapPin,
  PackageOpen,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import ItemCard from "../components/Items/ItemCard";
import ItemStatsCard from "../components/Items/ItemStatsCard";
import { useEffect, useState } from "react";
import LostItemsFilter from "../components/Items/LostItemsFilters";
import axiosClient from "../api/axiosClient";
import CreateLostItemModal from "../components/Items/CreateNewItem";
import toast from "react-hot-toast";

function LostItems() {
  const [lostItems, setlostItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const [studentResponse, lostItemsResponse, categoryResponse] =
          await Promise.all([
            axiosClient.get("/students"),
            axiosClient.get("/lost-items"),
            axiosClient.get("/categories"),
          ]);

        if (isMounted) {
          setStudents(studentResponse.data);
          setlostItems(lostItemsResponse.data);
          setCategories(categoryResponse.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load lost items.");
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const [showFilters, setShowFilters] = useState(false);

  const openStatusItems = lostItems.filter((item) => {
    if (item.status?.toLowerCase() !== "open") {
      return false;
    }
    return true;
  });

  async function handleCreateLostItem(requestBody) {
    try {
      setIsSubmitting(true);
      await axiosClient.post("/lost-items", requestBody);

      const response = await axiosClient.get("/lost-items");
      setlostItems(response.data);
      setShowCreateModal(false);
      toast.success("Lost item created successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create lost item.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const stats = [
    {
      title: "Total Lost Items",
      subtitle: "Reports",
      value: lostItems.length,
      icon: <PackageOpen />,
      bgColor: "bg-red-500",
    },
    {
      title: "Open Reports",
      subtitle: "Active",
      value: openStatusItems.length,
      icon: <Clock />,
      bgColor: "bg-orange-500",
    },
    {
      title: "Locations",
      subtitle: "Campus",
      value: "--",
      icon: <MapPin />,
      bgColor: "bg-red-500",
    },
    {
      title: "Possible Matches",
      subtitle: "Smart",
      value: "--",
      icon: <Search />,
      bgColor: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Lost Items
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
            Review and manage lost item reports submitted by students.
          </p>
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
            >
              <SlidersHorizontal />
              Filter
            </button>

            {showFilters && (
              <LostItemsFilter onClose={() => setShowFilters(false)} />
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 via-indigo-500 to-red-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-blue-600 hover:to-indigo-700"
          >
            <Plus />
            Add Lost Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <ItemStatsCard
            key={stat.title}
            title={stat.title}
            subtitle={stat.subtitle}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
          />
        ))}
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Lost Item Reports
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Item cards will be filled later from the backend.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search lost items..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {lostItems.map((item) => (
          <span id={item.id} key={item.id}>
            <ItemCard type="lost" item={item} students={students} />
          </span>
        ))}
      </div>

      <CreateLostItemModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateLostItem}
        students={students}
        categories={categories}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

export default LostItems;
