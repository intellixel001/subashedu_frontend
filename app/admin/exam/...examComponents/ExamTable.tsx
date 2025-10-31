"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaEye, FaPlus, FaTrash } from "react-icons/fa";

export default function ExamTable({ onCreate, onEdit, onDelete }) {
  const [exams, setExams] = useState([]);
  const [options, setOptions] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterClass, setFilterClass] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [filterPosition, setFilterPosition] = useState("all");

  const positionOptions = ["Academic", "Admission", "Job"];

  // Fetch exams
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/get`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch exams");
        const data = await res.json();
        setExams(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchExams();
  }, []);

  // Fetch classes and subjects
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/option/get`,
          { method: "GET", credentials: "include" }
        );
        if (!res.ok) throw new Error("Failed to fetch options");
        const data = await res.json();
        setOptions(data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  // Unique classes based on selected position
  const classesData = useMemo(() => {
    return options
      .filter(
        (o) =>
          o.type === "class" &&
          (filterPosition === "all" || o.position === filterPosition)
      )
      .map((o) => ({ id: o.id, name: o.name }));
  }, [options, filterPosition]);

  // Subjects for selected class
  const subjectsData = useMemo(() => {
    if (filterClass === "all") return [];
    return options
      .filter((o) => o.type === "subject" && o.className === filterClass)
      .map((o) => ({ id: o.id, name: o.name }));
  }, [options, filterClass]);

  // Filtered exams
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
      const matchPosition =
        filterPosition === "all" ? true : exam.position === filterPosition;
      return (
        matchSearch &&
        matchStatus &&
        matchClass &&
        matchSubject &&
        matchPosition
      );
    });
  }, [exams, search, filterStatus, filterClass, filterSubject, filterPosition]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Exam List</h2>
        <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:items-center">
          <input
            type="text"
            placeholder="Search exam..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 w-full sm:w-48 focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <select
            value={filterPosition}
            onChange={(e) => setFilterPosition(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Positions</option>
            {positionOptions.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>

          <select
            value={filterClass}
            onChange={(e) => {
              setFilterClass(e.target.value);
              setFilterSubject("all");
            }}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All Classes</option>
            {classesData.map((cls) => (
              <option key={cls.id} value={cls.name}>
                {cls.name}
              </option>
            ))}
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            disabled={filterClass === "all"}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
          >
            <option value="all">All Subjects</option>
            {subjectsData.map((sub) => (
              <option key={sub.id} value={sub.name}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="finished">Finished</option>
          </select>

          <button
            onClick={onCreate}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaPlus size={14} /> Add Exam
          </button>

          <Link href="/admin/exam/classandsubject">
            <button className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              <FaPlus size={14} /> Class & Subject
            </button>
          </Link>
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
              <th className="text-left px-4 py-2">Position</th>
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
                  <td className="px-4 py-2">{exam.class}</td>
                  <td className="px-4 py-2">{exam.subject}</td>
                  <td className="px-4 py-2">{exam.duration} min</td>
                  <td className="px-4 py-2">{exam.position}</td>
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
                        href={`/admin/exam/${exam._id}`}
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
                        onClick={() => onDelete(exam._id)}
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
                  colSpan={8}
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
