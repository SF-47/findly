import { ClipboardCheck, Clock, MapPin, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ItemStatsCard from "../components/Items/ItemStatsCard";
import FoundItemsFilter from "../components/Items/FoundItemsFilters";
import axiosClient from "../api/axiosClient";
import toast from "react-hot-toast";
import ItemCard from "../components/Items/ItemCard";
import ItemCardSkeleton from "../components/Items/ItemCardSkeleton";
import ItemStatsCardSkeleton from "../components/Items/ItemStatsCardSkeleton";
import AllFoundItems from "../components/Items/AllFoundItems";
import CreateFoundItemModal from "../components/Items/CreateNewItem";

function FoundItems() {
  const [foundItems, setFoundItems] = useState([]);
  const [students, setStudents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    status: "",
    date: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);

        const [studentResponse, foundItemsResponse, categoryResponse] =
          await Promise.all([
            axiosClient.get("/students"),
            axiosClient.get("/found-items"),
            axiosClient.get("/categories"),
          ]);

        if (isMounted) {
          setStudents(studentResponse.data);
          setFoundItems(foundItemsResponse.data);
          setCategories(categoryResponse.data);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to load found items.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const openStatusItems = foundItems.filter((item) => {
    if (item.status?.toLowerCase() !== "open") {
      return false;
    }

    return true;
  });

  const filteredFoundItems = useMemo(() => {
    return foundItems.filter((item) => {
      const search = filters.search.trim().toLowerCase();
      const itemDate = new Date(item.foundDate);
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

      const matchesCategory = !filters.category || item.categoryId === filters.category;
      const matchesStatus =
        !filters.status || item.status?.toLowerCase() === filters.status;
      const matchesDate =
        !filters.date ||
        (filters.date === "today" && itemDate.toDateString() === now.toDateString()) ||
        (filters.date === "week" && daysDiff <= 7) ||
        (filters.date === "month" && daysDiff <= 31);

      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });
  }, [filters, foundItems]);

  const previewFoundItems = filteredFoundItems.slice(0, 3);

  function clearFilters() {
    setFilters({
      search: "",
      category: "",
      status: "",
      date: "",
    });
  }

  async function handleCreateFoundItem(requestBody) {
    try {
      setIsSubmitting(true);

      await axiosClient.post("/found-items", requestBody);

      const response = await axiosClient.get("/found-items");

      setFoundItems(response.data);
      setShowCreateModal(false);
      toast.success("Found item created successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create found item.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const stats = [
    {
      title: "Total Found Items",
      subtitle: "Reports",
      value: foundItems.length,
      icon: <ClipboardCheck />,
      bgColor: "bg-teal-500",
    },
    {
      title: "Open Reports",
      subtitle: "Active",
      value: openStatusItems.length,
      icon: <Clock />,
      bgColor: "bg-emerald-500",
    },
    {
      title: "Locations",
      subtitle: "Campus",
      value: "--",
      icon: <MapPin />,
      bgColor: "bg-teal-500",
    },
    {
      title: "Possible Matches",
      subtitle: "Smart",
      value: "--",
      icon: <Search />,
      bgColor: "bg-emerald-500",
    },
  ];

  if (showAll) {
    return (
      <AllFoundItems
        foundItems={filteredFoundItems}
        students={students}
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
            Found Items
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
            Review and manage found item reports submitted by students.
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
              <FoundItemsFilter
                filters={filters}
                categories={categories}
                onChange={setFilters}
                onClear={clearFilters}
                onClose={() => setShowFilters(false)}
              />
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r from-blue-500 via-indigo-500 to-emerald-500 px-4 py-3 font-semibold text-white shadow-lg transition hover:from-emerald-500 hover:to-blue-500"
          >
            <Plus />
            Add Found Item
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
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

      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Found Item Reports
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Review the latest found item reports submitted by students.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              placeholder="Search found items..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-blue-400 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-white dark:focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <ItemCardSkeleton key={index} />
              ))
            : previewFoundItems.map((item) => (
                <ItemCard
                  key={item.id}
                  type="found"
                  item={item}
                  students={students}
                />
              ))}
        </div>

        {!isLoading && (
          <div className="flex flex-col items-center justify-center gap-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Showing {previewFoundItems.length} of {filteredFoundItems.length} found items
            </p>

            <button
              type="button"
              onClick={() => {
                setShowAll(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex items-center justify-center gap-2 rounded-2xl border border-blue-200 bg-white px-6 py-3 text-sm font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-500 hover:bg-linear-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white hover:shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-blue-300 dark:hover:border-transparent dark:hover:text-white"
            >
              View All Found Items
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        )}
      </div>

      <CreateFoundItemModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateFoundItem}
        students={students}
        categories={categories}
        isSubmitting={isSubmitting}
        type="found"
      />
    </div>
  );
}

export default FoundItems;





