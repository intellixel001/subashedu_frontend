"use client";

import { CourseType } from "@/_types/course";
import { EnrolledCourseCard } from "./EnrolledCourseCard";

interface EnrolledCoursesPageProps {
  data: CourseType[];
}

export default function EnrolledCoursesPage({
  data,
}: EnrolledCoursesPageProps) {
  const defaultValues = {
    completedLessons: 0,
    totalLessons: 10,
    isLive: false,
  };

  console.log(data);

  // Map API data to card props
  const enrolledCourses = (data || []).map((course) => ({
    id: course._id,
    title: course.title || "NA",
    thumbnail:
      course.thumbnailUrl ||
      "https://via.placeholder.com/400x200?text=No+Image",
    description: course.short_description || "No description available.",
    completedLessons: defaultValues.completedLessons, // static fallback
    totalLessons: defaultValues.totalLessons, // static fallback
    isLive: defaultValues.isLive, // static fallback
  }));

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b text-white">
      <h1 className="text-2xl font-bold mb-6 text-gray-100">
        My Enrolled Courses
      </h1>

      {enrolledCourses.length > 0 ? (
        <div className="flex flex-col gap-6">
          {enrolledCourses.map((course) => (
            <EnrolledCourseCard key={course.id} {...course} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-4">
              You haven't enrolled in any courses yet
            </h2>
            <p className="mb-6 text-gray-300">
              Start your learning journey by browsing our courses and enrolling
              in one today!
            </p>
            <a
              href="/dashboard/add-course"
              className="inline-block px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors duration-300"
            >
              Browse Courses
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
