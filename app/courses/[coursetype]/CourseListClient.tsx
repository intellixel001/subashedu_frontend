"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaBook, FaSadTear, FaUsers } from "react-icons/fa";

interface Course {
  _id: string;
  id: string;
  title: string;
  short_description: string;
  thumbnailUrl: string;
  price: number;
  offer_price: number;
  studentsEnrolled: number;
}

export default function CourseListClient({ courses }: { courses: Course[] }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    // Skeleton loader
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-800 rounded-2xl p-4 shadow-md"
          >
            <div className="w-full h-40 bg-gray-700 rounded-xl mb-4"></div>
            <div className="h-6 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!courses || courses.length === 0) {
    // No course found UI
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
        <FaSadTear className="text-5xl text-gray-400 animate-bounce" />
        <h2 className="text-xl font-semibold text-white">No Courses Found</h2>
        <p className="text-gray-400 max-w-md">
          We couldn’t find any courses for this category. Please check back
          later or explore other categories.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <Link key={course._id} href={"/course/" + course?._id + "/enrollment"}>
          <div className="bg-gray-900 text-white rounded-2xl shadow-md hover:shadow-xl hover:scale-[1.02] transition duration-300 overflow-hidden">
            <Image
              src={course.thumbnailUrl}
              alt={course.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover"
            />
            <div className="p-4 space-y-3">
              <h2 className="text-lg font-semibold">{course.title}</h2>
              <p className="text-gray-300 text-sm line-clamp-2">
                {course.short_description}
              </p>
              <div className="flex justify-between items-center text-sm">
                <span className="flex items-center gap-1 text-gray-400">
                  <FaUsers /> {course.studentsEnrolled}+
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <FaBook /> Course
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div>
                  <span className="text-red-400 font-bold">
                    ৳{course.offer_price}
                  </span>
                  <span className="text-gray-400 line-through ml-2">
                    ৳{course.price}
                  </span>
                </div>
                <Link
                  href={"/course/" + course?._id + "/enrollment"}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                >
                  Enroll
                </Link>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
