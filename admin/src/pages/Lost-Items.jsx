import {
  Clock,
  CalendarDays,
  PackageOpen,
  Plus,
} from "lucide-react";
import ItemCard from "../components/Items/ItemCard";
import ItemStatsCard from "../components/Items/ItemStatsCard";
import { useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import CreateNewItem from "../components/Items/CreateNewItem";
import toast from "react-hot-toast";
import ItemCardSkeleton from "./../components/Items/ItemCardSkeleton.jsx";
import ItemStatsCardSkeleton from "../components/Items/ItemStatsCardSkeleton.jsx";
import AllLostItems from "../components/Items/AllLostItems.jsx";

function LostItems() {
  const [lostItems, setlostItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    date: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchData() {
    try {
      setIsLoading(true);

      const [studentResponse, lostItemsResponse, categoryResponse] =
        await Promise.all([
          axiosClient.get("/students"),
          axiosClient.get("/lost-items"),
          axiosClient.get("/categories"),
        ]);

      setStudents(studentResponse.data);
      setlostItems(lostItemsResponse.data);
      setCategories(categoryResponse.data);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load lost items.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const openStatusItems = lostItems.filter((item) => {
    if (item.status?.toLowerCase() !== "open") {
      return false;
    }

    return true;
  });

  const filteredLostItems = useMemo(() => {
    return lostItems.filter((item) => {
      const search = filters.search.trim().toLowerCase();
      const itemDate = new Date(item.lostDate);
      const now = new Date();
      const daysDiff = (now - itemDate) / (1000 * 60 * 60 * 24);

      const matchesSearch =
        !search ||
        item.itemName?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.color?.toLowerCase().includes(search) ||
        item.location?.toLowerCase().includes(search) ||
        item.categoryName?.toLowerCase().includes(search) ||
        item.studentName?.toLowerCase().includes(search);

      const matchesCategory =
        !filters.category || item.categoryId === filters.category;
      const matchesStatus =
        !filters.status || item.status?.toLowerCase() === filters.status;
      const matchesDate =
        !filters.date ||
        (filters.date === "today" &&
          itemDate.toDateString() === now.toDateString()) ||
        (filters.date === "week" && daysDiff <= 7) ||
        (filters.date === "month" && daysDiff <= 31);

      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });
  }, [filters, lostItems]);

  const previewLostItems = lostItems.slice(0, 3);
  const today = new Date().toDateString();
  const todayItems = lostItems.filter(
    (item) => new Date(item.lostDate).toDateString() === today,
  );

  function clearFilters() {
    setFilters({
      search: "",
      category: "",
      status: "",
      date: "",
    });
  }

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

  async function handleDeleteLostItem(id) {
    try {
      await axiosClient.delete(`/lost-items/${id}`);
      setlostItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Lost item deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete lost item.");
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
      title: "Today",
      subtitle: "New Reports",
      value: todayItems.length,
      icon: <CalendarDays />,
      bgColor: "bg-red-500",
    },
  ];

  if (showAll) {
    return (
      <AllLostItems
        lostItems={filteredLostItems}
        students={students}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        clearFilters={clearFilters}
        onDelete={handleDeleteLostItem}
        onBack={() => {
          setShowAll(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    );
  }

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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {isLoading
          ? Array.from({ length: 3 }).map((_, index) => (
              <ItemStatsCardSkeleton key={index} />
            ))
          : stats.map((stat) => (
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

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">
            Recent Lost Reports
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The latest lost items reported by students.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <ItemCardSkeleton key={index} />
              ))
            : previewLostItems.map((item) => (
                <ItemCard
                  key={item.id}
                  type="lost"
                  item={item}
                  students={students}
                  onDelete={handleDeleteLostItem}
                />
              ))}
        </div>

        {!isLoading && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 dark:border-zinc-700 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Showing {previewLostItems.length} of {lostItems.length}{" "}
              lost items
            </p>

            <button
              type="button"
              onClick={() => {
                setShowAll(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex w-fit items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              View All Lost Items
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        )}
      </section>

      <CreateNewItem
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateLostItem}
        students={students}
        categories={categories}
        isSubmitting={isSubmitting}
        type="lost"
      />
    </div>
  );
}

export default LostItems;
