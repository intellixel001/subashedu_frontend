// app/admin/components/CourseTable.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaEdit, FaEye, FaTrash, FaVideo } from "react-icons/fa";

// ---------------- TYPES ----------------
export interface Instructor {
  name: string;
  bio?: string;
  image?: string;
}

export type CourseFor =
  | "class 9"
  | "class 10"
  | "class 11"
  | "class 12"
  | "admission"
  | "job preparation"
  | "hsc"
  | "ssc";

// Add this Content type
export interface Content {
  _id?: string;
  name: string;
  description: string;
  type: string;
  link: string;
  requiredForNext?: boolean;
}

export interface Lesson {
  _id?: string;
  name: string;
  description: string;
  type: string;
  requiredForNext?: boolean;
  contents?: Content[];
}

export interface Course {
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

interface CourseTableProps {
  title: string;
  courses: Course[];
  filteredCourses: Course[];
  subjectFilter: Record<string, string>;
  setSubjectFilter: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  loading: boolean;
  tabKey: string;
  openEditModal: (course: Course) => void;
  setCourseToDelete: (id: string) => void;
  setIsDeleteDialogOpen: (open: boolean) => void;
}

// ---------------- COMPONENT ----------------
export default function CourseTable({
  title,
  courses,
  filteredCourses,
  subjectFilter,
  setSubjectFilter,
  loading,
  tabKey,
  openEditModal,
  setCourseToDelete,
  setIsDeleteDialogOpen,
}: CourseTableProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const handleDropdownToggle = (courseId: string) => {
    setActiveDropdown(activeDropdown === courseId ? null : courseId);
  };

  const handleDelete = (courseId: string) => {
    setActiveDropdown(null);
    setCourseToDelete(courseId);
    setIsDeleteDialogOpen(true);
  };

  const getUniqueSubjects = (courses: Course[]): string[] => {
    const allSubjects = courses.flatMap((c: Course) => c.subjects);
    return Array.from(new Set(allSubjects));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>

      {/* Subject Filter */}
      <div className="mb-4">
        <label className="mr-2 text-sm font-medium text-gray-700">
          Filter by Subject:
        </label>
        <select
          className="border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-myred focus:border-myred"
          value={subjectFilter[tabKey]}
          onChange={(e) =>
            setSubjectFilter({
              ...subjectFilter,
              [tabKey]: e.target.value,
            })
          }
          disabled={loading}
        >
          <option value="">All Subjects</option>
          {getUniqueSubjects(courses).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {["Title", "Subjects", "Price", "Students", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {heading}
                    </th>
                  )
                )}
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
              ) : filteredCourses.length > 0 ? (
                filteredCourses.map((course: Course) => (
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
                        {course.subjects.map((subject) => (
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

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium relative">
                      <button
                        className="text-gray-600 hover:text-gray-800"
                        onClick={() => handleDropdownToggle(course._id)}
                        disabled={loading}
                      >
                        <BsThreeDotsVertical />
                      </button>

                      {activeDropdown === course._id && (
                        <div className="absolute right-4 mt-2 w-48 z-10 bg-white border border-gray-200 rounded shadow-lg">
                          <ul className="py-1 text-sm text-gray-700">
                            <li>
                              <button
                                onClick={() => {
                                  openEditModal(course);
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                              >
                                <FaEdit className="mr-2" />
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => handleDelete(course._id)}
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 text-red-600"
                              >
                                <FaTrash className="mr-2" />
                                Delete
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() => {
                                  alert(`View course: ${course.title}`);
                                  setActiveDropdown(null);
                                }}
                                className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                              >
                                <FaEye className="mr-2" />
                                View
                              </button>
                            </li>
                            <li>
                              <Link
                                href={`/admin/course/lessons/${course._id}`}
                              >
                                <button
                                  onClick={() => setActiveDropdown(null)}
                                  className="flex items-center w-full px-4 py-2 hover:bg-gray-100"
                                >
                                  <FaVideo className="mr-2" />
                                  Manage Lessons
                                </button>
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No courses found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
