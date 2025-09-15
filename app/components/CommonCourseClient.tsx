"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CourseFor, Instructor, Lesson } from "../admin/components/CourseTable";

// Define the Course type
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

// Define component props type
interface CommonCourseClientProps {
  coursesData: Course[];
  name: string;
}

export default function CommonCourseClient({
  coursesData,
  name: courseName,
}: CommonCourseClientProps) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // Get unique subjects for dropdown
  const allSubjects = [
    ...new Set(coursesData.flatMap((course) => course.subjects || [])),
  ] as string[]; // Explicitly cast to string array

  // Filter courses
  const filteredCourses = coursesData.filter((course) => {
    if (!course.courseFor || typeof course.courseFor !== "string") {
      console.warn("Invalid course data:", course);
      return false;
    }

    const subjectMatch = selectedSubject
      ? (course.subjects || [])
          .map((s) => s.toLowerCase())
          .includes(selectedSubject.toLowerCase())
      : true;
    const typeMatch =
      course.courseFor.toLowerCase() === courseName.toLowerCase() ||
      (courseName.toLowerCase() === "class 9-12" &&
        ["class 9", "class 10", "class 11", "class 12", "hsc", "ssc"].includes(
          course.courseFor.toLowerCase()
        ));
    return subjectMatch && typeMatch;
  });

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(
    indexOfFirstCourse,
    indexOfLastCourse
  );
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);

  // Format price with currency
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN").format(price || 0);

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 mt-6">
        <div className="relative w-full sm:w-64">
          <select
            name="subject"
            id="subject"
            value={selectedSubject}
            onChange={(e) => {
              setSelectedSubject(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-3 pr-8 rounded-lg border border-myred/30 bg-gray-800 text-gray-300 focus:border-myred focus:ring-2 focus:ring-myred/50 appearance-none cursor-pointer transition-all duration-200 hover:border-myred/50 focus:outline-none"
          >
            <option className="text-center bg-gray-800 text-gray-300" value="">
              -- Select Subject --
            </option>
            {allSubjects.map((subject, index) => (
              <option
                key={index}
                className="text-center bg-gray-800 text-gray-300"
                value={subject}
              >
                {subject}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {currentCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {currentCourses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-800/70 backdrop-blur-md rounded-xl shadow-md hover:shadow-myred/50 transition-all duration-300 flex flex-col border border-myred/30"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={course.thumbnailUrl || "/placeholder-image.jpg"}
                    alt={course.title || "Course"}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    placeholder="blur"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {(course.subjects || []).map((subject) => (
                      <span
                        key={subject}
                        className="bg-myred/30 text-gray-100 text-sm font-medium px-3 py-1 rounded-full transition-colors duration-200 hover:bg-myred/50"
                      >
                        {subject}
                      </span>
                    ))}
                    <span className="bg-gray-700 text-gray-300 text-sm font-medium px-3 py-1 rounded-full ml-auto">
                      {course.courseFor || "N/A"}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2 line-clamp-2 min-h-[3rem]">
                    {course.title || "Untitled Course"}
                  </h3>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-5 flex-grow">
                    {course.short_description || "No description available"}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">
                      {course.studentsEnrolled || 0} Students
                    </span>
                    <div className="flex items-center gap-2">
                      {course.offer_price &&
                      course.offer_price.toString().trim() !== "" ? (
                        <>
                          <span className="font-bold text-myred-secondary">
                            ৳{formatPrice(course.offer_price)}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ৳{formatPrice(course.price)}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-myred-secondary">
                          ৳{formatPrice(course.price)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_URL}/course/${course.id}`}
                    className="block mt-auto"
                  >
                    <button className="w-full bg-gradient-to-r from-myred to-myred-secondary text-gray-100 py-2.5 rounded-md font-medium hover:bg-myred-dark transition-colors duration-200 relative overflow-hidden group">
                      <span className="relative z-10">Enroll Now</span>
                      <span className="absolute inset-0 bg-myred-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() =>
                  setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)
                }
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-l-md border border-myred/30 bg-gray-800 text-gray-300 hover:bg-myred/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-4 py-2 border-t border-b border-myred/30 ${
                    currentPage === index + 1
                      ? "bg-myred text-gray-100"
                      : "bg-gray-800 text-gray-300 hover:bg-myred/20"
                  } transition-colors duration-200`}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  setCurrentPage(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-r-md border border-myred/30 bg-gray-800 text-gray-300 hover:bg-myred/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                Next
              </button>
            </nav>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-300 text-lg font-medium">
            No courses found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSelectedSubject("");
            }}
            className="mt-4 text-myred-secondary hover:text-myred transition-colors duration-200 font-medium"
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
