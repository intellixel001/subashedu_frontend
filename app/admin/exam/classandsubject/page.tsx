"use client";

import { useEffect, useMemo, useState } from "react";
import OptionCreateUpdateModal from "./OptionCreateUpdateModal";

export default function Page() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    className: "",
    subject: "",
    status: true,
  });

  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterPosition, setFilterPosition] = useState("");
  const [mode, setMode] = useState("class");
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 Fetch data from backend
  const fetchOptions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterClass) params.append("className", filterClass);
      if (filterSubject) params.append("subject", filterSubject);
      if (filterPosition) params.append("position", filterPosition);

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/admin/exam/option/get?${params.toString()}`,
        {
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Failed to fetch options");

      const result = await res.json();
      setData(result.data || []);
    } catch (err) {
      console.error("❌ fetchOptions error:", err);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Fetch on mount or filter change
  useEffect(() => {
    fetchOptions();
  }, [filterClass, filterSubject, filterPosition]);

  // 🔹 Unique values for filter dropdowns
  const uniqueClasses = Array.from(
    new Set(data.map((t) => t.className))
  ).filter(Boolean);
  const uniqueSubjects = Array.from(new Set(data.map((t) => t.subject))).filter(
    Boolean
  );
  const uniquePositions = Array.from(
    new Set(data.map((t) => t.position))
  ).filter(Boolean);

  // 🔹 Filtered & searched data
  const filteredData = useMemo(() => {
    return data.filter((t) => {
      const matchesSearch = t.name.toLowerCase().includes(search.toLowerCase());
      const matchesClass = filterClass ? t.className === filterClass : true;
      const matchesSubject = filterSubject ? t.subject === filterSubject : true;
      const matchesPosition = filterPosition
        ? t.position === filterPosition
        : true;
      return matchesSearch && matchesClass && matchesSubject && matchesPosition;
    });
  }, [data, search, filterClass, filterSubject, filterPosition]);

  // 🔹 Modal handlers
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        position: item.position,
        className: item.className,
        subject: item.subject,
        status: item.status,
      });
      setMode(item.className ? "subject" : "class");
    } else {
      setEditingItem(null);
      setFormData({
        name: "",
        position: "",
        className: "",
        subject: "",
        status: true,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // 🔹 Submit handler (create/update)
  const handleSubmit = async () => {
    try {
      setErrorMsg("");
      const payload = { ...formData, type: mode };
      const endpoint = editingItem
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/option/update/${editingItem._id}`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/option/create`;

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const message =
          errorData?.message ||
          `Failed to ${editingItem ? "update" : "create"} option`;
        setErrorMsg(message);
        throw new Error(message);
      }

      await res.json();
      await fetchOptions(); // 🔹 Refresh data from server
      closeModal();
    } catch (err) {
      console.error("❌ handleSubmit error:", err);
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">Options List</h1>
        <button
          onClick={() => openModal()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          + Add Options
        </button>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4 flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 flex-1"
        />

        <select
          value={filterPosition}
          onChange={(e) => setFilterPosition(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Positions</option>
          {uniquePositions.map((pos) => (
            <option key={pos} value={pos}>
              {pos}
            </option>
          ))}
        </select>
        <select
          value={filterClass}
          onChange={(e) => setFilterClass(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Classes</option>
          {uniqueClasses.map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <select
          value={filterSubject}
          onChange={(e) => setFilterSubject(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2"
        >
          <option value="">All Subjects</option>
          {uniqueSubjects.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Position</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Class</th>
              <th className="px-4 py-2">Subject</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((options) => (
                <tr key={options.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{options.id}</td>
                  <td className="px-4 py-2">{options.type}</td>
                  <td className="px-4 py-2">{options.position}</td>
                  <td className="px-4 py-2">{options.name}</td>
                  <td className="px-4 py-2">{options.className || "-"}</td>
                  <td className="px-4 py-2">{options.subject || "-"}</td>
                  <td className="px-4 py-2">
                    {options.status ? "Active" : "Inactive"}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => {
                        openModal(options);
                        setMode(options?.type);
                      }}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-4 text-gray-500">
                  No matching records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <OptionCreateUpdateModal
          closeModal={closeModal}
          setFormData={setFormData}
          formData={formData}
          handleSubmit={handleSubmit}
          editingItem={editingItem}
          errorMsg={errorMsg}
          mode={mode}
          setMode={setMode}
          classOptionsAll={data?.filter((s_s) => s_s?.type === "class") || []}
        />
      )}
    </div>
  );
}
