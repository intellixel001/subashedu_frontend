"use client";

import { Lesson } from "@/app/admin/components/CourseTable";
import { CourseModal } from "@/app/components/CourseModal";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";

// Define ErrorFallback component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
      <h2>Something went wrong:</h2>
      <p>{error.message}</p>
    </div>
  );
}

interface Instructor {
  name: string;
  bio?: string;
  image?: string | null;
}

interface Course {
  _id: string;
  id: string;
  title: string;
  description: string;
  short_description: string;
  subjects: string[];
  thumbnailUrl?: string;
  tags: string[];
  price: number;
  offer_price: number;
  instructors: Instructor[];
  type?: string;
  studentsEnrolled: number;
  courseFor: CourseFor;
  classes: string[];
  materials: string[];
  lessons?: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  title: string;
  description: string;
  short_description: string;
  subjects: string[];
  tags: string[];
  price: string;
  offer_price: string;
  instructors: Instructor[];
  courseFor: string;
}

interface SubjectFilter {
  classCourses: string;
  admissionCourses: string;
  jobCourses: string;
}

function CoursePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>({
    classCourses: "",
    admissionCourses: "",
    jobCourses: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noCoursesAvailable, setNoCoursesAvailable] = useState(false);

  // Form state
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    short_description: "",
    subjects: [],
    tags: [],
    price: "",
    offer_price: "",
    instructors: [],
    courseFor: "",
  });

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError(null);
        setNoCoursesAvailable(false);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/staff/get-courses`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch courses");
        }

        // Check if result.data is defined and is an array
        const coursesData = Array.isArray(result.data) ? result.data : [];
        setCourses(coursesData);
        setNoCoursesAvailable(coursesData.length === 0);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setError(error.message || "Failed to fetch courses");
        setCourses([]); // Fallback to empty array
        setNoCoursesAvailable(true);
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  // Refresh courses when modal or delete dialog closes
  useEffect(() => {
    if (!isModalOpen && !isDeleteDialogOpen) {
      async function refreshCourses() {
        try {
          setLoading(true);
          setError(null);
          setNoCoursesAvailable(false);
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/staff/get-courses`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();

          if (!result.success) {
            throw new Error(result.message || "Failed to fetch courses");
          }

          // Check if result.data is defined and is an array
          const coursesData = Array.isArray(result.data) ? result.data : [];
          setCourses(coursesData);
          setNoCoursesAvailable(coursesData.length === 0);
        } catch (error) {
          console.error("Error refreshing courses:", error);
          setError(error.message || "Failed to fetch courses");
          setCourses([]); // Fallback to empty array
          setNoCoursesAvailable(true);
        } finally {
          setLoading(false);
        }
      }
      refreshCourses();
    }
  }, [isModalOpen, isDeleteDialogOpen]);

  // Filter courses by type
  const classCourses = Array.isArray(courses)
    ? courses.filter((course) =>
        ["class 9", "class 10", "class 11", "class 12", "hsc", "ssc"].includes(
          course.courseFor
        )
      )
    : [];

  const admissionCourses = Array.isArray(courses)
    ? courses.filter((course) => course.courseFor === "admission")
    : [];

  const jobCourses = Array.isArray(courses)
    ? courses.filter((course) => course.courseFor === "job preparation")
    : [];

  // Filter courses by search term and subject
  const filterCourses = (courseList: Course[], type: keyof SubjectFilter) => {
    return courseList.filter((course) => {
      const matchesSearch =
        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesSubject =
        !subjectFilter[type] || course.subjects.includes(subjectFilter[type]);

      return matchesSearch && matchesSubject;
    });
  };

  const filteredClassCourses = filterCourses(classCourses, "classCourses");
  const filteredAdmissionCourses = filterCourses(
    admissionCourses,
    "admissionCourses"
  );
  const filteredJobCourses = filterCourses(jobCourses, "jobCourses");

  // Get unique subjects for each course type
  const getUniqueSubjects = (courseList: Course[]) => {
    const subjects = new Set<string>();
    courseList.forEach((course) => {
      course.subjects.forEach((subject) => subjects.add(subject));
    });
    return Array.from(subjects).sort();
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "tags" ? value : value,
    });
  };

  const handleArrayChange = (field: keyof FormData, value: string) => {
    const currentArray = formData[field] as string[];
    if (currentArray.includes(value)) {
      setFormData({
        ...formData,
        [field]: currentArray.filter((item) => item !== value),
      });
    } else {
      setFormData({
        ...formData,
        [field]: [...currentArray, value],
      });
    }
  };

  const handleTagsChange = (tags: string[]) => {
    setFormData({
      ...formData,
      tags,
    });
  };

  const handleInstructorChange = (
    index: number,
    field: keyof Instructor,
    value: string | null
  ) => {
    const updatedInstructors = [...formData.instructors];
    updatedInstructors[index] = {
      ...updatedInstructors[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      instructors: updatedInstructors,
    });
  };

  const addInstructor = () => {
    setFormData({
      ...formData,
      instructors: [
        ...formData.instructors,
        { name: "", bio: "", image: null },
      ],
    });
  };

  const removeInstructor = (index: number) => {
    const updatedInstructors = [...formData.instructors];
    updatedInstructors.splice(index, 1);
    setFormData({
      ...formData,
      instructors: updatedInstructors,
    });
  };

  const openCreateModal = () => {
    setCurrentCourse(null);
    setFormData({
      title: "",
      description: "",
      short_description: "",
      subjects: [],
      tags: [],
      price: "",
      offer_price: "",
      instructors: [],
      courseFor: "",
    });
    setIsModalOpen(true);
    setError(null);
  };

  const openEditModal = (course: Course) => {
    setCurrentCourse(course);
    setFormData({
      title: course.title,
      description: course.description,
      short_description: course.short_description,
      subjects: course.subjects || [],
      tags: course.tags || [],
      price: course.price.toString(),
      offer_price: course.offer_price.toString(),
      instructors: course.instructors || [],
      courseFor: course.courseFor,
    });
    setIsModalOpen(true);
    setError(null);
  };

  const handleSubmit = async (
    e: React.FormEvent,
    thumbnailFile: File | null,
    sanitizedFormData: FormData,
    instructorImageFiles: (File | null)[]
  ) => {
    e.preventDefault();

    try {
      setIsCreating(true);
      setError(null);
      const endpoint = currentCourse
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/staff/update-course`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/staff/create-course`;

      const formDataToSend = new FormData();

      // Append all sanitized form data
      Object.entries(sanitizedFormData).forEach(([key, value]) => {
        if (key === "subjects" || key === "tags" || key === "instructors") {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Append the thumbnail file if it exists
      if (thumbnailFile) {
        formDataToSend.append("thumbnail", thumbnailFile);
      }

      // Append instructor image files
      instructorImageFiles.forEach((file) => {
        if (file) {
          formDataToSend.append("instructorImages", file);
        }
      });

      // Append the course ID if editing
      if (currentCourse) {
        formDataToSend.append("_id", currentCourse._id);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        if (currentCourse) {
          setCourses(
            courses.map((course) =>
              course._id === currentCourse._id ? result.data : course
            )
          );
        } else {
          setCourses([...courses, result.data]);
        }
        setNoCoursesAvailable(false);
      } else {
        throw new Error(result.message || "Failed to save course");
      }
    } catch (error) {
      console.error("Error saving course:", error);
      setError(error.message || "An error occurred while saving the course");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/staff/delete-course`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        const updatedCourses = courses.filter((course) => course._id !== id);
        setCourses(updatedCourses);
        setNoCoursesAvailable(updatedCourses.length === 0);
      } else {
        throw new Error(result.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      setError(error.message || "An error occurred while deleting the course");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="p-6">
      {/* Page header and controls */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-myred hover:bg-myred-dark text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <FaPlus className="mr-2" /> Add New Course
        </button>
      </div>

      {/* No courses available message */}
      {noCoursesAvailable && !loading && (
        <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg text-center">
          No courses available
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Search input */}
      {!noCoursesAvailable && (
        <div className="mb-6 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search courses by title, description or tags..."
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-myred focus:border-myred"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
          />
        </div>
      )}

      {/* Class Courses (9-12) Table */}
      {!noCoursesAvailable && (
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
              {getUniqueSubjects(classCourses).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
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
                      Subjects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
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
                  ) : filteredClassCourses.length > 0 ? (
                    filteredClassCourses.map((course) => (
                      <tr key={course._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                              {course.thumbnailUrl ? (
                                <Image
                                  src={course.thumbnailUrl}
                                  alt={course.title}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-gray-400">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900  max-w-[300px] overflow-hidden text-ellipsis">
                                {course.title}
                              </div>
                              <div className="text-sm text-gray-500  max-w-[300px] overflow-hidden text-ellipsis">
                                {course.short_description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {(course.subjects || []).map((subject) => (
                              <span
                                key={subject}
                                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            ৳{course.offer_price}
                            {course.offer_price < course.price && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                ৳{course.price}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {course.studentsEnrolled} enrolled
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(course)}
                            className="text-myred hover:text-myred-dark mr-4"
                            disabled={loading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setCourseToDelete(course._id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
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
      )}

      {/* Admission Courses Table */}
      {!noCoursesAvailable && (
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
              {getUniqueSubjects(admissionCourses).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
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
                      Subjects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
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
                  ) : filteredAdmissionCourses.length > 0 ? (
                    filteredAdmissionCourses.map((course) => (
                      <tr key={course._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                              {course.thumbnailUrl ? (
                                <Image
                                  src={course.thumbnailUrl}
                                  alt={course.title}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-gray-400">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 max-w-[300px] overflow-hidden text-ellipsis">
                                {course.title}
                              </div>
                              <div className="text-sm text-gray-500 max-w-[300px] overflow-hidden text-ellipsis">
                                {course.short_description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {(course.subjects || []).map((subject) => (
                              <span
                                key={subject}
                                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            ৳{course.offer_price}
                            {course.offer_price < course.price && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                ৳{course.price}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {course.studentsEnrolled} enrolled
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(course)}
                            className="text-myred hover:text-myred-dark mr-4"
                            disabled={loading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setCourseToDelete(course._id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
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
      )}

      {/* Job Preparation Courses Table */}
      {!noCoursesAvailable && (
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
                setSubjectFilter({
                  ...subjectFilter,
                  jobCourses: e.target.value,
                })
              }
              disabled={loading}
            >
              <option value="">All Subjects</option>
              {getUniqueSubjects(jobCourses).map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
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
                      Subjects
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
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
                  ) : filteredJobCourses.length > 0 ? (
                    filteredJobCourses.map((course) => (
                      <tr key={course._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                              {course.thumbnailUrl ? (
                                <Image
                                  src={course.thumbnailUrl}
                                  alt={course.title}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full bg-gray-100 flex items-center justify-center">
                                  <span className="text-xs text-gray-400">
                                    No image
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900 max-w-[300px] overflow-hidden text-ellipsis">
                                {course.title}
                              </div>
                              <div className="text-sm text-gray-500 max-w-[300px] overflow-hidden text-ellipsis">
                                {course.short_description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-wrap gap-1">
                            {(course.subjects || []).map((subject) => (
                              <span
                                key={subject}
                                className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-gray-900">
                            ৳{course.offer_price}
                            {course.offer_price < course.price && (
                              <span className="ml-2 text-sm text-gray-500 line-through">
                                ৳{course.price}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {course.studentsEnrolled} enrolled
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => openEditModal(course)}
                            className="text-myred hover:text-myred-dark mr-4"
                            disabled={loading}
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setCourseToDelete(course._id);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-red-600 hover:text-red-900"
                            disabled={loading}
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
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
      )}

      {/* Course Modal */}
      <CourseModal
        isModalOpen={isModalOpen}
        Fragment={Fragment}
        currentCourse={currentCourse}
        handleSubmit={handleSubmit}
        formData={formData}
        handleInputChange={handleInputChange}
        handleTagsChange={handleTagsChange}
        addInstructor={addInstructor}
        handleArrayChange={handleArrayChange}
        handleInstructorChange={handleInstructorChange}
        removeInstructor={removeInstructor}
        setIsModalOpen={setIsModalOpen}
        isCreating={isCreating}
        setFormData={setFormData}
      />

      {/* Delete Confirmation Dialog */}
      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
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
            <div className="fixed inset-0 bg-black/55" />
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
                    Confirm Course Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this course? This action
                      cannot be undone and all associated data will be
                      permanently removed.
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
                      className="inline-flex justify-center rounded-md border border-transparent bg-myred px-4 py-2 text-sm font-medium text-white hover:bg-myred-dark focus:outline-none focus:ring-2 focus:ring-myred focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (courseToDelete) {
                          handleDelete(courseToDelete);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                          Deleting...
                        </>
                      ) : (
                        "Delete Course"
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

export default function CoursePageWrapper() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CoursePage />
    </ErrorBoundary>
  );
}
