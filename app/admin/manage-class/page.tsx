/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CourseType } from "@/_types/course";
import { ClassModal } from "@/app/components/ClassModal";
import { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import ClassManagementPage from "./ClassManagementPage";

export interface Class {
  _id: string;
  title: string;
  subject?: string;
  instructorId?: string;
  billingType?: "free" | "paid";
  courseType?: string;
  type?: "live" | "recorded";
  courseId?: string;
  course?: { _id: string; title: string; courseFor: string };
  videoLink: string;
  image: string;
  startTime?: string | null;
  isActiveLive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassFormData {
  title: string;
  subject: string;
  instructorId: string;
  instructor?: string;
  courseId: string;
  image: string;
  courseType: string;
  billingType: "free" | "paid";
  type: "recorded" | "live";
  videoLink?: string;
  startTime?: string;
}

export default function Page() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState<ClassFormData>({
    title: "",
    subject: "",
    instructorId: "",
    courseId: "",
    image: "",
    courseType: "class", // default
    billingType: "free", // default
    type: "recorded", // default
    videoLink: "",
    startTime: "",
  });

  // ---------------- Fetch Courses and Classes ----------------
  const fetchCourses = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-courses`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      console.log(data);
      if (data.success) {
        setSubjects(data.subjects);
        setCourses(data.data || []);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch courses");
    }
  }, []);

  const fetchClasses = useCallback(async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-classes`,
        {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (data.success) setClasses(data.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch classes");
    }
  }, []);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchCourses(), fetchClasses()]);
    setLoading(false);
  }, [fetchCourses, fetchClasses]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  function formatDateTimeLocal(dateString?: string) {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  }

  // ---------------- Modal Handlers ----------------
  const openClassModal = (cls?: Class) => {
    setCurrentClass(cls || null);
    setFormData({
      title: cls?.title || "",
      subject: cls?.subject || "",
      instructorId: cls?.instructorId || "",
      courseId: cls?.courseId || "",
      courseType: cls?.courseType || "class",
      billingType: cls?.billingType || "paid",
      image: cls?.image || "",
      type: cls?.type || "recorded",
      videoLink: cls?.videoLink || "",
      startTime: formatDateTimeLocal(cls?.startTime), // ✅ fixed here
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ---------------- Create / Update Class ----------------
  const handleSubmitClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    try {
      const endpoint = currentClass
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/update-class`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/create-class`;

      const payload = { ...formData, _id: currentClass?._id };

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();

      if (!result.success) throw new Error(result.message || "Failed");

      await fetchClasses();
      setIsModalOpen(false);
      setCurrentClass(null);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/delete-class/${id}`,
        {
          method: "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
        }
      );
      const result = await res.json();
      if (!result.success)
        throw new Error(result.message || "Failed to delete");
      await fetchClasses(); // refresh after delete
    } catch (err: any) {
      setError(err.message || "Failed to delete class");
    }
  };

  // ---------------- Instructors ----------------
  const instructors = courses
    .flatMap((course) => course.instructors || [])
    .filter((v, i, a) => a.findIndex((inst) => inst.name === v.name) === i);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
        <button
          onClick={() => openClassModal()}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <FaPlus className="mr-2" /> Create Class
        </button>
      </div>

      <ClassManagementPage
        loading={loading}
        classes={classes}
        openEditModal={openClassModal}
        onDelete={handleDelete}
      />

      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmitClass}
        instructors={instructors}
        courses={courses}
        isCreating={isCreating}
        error={error}
        subjects={subjects}
      />
    </div>
  );
}
