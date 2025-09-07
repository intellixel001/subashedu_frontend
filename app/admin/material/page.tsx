"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
} from "react-icons/fa";
import MaterialFormModal from "./MaterialFormModal";

const MaterialsPage = () => {
  const router = useRouter();
  const [materials, setMaterials] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    price: "",
    forCourses: "",
    accessControl: "restricted",
    pdfs: [],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courses, setCourses] = useState([]);

  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  const getToken = () => {
    if (typeof window === "undefined") return "";
    const match = document.cookie.match(/adminAccessToken=([^;]+)/);
    return match ? match[1] : "";
  };

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/admin/get-materials`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      const data = await response.json();
      setMaterials(data.data);
    } catch (err) {
      setError("Failed to fetch materials");
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/get-courses-for-materials`,
        {
          credentials: "include",
        }
      );
      const result = await response.json();
      setCourses(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        pdfs: [...prev.pdfs, file],
      }));
    }
    e.target.value = "";
  };

  const handleCourseSelect = (courseId) => {
    if (courseId === "") {
      setSelectedCourses([]);
    } else {
      setSelectedCourses((prev) =>
        prev.includes(courseId)
          ? prev.filter((id) => id !== courseId)
          : [...prev, courseId]
      );
    }
  };

  const handleRemoveCourse = (courseId) => {
    setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
  };

  const resetForm = () => {
    setFormData({
      _id: "",
      title: "",
      price: "",
      forCourses: "",
      accessControl: "restricted",
      pdfs: [],
    });
    setSelectedCourses([]);
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("forCourses", JSON.stringify(selectedCourses));
    data.append("accessControl", formData.accessControl);
    formData.pdfs.forEach((pdf) => data.append("pdfs", pdf));
    if (isEditing) data.append("_id", formData._id);

    try {
      const token = getToken();
      const response = await fetch(
        `${API_URL}/api/admin/${
          isEditing ? "update-material" : "create-material"
        }`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: data,
          credentials: "include",
        }
      );
      const resData = await response.json();
      setSuccess(resData.message);
      fetchMaterials();
      resetForm();
      setIsModalOpen(false);
    } catch (err) {
      setError("Error saving material");
    }
  };

  const handleCreate = () => {
    resetForm();
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleEdit = (material) => {
    const courseIds = material.forCourses.map((c) =>
      typeof c === "string" ? c : c._id
    );
    setFormData({
      _id: material._id,
      title: material.title,
      price: material.price,
      forCourses: JSON.stringify(courseIds),
      accessControl: material.accessControl,
      pdfs: material?.pdfs || [],
    });
    setSelectedCourses(courseIds);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = getToken();
      await fetch(`${API_URL}/api/admin/delete-material`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: id }),
        credentials: "include",
      });
      setSuccess("Material deleted successfully");
      fetchMaterials();
    } catch (err) {
      setError("Error deleting material");
    }
  };

  return (
    <div className="container mx-auto text-white px-4 py-8 font-questrial">
      {/* Toasts */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <FaCheckCircle className="text-xl" />
          <span>{success}</span>
          <button onClick={() => setSuccess("")}>
            <FaTimes />
          </button>
        </div>
      )}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
          <FaExclamationTriangle className="text-xl" />
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <FaTimes />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <FaBook className="text-[var(--myred)]" />
          Materials Management
        </h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-[var(--myred)] text-white rounded-lg"
        >
          + Create Material
        </button>
      </div>

      {/* Materials List */}
      <div className="bg-[var(--card)] p-6 rounded-xl border border-[var(--border)]">
        {materials.length === 0 ? (
          <p>No materials found.</p>
        ) : (
          <ul className="space-y-4">
            {materials.map((material) => (
              <li
                key={material._id}
                className="p-4 border rounded-lg flex justify-between"
              >
                {console.log(material)}
                <div>
                  <h3 className="font-bold">{material.title}</h3>
                  <p>Price: ৳{material.price}</p>
                  <p>Access: {material.accessControl}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(material)}
                    className="px-4 py-2 bg-[var(--myred)] text-white rounded-lg"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(material._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Modal */}
      <MaterialFormModal
        isOpen={isModalOpen}
        isEditing={isEditing}
        formData={formData}
        selectedCourses={selectedCourses}
        courses={courses}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        onChange={handleInputChange}
        onFileChange={handleFileChange}
        onCourseSelect={handleCourseSelect}
        onRemoveCourse={handleRemoveCourse}
        setFormData={setFormData}
      />
    </div>
  );
};

export default MaterialsPage;
