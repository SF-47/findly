import {
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaCalendarDay,
  FaFilter,
  FaPlus,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import AddStudentModal from "../components/Students/AddStudentModal";
import StudentFilter from "../components/Students/StudentFilters";
import toast from "react-hot-toast";
import StudentDetailsModal from "../components/Students/StudentDetailModal";
import Pagination from "../components/Pagination";

function StatsCard({ title, subtitle, value, icon, bgColor, isLoading }) {
  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 text-gray-900 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-zinc-700 dark:bg-zinc-900 dark:text-white">
      <div className="flex items-center justify-between">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-xl text-xl text-white shadow-md ${bgColor}`}
        >
          {icon}
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-500 dark:bg-zinc-800 dark:text-gray-400">
          {subtitle}
        </span>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <div className="h-8 w-15 rounded bg-gray-300 dark:bg-zinc-700"></div>
        ) : (
          <div className="text-4xl font-bold tracking-tight">{value}</div>
        )}

        <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
          {title}
        </p>
      </div>
    </div>
  );
}

function Students() {
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [page, setPage] = useState(1);
  const rowsPerPage = 7;

  async function fetchStudents() {
    try {
      setIsLoading(true);
      setErrors("");

      const response = await axiosClient.get("/students");
      console.log(response.data);
      setStudents(response.data);
    } catch (error) {
      console.log(error);
      setErrors("Failed to load students.");
      toast.error(errors);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPage(1);
  }, [students]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedStudents = students.slice(start, end);

  const verifiedStudents = students.filter((s) => {
    if (!s.isVerified) {
      return false;
    }
    return true;
  });

  const unVerifiedStudents = students.filter((s) => {
    if (s.isVerified) {
      return false;
    }
    return true;
  });

  const todayStudents = students.filter((s) => {
    const today = new Date().toDateString();
    const studentCreatedDate = new Date(s.createdAt).toDateString();

    return studentCreatedDate === today;
  });
  const stats = [
    {
      title: "Total Students",
      subtitle: "Registered",
      value: students.length,
      icon: <FaUsers />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Verified Students",
      subtitle: "Approved",
      value: verifiedStudents.length,
      icon: <FaUserCheck />,
      bgColor: "bg-green-500",
    },
    {
      title: "Pending",
      subtitle: "Review",
      value: unVerifiedStudents.length,
      icon: <FaUserClock />,
      bgColor: "bg-yellow-500",
    },
    {
      title: "New Today",
      subtitle: "Today",
      value: todayStudents.length,
      icon: <FaCalendarDay />,
      bgColor: "bg-purple-500",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Students
          </h1>

          <p className="mt-2 max-w-2xl text-gray-500 dark:text-gray-400">
            Manage registered students, review verification status, and monitor
            new student accounts.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700  cursor-pointer"
            onClick={() => setShowAddStudent(true)}
          >
            <FaPlus />
            Add Student
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            subtitle={stat.subtitle}
            value={stat.value}
            icon={stat.icon}
            bgColor={stat.bgColor}
            isLoading={isLoading}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-zinc-700">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Students List
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Student records will appear here.
            </p>
          </div>
          <div>
            <button
              className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm transition hover:bg-gray-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
              onClick={() => setShowFilters((prev) => !prev)}
            >
              <FaFilter />
              Filter
            </button>
          </div>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-zinc-700 dark:text-gray-400">
              <th className="px-5 py-4">Student</th>
              <th className="px-5 py-4">University</th>
              <th className="px-5 py-4">University ID</th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Registered Date</th>
              <th className="px-5 py-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              Array.from({ length: 7 }).map((_, index) => (
                <tr
                  key={index}
                  className="animate-pulse border-b border-gray-200 dark:border-zinc-700"
                >
                  <td className="px-5 py-4">
                    <div className="h-4 w-28 rounded bg-gray-300 dark:bg-zinc-700"></div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-4 w-24 rounded bg-gray-300 dark:bg-zinc-700"></div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-4 w-24 rounded bg-gray-300 dark:bg-zinc-700"></div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-6 w-20 rounded-full bg-gray-300 dark:bg-zinc-700"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-28 rounded bg-gray-300 dark:bg-zinc-700"></div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="h-4 w-28 rounded bg-gray-300 dark:bg-zinc-700"></div>
                  </td>

                  <td className="px-5 py-4">
                    <div className="h-8 w-16 rounded-lg bg-gray-300 dark:bg-zinc-700"></div>
                  </td>
                </tr>
              ))
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan="6"
                  className="px-5 py-12 text-center text-sm text-gray-500 dark:text-gray-400"
                >
                  No student data loaded yet.
                </td>
              </tr>
            ) : (
              paginatedStudents.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-gray-200 text-gray-900 transition hover:bg-gray-50 dark:border-zinc-700 dark:text-white dark:hover:bg-zinc-800 cursor-pointer"
                  onClick={(e) => {
                    setSelectedStudent(s);
                    e.stopPropagation();
                  }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-r from-blue-500 to-indigo-600 font-bold text-white">
                        {s.fullName?.charAt(0).toUpperCase()}
                      </div>

                      <div>
                        <p className="font-semibold">{s.fullName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {s.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {s.universityName}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {s.universityId}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {s.phoneNumber}
                  </td>

                  <td className="px-5 py-4">
                    {s.isVerified ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-900/40 dark:text-green-300">
                        Verified
                      </span>
                    ) : (
                      <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-5 py-4">
                    <button
                      className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"
                      onClick={(e) => {
                        setSelectedStudent(s);
                        e.stopPropagation();
                      }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalItems={students.length}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
        />
      </div>
      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onStudentAdded={fetchStudents}
        />
      )}
      {showFilters && (
        <StudentFilter onClose={() => setShowFilters((prev) => !prev)} />
      )}

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
          onStudentChanged={fetchStudents}
        />
      )}
    </div>
  );
}

export default Students;
