/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ClassModal } from "@/app/components/ClassModal";
import { FreeClassModal } from "@/app/components/FreeClassModal";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaStop, FaTrash } from "react-icons/fa";

interface Instructor {
  name: string;
  bio?: string;
  image?: string | null;
}

interface Course {
  _id: string;
  title: string;
  description: string;
  short_description: string;
  subjects: string[];
  thumbnailUrl: string;
  tags: string[];
  price: number;
  offer_price: number;
  instructors: Instructor[];
  studentsEnrolled: number;
  courseFor: string;
  createdAt: string;
  updatedAt: string;
}

export interface Class {
  _id: string;
  title: string;
  subject?: string;
  instructor: string;
  videoLink: string;
  course: { _id: string; title: string; courseFor: string };
  isActiveLive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FreeClass {
  _id: string;
  title: string;
  subject: string;
  videoLink: string;
  instructor: string;
  classFor: string;
  createdAt: string;
  updatedAt: string;
}

interface ClassFormData {
  title: string;
  subject: string;
  instructor: string;
  courseId: string;
  videoLink: string;
}

interface FreeClassFormData {
  title: string;
  subject: string;
  instructor: string;
  classFor: string;
  videoLink: string;
}

interface SubjectFilter {
  classCourses: string;
  admissionCourses: string;
  jobCourses: string;
}

export default function ManageClassAdmin() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [freeClasses, setFreeClasses] = useState<FreeClass[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFreeModalOpen, setIsFreeModalOpen] = useState(false);
  const [isLiveModal, setIsLiveModal] = useState(true);
  const [classToStop, setClassToStop] = useState<string | null>(null);
  const [currentClass, setCurrentClass] = useState<Class | null>(null);
  const [currentFreeClass, setCurrentFreeClass] = useState<FreeClass | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>({
    classCourses: "",
    admissionCourses: "",
    jobCourses: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isFreeDeleteDialogOpen, setIsFreeDeleteDialogOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<string | null>(null);
  const [freeClassToDelete, setFreeClassToDelete] = useState<string | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isStopping, setIsStopping] = useState<string | null>(null);
  const [isStopDialogOpen, setIsStopDialogOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noClassesAvailable, setNoClassesAvailable] = useState(false);
  const [noFreeClassesAvailable, setNoFreeClassesAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const classesPerPage = 10;

  const [formData, setFormData] = useState<ClassFormData>({
    title: "",
    subject: "",
    instructor: "",
    courseId: "",
    videoLink: "",
  });

  const [freeFormData, setFreeFormData] = useState<FreeClassFormData>({
    title: "",
    subject: "",
    instructor: "",
    classFor: "",
    videoLink: "",
  });

  // Fetch courses, classes, and free classes
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        setNoClassesAvailable(false);
        setNoFreeClassesAvailable(false);

        // Fetch courses
        const courseResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-courses`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!courseResponse.ok) {
          throw new Error(`HTTP error! status: ${courseResponse.status}`);
        }
        const courseResult = await courseResponse.json();
        if (!courseResult.success) {
          throw new Error(courseResult.message || "Failed to fetch courses");
        }
        setCourses(courseResult.data || []);
        setSubjects(courseResult.subjects || []);

        // Fetch classes
        const classResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-classes`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!classResponse.ok) {
          throw new Error(`HTTP error! status: ${classResponse.status}`);
        }
        const classResult = await classResponse.json();
        if (!classResult.success) {
          throw new Error(classResult.message || "Failed to fetch classes");
        }
        setClasses(classResult.data || []);
        setNoClassesAvailable(
          !classResult.data || classResult.data.length === 0
        );

        // Fetch free classes
        const freeClassResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-free-classes?page=${currentPage}&limit=${classesPerPage}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!freeClassResponse.ok) {
          throw new Error(`HTTP error! status: ${freeClassResponse.status}`);
        }
        const freeClassResult = await freeClassResponse.json();
        if (!freeClassResult.success) {
          throw new Error(
            freeClassResult.message || "Failed to fetch free classes"
          );
        }
        setFreeClasses(freeClassResult.data?.freeClasses || []);
        setTotalPages(freeClassResult.data?.totalPages || 1);
        setNoFreeClassesAvailable(
          !freeClassResult.data?.freeClasses ||
            freeClassResult.data.freeClasses.length === 0
        );
      } catch (error: any) {
        console.error("Error fetching data:", error);
        setError(error.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [currentPage]);

  // Refresh classes when modal, delete dialog, or stop dialog closes
  useEffect(() => {
    if (
      !isModalOpen &&
      !isDeleteDialogOpen &&
      !isStopDialogOpen &&
      !isFreeModalOpen &&
      !isFreeDeleteDialogOpen
    ) {
      async function refreshData() {
        try {
          setLoading(true);
          setError(null);
          setNoClassesAvailable(false);
          setNoFreeClassesAvailable(false);

          // Refresh classes
          const classResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-classes`,
            {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            }
          );
          if (!classResponse.ok) {
            throw new Error(`HTTP error! status: ${classResponse.status}`);
          }
          const classResult = await classResponse.json();
          if (!classResult.success) {
            throw new Error(classResult.message || "Failed to fetch classes");
          }
          setClasses(classResult.data || []);
          setNoClassesAvailable(
            !classResult.data || classResult.data.length === 0
          );

          // Refresh free classes
          const freeClassResponse = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-free-classes?page=${currentPage}&limit=${classesPerPage}`,
            {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
            }
          );
          if (!freeClassResponse.ok) {
            throw new Error(`HTTP error! status: ${freeClassResponse.status}`);
          }
          const freeClassResult = await freeClassResponse.json();
          if (!freeClassResult.success) {
            throw new Error(
              freeClassResult.message || "Failed to fetch free classes"
            );
          }
          setFreeClasses(freeClassResult.data?.freeClasses || []);
          setTotalPages(freeClassResult.data?.totalPages || 1);
          setNoFreeClassesAvailable(
            !freeClassResult.data?.freeClasses ||
              freeClassResult.data.freeClasses.length === 0
          );
        } catch (error: any) {
          console.error("Error refreshing data:", error);
          setError(error.message || "Failed to fetch data");
        } finally {
          setLoading(false);
        }
      }
      refreshData();
    }
  }, [
    isModalOpen,
    isDeleteDialogOpen,
    isStopDialogOpen,
    isFreeModalOpen,
    isFreeDeleteDialogOpen,
    currentPage,
  ]);

  // Filter classes by course type
  const classClasses = classes.filter((cls) =>
    ["class 9", "class 10", "class 11", "class 12", "hsc", "ssc"].includes(
      cls.course.courseFor
    )
  );
  const admissionClasses = classes.filter(
    (cls) => cls.course.courseFor === "admission"
  );
  const jobClasses = classes.filter(
    (cls) => cls.course.courseFor === "job preparation"
  );
  const liveClasses = classes.filter((cls) => cls.isActiveLive);

  // Filter classes by search term and subject
  const filterClasses = (classList: Class[], type: keyof SubjectFilter) => {
    return classList.filter((cls) => {
      const matchesSearch =
        cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cls.course.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject =
        !subjectFilter[type] ||
        (cls.subject && cls.subject === subjectFilter[type]);
      return matchesSearch && matchesSubject;
    });
  };

  const filteredClassClasses = filterClasses(classClasses, "classCourses");
  const filteredAdmissionClasses = filterClasses(
    admissionClasses,
    "admissionCourses"
  );
  const filteredJobClasses = filterClasses(jobClasses, "jobCourses");
  const filteredLiveClasses = filterClasses(liveClasses, "classCourses");

  // Filter free classes by search term
  const filteredFreeClasses = freeClasses.filter(
    (cls) =>
      cls.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.classFor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get unique subjects
  const getUniqueSubjects = (classList: Class[]) => {
    const subjects = new Set<string>(
      classList
        .map((cls) => cls.subject)
        .filter((subject): subject is string => !!subject)
    );
    return Array.from(subjects).sort();
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFreeInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFreeFormData({ ...freeFormData, [name]: value });
  };

  const openCreateModal = (isLive: boolean) => {
    setIsLiveModal(isLive);
    setCurrentClass(null);
    setFormData({
      title: "",
      subject: "",
      instructor: "",
      courseId: "",
      videoLink: "",
    });
    setIsModalOpen(true);
    setError(null);
  };

  const openEditModal = (cls: Class) => {
    setIsLiveModal(cls.isActiveLive);
    setCurrentClass(cls);
    setFormData({
      title: cls.title,
      subject: cls.subject || "",
      instructor: cls.instructor,
      courseId: cls.course._id,
      videoLink: cls.videoLink || "",
    });
    setIsModalOpen(true);
    setError(null);
  };

  const openCreateFreeModal = () => {
    setCurrentFreeClass(null);
    setFreeFormData({
      title: "",
      subject: "",
      instructor: "",
      classFor: "",
      videoLink: "",
    });
    setIsFreeModalOpen(true);
    setError(null);
  };

  const openEditFreeModal = (cls: FreeClass) => {
    setCurrentFreeClass(cls);
    setFreeFormData({
      title: cls.title,
      subject: cls.subject,
      instructor: cls.instructor,
      classFor: cls.classFor,
      videoLink: cls.videoLink,
    });
    setIsFreeModalOpen(true);
    setError(null);
  };

  const handleSubmit = async (
    e: React.FormEvent,
    videoFile: File | null,
    sanitizedFormData: ClassFormData
  ) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      setError(null);
      const endpoint = isLiveModal
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/create-live-class`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/create-recorded-class`;

      const formDataToSend = new FormData();
      Object.entries(sanitizedFormData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      if (!isLiveModal && videoFile) {
        formDataToSend.append("video", videoFile);
      }

      if (currentClass) {
        formDataToSend.append("_id", currentClass._id);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        const classResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-classes`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        const classResult = await classResponse.json();
        if (classResult.success) {
          setClasses(classResult.data || []);
          setNoClassesAvailable(
            !classResult.data || classResult.data.length === 0
          );
        } else {
          throw new Error(classResult.message || "Failed to fetch classes");
        }
      } else {
        throw new Error(result.message || "Failed to save class");
      }
    } catch (error: any) {
      console.error("Error saving class:", error);
      setError(error.message || "An error occurred while saving the class");
    } finally {
      setIsCreating(false);
    }
  };

  const handleFreeSubmit = async (
    e: React.FormEvent,
    sanitizedFormData: FreeClassFormData
  ) => {
    e.preventDefault();
    try {
      setIsCreating(true);
      setError(null);

      const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/create-free-class`;
      const formDataToSend = new FormData();
      Object.entries(sanitizedFormData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataToSend.append(key, value);
        }
      });

      if (currentFreeClass) {
        formDataToSend.append("_id", currentFreeClass._id);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }
      if (result.success) {
        setIsFreeModalOpen(false);
        const freeClassResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-free-classes?page=${currentPage}&limit=${classesPerPage}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        const freeClassResult = await freeClassResponse.json();
        if (freeClassResult.success) {
          setFreeClasses(freeClassResult.data?.freeClasses || []);
          setTotalPages(freeClassResult.data?.totalPages || 1);
          setNoFreeClassesAvailable(
            !freeClassResult.data?.freeClasses ||
              freeClassResult.data.freeClasses.length === 0
          );
        } else {
          throw new Error(
            freeClassResult.message || "Failed to fetch free classes"
          );
        }
      } else {
        throw new Error(result.message || "Failed to save free class");
      }
    } catch (error: any) {
      console.error("Error saving free class:", error);
      setError(
        error.message || "An error occurred while saving the free class"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/delete-class`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        const classResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-classes`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        const classResult = await classResponse.json();
        if (classResult.success) {
          setClasses(classResult.data || []);
          setNoClassesAvailable(
            !classResult.data || classResult.data.length === 0
          );
        } else {
          throw new Error(classResult.message || "Failed to fetch classes");
        }
      } else {
        throw new Error(result.message || "Failed to delete class");
      }
    } catch (error: any) {
      console.error("Error deleting class:", error);
      setError(error.message || "An error occurred while deleting the class");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleFreeDelete = async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/delete-free-class`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }
      if (result.success) {
        const freeClassResponse = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-free-classes?page=${currentPage}&limit=${classesPerPage}`,
          {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          }
        );
        const freeClassResult = await freeClassResponse.json();
        if (freeClassResult.success) {
          setFreeClasses(freeClassResult.data?.freeClasses || []);
          setTotalPages(freeClassResult.data?.totalPages || 1);
          setNoFreeClassesAvailable(
            !freeClassResult.data?.freeClasses ||
              freeClassResult.data.freeClasses.length === 0
          );
        } else {
          throw new Error(
            freeClassResult.message || "Failed to fetch free classes"
          );
        }
      } else {
        throw new Error(result.message || "Failed to delete free class");
      }
    } catch (error: any) {
      console.error("Error deleting free class:", error);
      setError(
        error.message || "An error occurred while deleting the free class"
      );
    } finally {
      setIsDeleting(false);
      setIsFreeDeleteDialogOpen(false);
    }
  };

  const handleStopLive = async (id: string) => {
    setIsStopping(id);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/stop-live-class`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ _id: id }),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        throw new Error(
          result.message || `HTTP error! status: ${response.status}`
        );
      }
      if (result.success) {
        setClasses(
          classes.map((cls) =>
            cls._id === id ? { ...cls, isActiveLive: false } : cls
          )
        );
      } else {
        throw new Error(result.message || "Failed to stop live class");
      }
    } catch (error: any) {
      console.error("Error stopping live class:", error);
      setError(
        error.message || "An error occurred while stopping the live class"
      );
    } finally {
      setIsStopping(null);
      setIsStopDialogOpen(false);
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Helper function to format subject
  const formatSubject = (subject?: string) => {
    if (!subject) return "N/A";
    return subject.charAt(0).toUpperCase() + subject.slice(1);
  };

  return (
    <div className="p-6">
      {/* Page header and controls */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Class Management</h1>
        <div className="flex space-x-4">
          <button
            onClick={openCreateFreeModal}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <FaPlus className="mr-2" /> Create Free Class
          </button>
          <button
            onClick={() => openCreateModal(true)}
            className="bg-myred hover:bg-myred-dark text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            <FaPlus className="mr-2" /> Start Live Class
          </button>
          <button
            disabled={true}
            className="bg-gray-400 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlus className="mr-2" /> Upload Recorded (Disabled)
          </button>
        </div>
      </div>

      {/* No classes available message */}
      {noClassesAvailable && noFreeClassesAvailable && !loading && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg text-center">
          No classes available
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Search input */}
      {(!noClassesAvailable || !noFreeClassesAvailable) && (
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search classes by title, instructor, subject, or course..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myred focus:border-myred"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
      )}

      {/* Ongoing Live Classes Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Ongoing Live Classes
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Live Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredLiveClasses.length > 0 ? (
                  filteredLiveClasses
                    .map((cls) => (
                      <tr key={cls._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {cls.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {formatSubject(cls.subject)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{cls.instructor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {cls.course.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Live
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setClassToStop(cls._id);
                              setIsStopDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900 mr-4"
                            disabled={isStopping === cls._id}
                            title="Stop Live"
                          >
                            {isStopping === cls._id ? (
                              <svg
                                className="animate-spin h-5 w-5 text-red-600"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                            ) : (
                              <FaStop />
                            )}
                          </button>
                          <button
                            onClick={() => openEditModal(cls)}
                            className="text-myred hover:text-myred-dark mr-4"
                            disabled={loading}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setClassToDelete(cls._id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                    .reverse()
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No ongoing live classes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Class Courses (9-12) Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Class Courses (9-12)
        </h2>
        <div className="mb-4">
          <label className="mr-2 text-sm font-medium text-gray-700">
            Filter by Subject:
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-myred focus:border-myred"
            value={subjectFilter.classCourses}
            onChange={(e) =>
              setSubjectFilter({
                ...subjectFilter,
                classCourses: e.target.value,
              })
            }
            disabled={loading}
          >
            <option value="">All Subjects</option>
            {getUniqueSubjects(classClasses).map((subject) => (
              <option key={subject} value={subject}>
                {formatSubject(subject)}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredClassClasses.length > 0 ? (
                  filteredClassClasses
                    .map((cls) => (
                      <tr key={cls._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {cls.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {formatSubject(cls.subject)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{cls.instructor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {cls.course.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(cls)}
                            className="text-myred hover:text-myred-dark mr-4"
                            disabled={loading}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setClassToDelete(cls._id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                    .reverse()
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No class courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Admission Courses Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Admission Courses
        </h2>
        <div className="mb-4">
          <label className="mr-2 text-sm font-medium text-gray-700">
            Filter by Subject:
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-myred focus:border-myred"
            value={subjectFilter.admissionCourses}
            onChange={(e) =>
              setSubjectFilter({
                ...subjectFilter,
                admissionCourses: e.target.value,
              })
            }
            disabled={loading}
          >
            <option value="">All Subjects</option>
            {getUniqueSubjects(admissionClasses).map((subject) => (
              <option key={subject} value={subject}>
                {formatSubject(subject)}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredAdmissionClasses.length > 0 ? (
                  filteredAdmissionClasses
                    .map((cls) => (
                      <tr key={cls._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {cls.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {formatSubject(cls.subject)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{cls.instructor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {cls.course.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(cls)}
                            className="text-myred hover:text-myred-dark mr-4"
                            disabled={loading}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setClassToDelete(cls._id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                    .reverse()
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No admission courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Job Preparation Courses Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Job Preparation Courses
        </h2>
        <div className="mb-4">
          <label className="mr-2 text-sm font-medium text-gray-700">
            Filter by Subject:
          </label>
          <select
            className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-myred focus:border-myred"
            value={subjectFilter.jobCourses}
            onChange={(e) =>
              setSubjectFilter({ ...subjectFilter, jobCourses: e.target.value })
            }
            disabled={loading}
          >
            <option value="">All Subjects</option>
            {getUniqueSubjects(jobClasses).map((subject) => (
              <option key={subject} value={subject}>
                {formatSubject(subject)}
              </option>
            ))}
          </select>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredJobClasses.length > 0 ? (
                  filteredJobClasses
                    .map((cls) => (
                      <tr key={cls._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {cls.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {formatSubject(cls.subject)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{cls.instructor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {cls.course.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(cls)}
                            className="text-myred hover:text-myred-dark mr-4"
                            disabled={loading}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setClassToDelete(cls._id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                    .reverse()
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No job preparation courses found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Free Classes Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">
          Free Classes
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class For
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Loading...
                    </td>
                  </tr>
                ) : filteredFreeClasses.length > 0 ? (
                  filteredFreeClasses
                    .map((cls) => (
                      <tr key={cls._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {cls.title}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {formatSubject(cls.subject)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">{cls.instructor}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            {cls.classFor.toUpperCase()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditFreeModal(cls)}
                            className="text-myred hover:text-myred-dark mr-4"
                            disabled={loading}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setFreeClassToDelete(cls._id);
                              setIsFreeDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                    .reverse()
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No free classes found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center px-6 py-4">
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1 || loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages || loading}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Class Modal */}
      <ClassModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        isLiveModal={isLiveModal}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        courses={courses}
        isCreating={isCreating}
        error={error}
        currentClass={currentClass}
        subjects={subjects}
      />

      {/* Free Class Modal */}
      <FreeClassModal
        isOpen={isFreeModalOpen}
        onClose={() => setIsFreeModalOpen(false)}
        formData={freeFormData}
        handleInputChange={handleFreeInputChange}
        handleSubmit={handleFreeSubmit}
        isCreating={isCreating}
        error={error}
        currentFreeClass={currentFreeClass}
      />

      {/* Delete Confirmation Dialog (Regular Classes) */}
      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsDeleteDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-[0.35]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Class
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this class? This action
                      cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-myred focus:ring-offset-2"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        classToDelete && handleDelete(classToDelete)
                      }
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Delete Confirmation Dialog (Free Classes) */}
      <Transition appear show={isFreeDeleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsFreeDeleteDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-[0.35]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete Free Class
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this free class? This
                      action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-myred focus:ring-offset-2"
                      onClick={() => setIsFreeDeleteDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() =>
                        freeClassToDelete && handleFreeDelete(freeClassToDelete)
                      }
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Delete"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Stop Live Class Confirmation Dialog */}
      <Transition appear show={isStopDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsStopDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-[0.35]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Stop Live Class
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to stop this live class? This action
                      will end the live session.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-myred focus:ring-offset-2"
                      onClick={() => setIsStopDialogOpen(false)}
                      disabled={isStopping !== null}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => classToStop && handleStopLive(classToStop)}
                      disabled={isStopping !== null}
                    >
                      {isStopping ? (
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        "Stop"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
