/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaTrash,
} from "react-icons/fa";

interface Material {
  _id: string;
  title: string;
  price: string;
  forCourses: Array<string | { _id: string; title: string }>;
  accessControl: "purchased" | "free" | "restricted";
}

interface Icourse {
  title: string;
  _id: string;
  courseFor: string;
}

const MaterialsPage: React.FC = () => {
  const router = useRouter();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    price: "",
    forCourses: "",
    accessControl: "restricted" as "purchased" | "free" | "restricted",
    pdf: null as File | null,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [courses, setCourses] = useState<Icourse[]>([]);

  // Helper to get token from cookies
  const getToken = () => {
    if (typeof window === "undefined") return "";
    const match = document.cookie.match(/adminAccessToken=([^;]+)/);
    return match ? match[1] : "";
  };

  // Base API URL from environment variable
  const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:8000";

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);

  const fetchMaterials = async () => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/staff/get-materials`, {
        headers: { Authorization: `Bearer ${token}` },
        credentials: "include",
      });
      if (!response.ok) {
        const errData = await response.json();
        throw { response: { status: response.status, data: errData } };
      }
      const data = await response.json();
      setMaterials(data.data);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch materials");
      if (err.response?.status === 401) {
        document.cookie = "adminAccessToken=; Max-Age=0; path=/;";
        router.push("/admin/login");
      }
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/staff/get-courses-for-materials`,
        {
          credentials: "include",
        }
      );
      const result = await response.json();
      setCourses(result.data);
    } catch (err) {
      console.error({ err });
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, pdf: file });
  };

  const handleCourseSelect = (courseId: string) => {
    if (courseId === "") {
      setSelectedCourses([]);
    } else {
      setSelectedCourses((prev) =>
        prev.includes(courseId)
          ? prev.filter((id) => id !== courseId)
          : [...prev, courseId]
      );
    }
    setIsDropdownOpen(false);
  };

  const handleRemoveCourse = (courseId: string) => {
    setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("forCourses", JSON.stringify(selectedCourses));
    data.append("accessControl", formData.accessControl);
    if (formData.pdf) data.append("pdf", formData.pdf);
    if (isEditing) data.append("_id", formData._id);

    try {
      const token = getToken();
      const response = await fetch(
        `${API_URL}/api/staff/${
          isEditing ? "update-material" : "create-material"
        }`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: data,
          credentials: "include",
        }
      );
      if (!response.ok) {
        const errData = await response.json();
        throw { response: { status: response.status, data: errData } };
      }
      const resData = await response.json();
      setSuccess(resData.message);
      fetchMaterials();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      if (err.response?.status === 401) {
        document.cookie = "adminAccessToken=; Max-Age=0; path=/;";
        router.push("/admin/login");
      }
    }
  };

  const handleEdit = (material: Material) => {
    const courseIds = material.forCourses.map((course) =>
      typeof course === "string" ? course : course._id
    );
    setFormData({
      _id: material._id,
      title: material.title,
      price: material.price,
      forCourses: JSON.stringify(courseIds),
      accessControl: material.accessControl,
      pdf: null,
    });
    setSelectedCourses(courseIds);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const token = getToken();
      const response = await fetch(`${API_URL}/api/staff/delete-material`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ _id: id }),
        credentials: "include",
      });
      if (!response.ok) {
        const errData = await response.json();
        throw { response: { status: response.status, data: errData } };
      }
      setSuccess("Material deleted successfully");
      fetchMaterials();
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred");
      if (err.response?.status === 401) {
        document.cookie = "adminAccessToken=; Max-Age=0; path=/;";
        router.push("/admin/login");
      }
    }
  };

  const resetForm = () => {
    setFormData({
      _id: "",
      title: "",
      price: "",
      forCourses: "",
      accessControl: "restricted",
      pdf: null,
    });
    setSelectedCourses([]);
    setIsEditing(false);
    setIsDropdownOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8 font-questrial">
      {/* Success Toast */}
      {success && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50">
          <FaCheckCircle className="text-xl" />
          <span>{success}</span>
          <button
            onClick={() => setSuccess("")}
            className="ml-auto text-white hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50">
          <FaExclamationTriangle className="text-xl" />
          <span>{error}</span>
          <button
            onClick={() => setError("")}
            className="ml-auto text-white hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="bg-[var(--card)] rounded-xl shadow-md overflow-hidden mb-8 border border-[var(--border)]">
        <div className="bg-[var(--myred)] p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <FaBook className="text-3xl" />
            Material Management Portal
          </h1>
          <p className="mt-2 opacity-90">
            Create, edit, or delete educational materials for Suvash Edu
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-[var(--card)] border-t border-[var(--border)]"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-[var(--card-foreground)] mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--myred)] focus:border-[var(--myred)] transition-all bg-[var(--card)] text-[var(--card-foreground)]"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--card-foreground)] mb-2">
                Price
              </label>
              <input
                type="text"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--myred)] focus:border-[var(--myred)] transition-all bg-[var(--card)] text-[var(--card-foreground)]"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--card-foreground)] mb-2">
              Select Courses (Optional)
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 border border-[var(--border)] rounded-[var(--radius-md)] text-left bg-[var(--card)] text-[var(--card-foreground)] focus:ring-2 focus:ring-[var(--myred)] focus:border-[var(--myred)] transition-all"
              >
                {selectedCourses.length === 0
                  ? "Select courses..."
                  : selectedCourses
                      .map(
                        (id) =>
                          courses.find((course) => course._id === id)?.title ||
                          "Unknown"
                      )
                      .join(", ")}
              </button>
              {isDropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-[var(--card)] border border-[var(--border)] rounded-[var(--radius-md)] shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                  <li
                    className="px-4 py-3 hover:bg-[var(--myred-secondary)]/20 cursor-pointer text-[var(--card-foreground)]"
                    onClick={() => handleCourseSelect("")}
                  >
                    None
                  </li>
                  {courses.map((course) => (
                    <li
                      key={course._id}
                      className={`px-4 py-3 hover:bg-[var(--myred-secondary)]/20 cursor-pointer ${
                        selectedCourses.includes(course._id)
                          ? "bg-[var(--myred-secondary)]/30"
                          : ""
                      } text-[var(--card-foreground)]`}
                      onClick={() => handleCourseSelect(course._id)}
                    >
                      {course.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {selectedCourses.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {selectedCourses.map((id) => {
                  const course = courses.find((c) => c._id === id);
                  return (
                    <span
                      key={id}
                      className="inline-flex items-center px-3 py-1 bg-[var(--myred-secondary)]/20 text-[var(--myred)] text-sm font-medium rounded-full"
                    >
                      {course?.title || "Unknown"}
                      <button
                        type="button"
                        onClick={() => handleRemoveCourse(id)}
                        className="ml-2 text-[var(--myred)] hover:text-[var(--myred-dark)]"
                      >
                        ×
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
              Selected courses: {selectedCourses.length}
            </p>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--card-foreground)] mb-2">
              Access Control
            </label>
            <select
              name="accessControl"
              value={formData.accessControl}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-[var(--radius-md)] focus:ring-2 focus:ring-[var(--myred)] focus:border-[var(--myred)] transition-all bg-[var(--card)] text-[var(--card-foreground)]"
            >
              <option value="purchased">Paid</option>
              {/* <option value="free">Free</option>
              <option value="restricted">Restricted</option> */}
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--card-foreground)] mb-2">
              PDF File
            </label>
            <input
              type="file"
              name="pdf"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--card)] text-[var(--card-foreground)] file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-sm)] file:border-0 file:text-sm file:font-medium file:bg-[var(--myred)] file:text-white hover:file:bg-[var(--myred-secondary)]"
              required={!isEditing}
            />
          </div>
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="px-6 py-3 bg-[var(--myred)] text-white rounded-[var(--radius-md)] hover:bg-[var(--myred-secondary)] transition-all flex items-center justify-center gap-2 animate-fade-in"
            >
              <FaCheckCircle />
              {isEditing ? "Update Material" : "Create Material"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-[var(--muted)] text-[var(--muted-foreground)] rounded-[var(--radius-md)] hover:bg-[var(--muted)]/80 transition-all flex items-center justify-center gap-2 animate-fade-in"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Materials List */}
      <div className="bg-[var(--card)] rounded-xl shadow-md overflow-hidden border border-[var(--border)]">
        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-xl font-semibold text-[var(--card-foreground)] flex items-center gap-3">
              <FaBook className="text-[var(--myred)]" />
              Materials List
            </h2>
            <Link href="/admin/payment-verification/material-payment-requests">
              <button className="px-4 py-2 bg-[var(--myred)] text-white rounded-[var(--radius-md)] hover:bg-[var(--myred-secondary)] transition-colors">
                Material Payment Requests
              </button>
            </Link>
          </div>
          {materials.length === 0 ? (
            <div className="text-center py-12 bg-[var(--muted)] rounded-[var(--radius-md)]">
              <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
              <h3 className="text-xl font-medium text-[var(--muted-foreground)] mb-2">
                No materials found
              </h3>
              <p className="text-[var(--muted-foreground)]">
                Create a new material to get started
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {materials.map((material) => (
                <li
                  key={material._id}
                  className="p-4 border border-[var(--border)] rounded-[var(--radius-md)] bg-[var(--card)] hover:shadow-md transition-shadow text-sm animate-fade-in"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg text-[var(--card-foreground)]">
                        {material.title}
                      </h3>
                      <p className="text-[var(--muted-foreground)]">
                        Price: ৳{material.price}
                      </p>
                      <p className="text-[var(--muted-foreground)]">
                        Access: {material.accessControl}
                      </p>
                      <p className="text-[var(--muted-foreground)]">
                        Courses:{" "}
                        {material.forCourses.length > 0
                          ? material.forCourses
                              .map((course) =>
                                typeof course === "string"
                                  ? courses.find((c) => c._id === course)
                                      ?.title || course
                                  : course.title
                              )
                              .join(", ")
                          : "None"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(material)}
                        className="px-4 py-2 bg-[var(--myred)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--myred-secondary)] transition-all flex items-center gap-2"
                      >
                        <FaBook /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(material._id)}
                        className="px-4 py-2 bg-[var(--destructive)] text-white rounded-[var(--radius-sm)] hover:bg-[var(--destructive)]/90 transition-all flex items-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialsPage;
