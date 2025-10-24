"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";
import { examSections } from "../examDb/examSubject";

export default function ExamTable({ onCreate, onEdit, onDelete }) {
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "active" | "finished"
  >("all");
  const [filterClass, setFilterClass] = useState<string | number>("all");
  const [filterSubject, setFilterSubject] = useState<string | number>("all");

  // ✅ Fetch exams from API on mount
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/get`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );

        if (!res.ok) throw new Error("Failed to fetch exams");

        const finalData = await res.json();
        const data = finalData?.data;

        console.log(data);
        setExams(data);
      } catch (error) {
        console.error("❌ Failed to fetch exams:", error);
      }
    };

    fetchExams();
  }, []);

  // ✅ Get subjects for selected class
  const classSubjects = useMemo(() => {
    if (filterClass === "all") return [];
    return examSections.find((cls) => +cls.id === +filterClass)?.items || [];
  }, [filterClass]);

  // ✅ Filtered + searched exams
  const filteredExams = useMemo(() => {
    return exams.filter((exam) => {
      const matchSearch = exam.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "active"
          ? exam.isLive
          : !exam.isLive;

      const matchClass =
        filterClass === "all" ? true : +exam.class === +filterClass;

      const matchSubject =
        filterSubject === "all" ? true : +exam.subject === +filterSubject;

      return matchSearch && matchStatus && matchClass && matchSubject;
    });
  }, [exams, search, filterStatus, filterClass, filterSubject]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      {/* Header / Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Exam List</h2>

        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:items-center">
          {/* Search */}
          <input
            type="text"
            placeholder="Search exam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          {/* Class Filter */}
          <select
            value={filterClass}
            onChange={(e) => {
              setFilterClass(e.target.value);
              setFilterSubject("all"); // reset subject when class changes
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Classes</option>
            {examSections.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          {/* Subject Filter */}
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
            disabled={filterClass === "all"}
          >
            <option value="all">All Subjects</option>
            {classSubjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.title}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) =>
              setFilterStatus(e.target.value as "all" | "active" | "finished")
            }
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="finished">Finished</option>
          </select>

          {/* Add new exam */}
          <button
            onClick={onCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaPlus size={14} />
            Add Exam
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-sm">
              <th className="text-left px-4 py-2">Name</th>
              <th className="text-left px-4 py-2">Billing</th>
              <th className="text-left px-4 py-2">Class</th>
              <th className="text-left px-4 py-2">Subject</th>
              <th className="text-left px-4 py-2">Duration</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-right px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredExams.length > 0 ? (
              filteredExams.map((exam) => (
                <tr
                  key={exam._id}
                  className="border-t hover:bg-gray-50 text-sm text-gray-800"
                >
                  <td className="px-4 py-2">{exam.name}</td>
                  <td className="px-4 py-2 capitalize">{exam.billingType}</td>
                  <td className="px-4 py-2">
                    {examSections.find((c) => +c.id === +exam.class)?.name ||
                      exam.class}
                  </td>
                  <td className="px-4 py-2">
                    {examSections
                      .find((c) => +c.id === +exam.class)
                      ?.items?.find((s) => +s.id === +exam.subject)?.title ||
                      exam.subject}
                  </td>
                  <td className="px-4 py-2">{exam.duration} min</td>
                  <td className="px-4 py-2">
                    {exam.isLive ? (
                      <span className="text-green-600 font-medium">Active</span>
                    ) : (
                      <span className="text-gray-500 font-medium">
                        Finished
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={"/admin/exam/" + exam._id}
                        className="p-2 text-black hover:text-blue-800"
                      >
                        <FaEye size={14} />
                      </Link>
                      <button
                        onClick={() => onEdit(exam)}
                        className="p-2 text-blue-600 hover:text-blue-800"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => exam._id && onDelete(exam._id)}
                        className="p-2 text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No exams found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
