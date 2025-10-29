"use client";

import { useState } from "react";

export default function ManageNotice({ examObj }) {
  const [notices, setNotices] = useState(examObj?.notice || []); // Array of notice objects
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  // 🟢 Notice form data
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    status: "active",
    body: "",
  });

  // 🟡 Open modal for Add or Edit
  const openModal = (notice = null, index = null) => {
    if (notice) {
      setFormData(notice);
      setEditIndex(index);
    } else {
      setFormData({
        date: new Date().toISOString().slice(0, 10),
        status: "active",
        body: "",
      });
      setEditIndex(null);
    }
    setShowModal(true);
  };

  // 🟢 Save or Update notice
  const handleSave = async () => {
    if (!formData.body.trim()) return alert("Please enter notice content");
    setLoading(true);
    try {
      let updatedNotices = [...notices];

      if (editIndex !== null) {
        updatedNotices[editIndex] = formData; // update
      } else {
        updatedNotices.unshift(formData); // add new on top
      }

      const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/update/notice/${examObj._id}`;
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notice: updatedNotices }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save notice");

      setNotices(data.data.notice);
      setShowModal(false);
      alert("✅ Notice saved successfully!");
    } catch (error) {
      console.error("❌ notice save error:", error);
      alert("Failed to save notice");
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete a notice
  const handleDelete = async (index: number) => {
    if (!confirm("Are you sure you want to delete this notice?")) return;
    const updated = notices.filter((_, i) => i !== index);

    try {
      const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/update/notice/${examObj._id}`;
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notice: updated }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to delete");

      setNotices(data.data.notice);
      alert("🗑️ Notice deleted");
    } catch (err) {
      console.error("❌ delete error:", err);
      alert("Failed to delete notice");
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Exam Notices</h2>
        <button
          onClick={() => openModal()}
          className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
        >
          Add Notice
        </button>
      </div>

      {/* Notice List */}
      {notices.length > 0 ? (
        <div className="space-y-3">
          {notices.map((n, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg p-4 bg-gray-50"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <p className="text-sm text-gray-500">
                    📅 {n.date} —{" "}
                    <span
                      className={`font-medium ${
                        n.status === "active"
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    >
                      {n.status}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(n, i)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(i)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-line text-gray-700">{n.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No notices added yet.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full h-auto max-w-lg rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">
              {editIndex !== null ? "Edit Notice" : "Add New Notice"}
            </h3>

            <div className="space-y-3">
              <input
                type="date"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />

              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <textarea
                rows={6}
                value={formData.body}
                onChange={(e) =>
                  setFormData({ ...formData, body: e.target.value })
                }
                placeholder="Write notice details here..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={loading}
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
