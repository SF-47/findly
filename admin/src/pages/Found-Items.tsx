import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ClipboardCheck, Clock, Plus } from "lucide-react";
import ItemStatsCard from "../components/Items/ItemStatsCard";
import { getAllStudents } from "../services/studentService";
import { getFoundItems, createFoundItem, deleteFoundItem } from "../services/itemService";
import { getCategories } from "../services/categoryService";
import toast from "react-hot-toast";
import ItemCard from "../components/Items/ItemCard";
import ItemCardSkeleton from "../components/Items/ItemCardSkeleton";
import ItemStatsCardSkeleton from "../components/Items/ItemStatsCardSkeleton";
import AllFoundItems from "../components/Items/AllFoundItems";
import CreateNewItem from "../components/Items/CreateNewItem";
//! TS CHANGE : Imported basic entity types
import { FoundItem, Student, Category } from "../types";

//! TS CHANGE : Used Interface Inheritance ('extends') to attach flattened, display-only fields to the basic FoundItem structure
interface ExtendedFoundItem extends FoundItem {
  categoryName?: string;
  studentName?: string;
}

function FoundItems() {
  //! TS CHANGE : Constrained state arrays using Generics to guarantee safety during iteration
  const [foundItems, setFoundItems] = useState<ExtendedFoundItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    search: "",
    category: "" as string | number, //! TS CHANGE : Cast value as string or number using "as" operator
    status: "",
    date: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        setIsLoading(true);

        //! TS CHANGE : Cast getFoundItems response as Promise<ExtendedFoundItem[]> to safely accept display properties (categoryName, etc.)
        const [studentData, foundItemsData, categoryData] =
          await Promise.all([
            getAllStudents(),
            getFoundItems() as Promise<ExtendedFoundItem[]>,
            getCategories(),
          ]);

        if (isMounted) {
          setStudents(studentData);
          setFoundItems(foundItemsData);
          setCategories(categoryData);
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
      const daysDiff = (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24);

      const matchesSearch =
        !search ||
        item.itemName?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search) ||
        item.color?.toLowerCase().includes(search) ||
        item.location?.toLowerCase().includes(search) ||
        item.categoryName?.toLowerCase().includes(search) ||
        item.studentName?.toLowerCase().includes(search);

      const matchesCategory = !filters.category || item.categoryId === Number(filters.category);
      const matchesStatus =
        !filters.status || item.status?.toLowerCase() === filters.status;
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);

      const matchesDate =
        !filters.date ||
        (filters.date === "today" && itemDate.toDateString() === now.toDateString()) ||
        (filters.date === "yesterday" && itemDate.toDateString() === yesterday.toDateString()) ||
        (filters.date === "week" && daysDiff <= 7) ||
        (filters.date === "month" && daysDiff <= 31);

      return matchesSearch && matchesCategory && matchesStatus && matchesDate;
    });
  }, [filters, foundItems]);

  const previewFoundItems = [...foundItems]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  const today = new Date().toDateString();
  const todayItems = foundItems.filter(
    (item) => new Date(item.createdAt).toDateString() === today,
  );

  function clearFilters() {
    setFilters({
      search: "",
      category: "",
      status: "",
      date: "",
    });
  }

  async function handleCreateFoundItem(requestBody: any) {
    try {
      setIsSubmitting(true);

      await createFoundItem(requestBody);

      const data = await getFoundItems();

      setFoundItems(data);
      setShowCreateModal(false);
      toast.success("Found item created successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to create found item.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteFoundItem(id: string) {
    try {
      await deleteFoundItem(id);
      setFoundItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Found item deleted successfully.");
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete found item.");
    }
  }

  const stats = [
    {
      title: "Total Found Items",
      subtitle: "Reports",
      value: foundItems.length,
      icon: <ClipboardCheck />,
      bgColor: "bg-blue-600",
    },
    {
      title: "Open Reports",
      subtitle: "Active",
      value: openStatusItems.length,
      icon: <Clock />,
      bgColor: "bg-blue-600",
    },
    {
      title: "Today",
      subtitle: "New Reports",
      value: todayItems.length,
      icon: <CalendarDays />,
      bgColor: "bg-blue-600",
    },
  ];

  if (showAll) {
    return (
      <AllFoundItems
        foundItems={filteredFoundItems}
        students={students}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filters={filters}
        setFilters={setFilters as any}
        categories={categories}
        clearFilters={clearFilters}
        onDelete={handleDeleteFoundItem}
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
            Recent Found Reports
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            The latest found items reported by students.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2 xl:grid-cols-3">
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
                  onDelete={handleDeleteFoundItem}
                />
              ))}
        </div>

        {!isLoading && (
          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 dark:border-zinc-700 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              Showing {previewFoundItems.length} of {foundItems.length} found items
            </p>

            <button
              type="button"
              onClick={() => {
                setShowAll(true);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="group flex w-fit items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-500 hover:bg-blue-600 hover:text-white dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300 dark:hover:border-blue-500 dark:hover:bg-blue-600 dark:hover:text-white"
            >
              View All Found Items
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
