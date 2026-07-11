import React, { useState, useEffect } from "react";
import { CalendarDays, Plus, UserCheck, Clock3, Users } from "lucide-react";
import { getAllStudents } from "../services/studentService";
import { getAllUniversities } from "../services/universitiesService";
import AddStudentModal from "../components/Students/AddStudentModal";
import toast from "react-hot-toast";
import StudentDetailsModal from "../components/Students/StudentDetailModal";
import Pagination from "../components/Pagination";
import { getStoredAdmin, isOwner } from "../../utils/auth";
import StudentsStatCardSkeleton from "../components/Students/StudentsStatCardSkeleton";
import PrimeDropdown from "../components/PrimeDropdown";
//! TS CHANGE : Imported the Student and University structures
import { Student, University } from "../types";

//! TS CHANGE : Extended Student with display attributes to represent university details in tabular reports
interface ExtendedStudent extends Student {
  universityShortName?: string;
  universityBranch?: string;
}

//! TS CHANGE : Typed interface for presentation stat cards
interface StatsCardProps {
  title: string;
  subtitle: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  isLoading: boolean;
}

function StatsCard({ title, subtitle, value, icon, bgColor, isLoading }: StatsCardProps) {
  return (
    <>
      {isLoading ? (
        <StudentsStatCardSkeleton />
      ) : (
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
              <StudentsStatCardSkeleton />
            ) : (
              <div className="text-4xl font-bold tracking-tight">{value}</div>
            )}

            <p className="mt-2 text-sm font-semibold text-gray-500 dark:text-gray-400">
              {title}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

interface StoredAdmin {
  id: string;
  fullName: string;
  email: string;
  role: string;
  token: string;
  universityId?: string | null;
  universityShortName?: string;
  universityBranch?: string;
}

function Students() {
  const [showAddStudent, setShowAddStudent] = useState<boolean>(false);
  const [universities, setUniversities] = useState<University[]>([]);
  const [students, setStudents] = useState<ExtendedStudent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState({
    search: "",
    uniId: "",
    verificationStatus: "",
    registeredDate: "",
  });

  const [selectedStudent, setSelectedStudent] = useState<ExtendedStudent | null>(null);
  const [page, setPage] = useState<number>(1);
  const rowsPerPage = 7;

  const owner = isOwner();
  const admin = getStoredAdmin() as StoredAdmin | null;

  async function fetchStudents() {
    try {
      setIsLoading(true);

      const responseData = await getAllStudents() as ExtendedStudent[];
      setStudents(responseData);
      if (owner) {
        const responseUniData = await getAllUniversities();
        setUniversities(responseUniData);
      } else {
        setUniversities([]);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load students.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setPage(1);
  }, [students, filters]);

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter((s) => {
    if (
      filters.search &&
      !s.fullName?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !s.email?.toLowerCase().includes(filters.search.toLowerCase()) &&
      !s.universityStudentId
        ?.toLowerCase()
        .includes(filters.search.toLowerCase())
    ) {
      return false;
    }

    if (filters.verificationStatus === "verified" && !s.isVerified) {
      return false;
    }
    if (filters.verificationStatus === "pending" && s.isVerified) {
      return false;
    }
    if (filters.uniId && filters.uniId !== s.universityId) {
      return false;
    }
    if (filters.registeredDate) {
      const today = new Date();
      const studentDate = new Date(s.createdAt);

      if (filters.registeredDate === "today") {
        if (studentDate.toDateString() !== today.toDateString()) {
          return false;
        }
      }

      if (filters.registeredDate === "yesterday") {
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        if (studentDate.toDateString() !== yesterday.toDateString()) {
          return false;
        }
      }

      if (filters.registeredDate === "7days") {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(today.getDate() - 7);

        if (studentDate < sevenDaysAgo) {
          return false;
        }
      }

      if (filters.registeredDate === "30days") {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(today.getDate() - 30);

        if (studentDate < thirtyDaysAgo) {
          return false;
        }
      }
    }

    return true;
  });

  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedStudents = filteredStudents.slice(start, end);

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
    const todayStr = new Date().toDateString();
    const studentCreatedDate = new Date(s.createdAt).toDateString();

    return studentCreatedDate === todayStr;
  });

  const stats = [
    {
      title: "Total Students",
      subtitle: "Registered",
      value: students.length,
      icon: <Users />,
      bgColor: "bg-blue-500",
    },
    {
      title: "Verified Students",
      subtitle: "Approved",
      value: verifiedStudents.length,
      icon: <UserCheck />,
      bgColor: "bg-green-500",
    },
    {
      title: "Pending",
      subtitle: "Review",
      value: unVerifiedStudents.length,
      icon: <Clock3 />,
      bgColor: "bg-yellow-500",
    },
    {
      title: "New Today",
      subtitle: "Today",
      value: todayStudents.length,
      icon: <CalendarDays />,
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
            <Plus />
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
        </div>
        <div className="grid grid-cols-1 gap-4 border-b border-gray-200 px-5 py-4 dark:border-zinc-700 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Search Student
            </label>

            <input
              type="text"
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
              placeholder="Name, email, or university ID..."
              className="w-full rounded-xl border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>
          {owner && (
            <div>
              <label className="mb-1 block text-sm text-start font-medium text-gray-600 dark:text-gray-300">
                University Name
              </label>

              <PrimeDropdown
                value={filters.uniId}
                onChange={(value) =>
                  setFilters((prev) => ({
                    ...prev,
                    uniId: value,
                  }))
                }
                placeholder="All"
                options={universities.map((u) => ({
                  value: u.id,
                  label: `${u.shortName} - ${u.branch}`,
                }))}
              />
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Verification Status
            </label>

            <PrimeDropdown
              value={filters.verificationStatus}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  verificationStatus: value,
                }))
              }
              placeholder="All Students"
              options={[
                { value: "verified", label: "Verified" },
                { value: "pending", label: "Pending" },
              ]}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Registered Date
            </label>

            <PrimeDropdown
              value={filters.registeredDate}
              onChange={(value) =>
                setFilters((prev) => ({
                  ...prev,
                  registeredDate: value,
                }))
              }
              placeholder="All Dates"
              options={[
                { value: "today", label: "Today" },
                { value: "yesterday", label: "Yesterday" },
                { value: "7days", label: "Last 7 Days" },
                { value: "30days", label: "Last 30 Days" },
              ]}
            />
          </div>
        </div>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200 text-left text-xs uppercase text-gray-500 dark:border-zinc-700 dark:text-gray-400">
              <th className="px-5 py-4">Student</th>
              <th className="px-5 py-4">University</th>
              <th className="px-5 py-4">Student university ID</th>
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
            ) : filteredStudents.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
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
                    {s.universityShortName} - {s.universityBranch}
                  </td>

                  <td className="px-5 py-4 text-gray-600 dark:text-gray-300">
                    {s.universityStudentId}
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
          totalItems={filteredStudents.length}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
        />
      </div>
      {showAddStudent && (
        <AddStudentModal
          onClose={() => setShowAddStudent(false)}
          onStudentAdded={fetchStudents}
          owner={owner}
          admin={admin as any}
          universities={universities}
        />
      )}

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          universities={universities}
          onClose={() => setSelectedStudent(null)}
          onStudentChanged={fetchStudents}
          owner={owner}
          admin={admin as any}
          setFilters={() =>
            setFilters({
              search: "",
              uniId: "",
              verificationStatus: "",
              registeredDate: "",
            })
          }
        />
      )}
    </div>
  );
}

export default Students;
