"use client";

import Link from "next/link";
import { FaBook, FaChalkboardTeacher, FaVideo } from "react-icons/fa";

interface EnrolledCourseCardProps {
  id: string;
  title: string;
  thumbnail: string;
  description?: string;
  completedLessons: number;
  totalLessons: number;
  isLive?: boolean;
  progress?: number;
}

export function EnrolledCourseCard({
  id,
  title,
  thumbnail,
  description,
  completedLessons,
  totalLessons,
  isLive = false,
  progress,
}: EnrolledCourseCardProps) {
  const percent =
    progress ?? Math.round((completedLessons / totalLessons) * 100);

  return (
    <div className="relative flex flex-col md:flex-row items-center bg-gradient-to-br from-gray-500 via-gray-800 to-gray-300 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-700 overflow-hidden transform hover:-translate-y-1">
      {/* Course Image */}
      <div className="relative w-full md:w-1/3 h-full overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-[250px] object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {isLive && (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full animate-pulse shadow-md">
            🔴 Live Now
          </span>
        )}
      </div>

      {/* Course Info */}
      <div className="flex-1 p-6 space-y-4">
        <h3 className="text-xl font-semibold text-white line-clamp-1">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-gray-300 line-clamp-2">{description}</p>
        )}

        {/* Progress Bar */}
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>
              {completedLessons}/{totalLessons} Lessons
            </span>
            <span>{percent}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* Buttons / Actions */}
        <div className="grid grid-cols-3 gap-3 mt-4 text-center">
          <Link
            href={`/dashboard/enrolled-courses/view/${id}`}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 text-white text-xs rounded-lg py-3 hover:from-blue-700 hover:to-blue-900 hover:scale-105 transition-all"
          >
            <FaBook className="mb-1 text-blue-300" size={18} />
            <span>Materials</span>
          </Link>

          <Link
            href={`/dashboard/enrolled-courses/view/${id}`}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800 text-white text-xs rounded-lg py-3 hover:from-purple-700 hover:to-purple-900 hover:scale-105 transition-all"
          >
            <FaChalkboardTeacher className="mb-1 text-purple-300" size={18} />
            <span>Classes</span>
          </Link>

          <Link
            href={`/dashboard/enrolled-courses/view/${id}`}
            className="flex flex-col items-center justify-center bg-gradient-to-br from-green-600 to-green-800 text-white text-xs rounded-lg py-3 hover:from-green-700 hover:to-green-900 hover:scale-105 transition-all"
          >
            <FaVideo className="mb-1 text-green-300" size={18} />
            <span>{"Let's Go"}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
