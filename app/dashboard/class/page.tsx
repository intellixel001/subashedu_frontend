"use client";

import { Class } from "@/app/admin/manage-class/page";
import { useEffect, useState } from "react";
import { FaChalkboardTeacher, FaClock, FaUsers, FaVideo } from "react-icons/fa";

interface Course {
  _id: string;
  title: string;
  courseFor?: string;
}

export default function ClassesPage() {
  const [myClasses, setMyClasses] = useState<Class[]>([]);
  const [publicClasses, setPublicClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClasses()
      .then((data) => {
        setMyClasses(data.live || []);
        setPublicClasses(data.all || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <p className="text-lg font-medium mb-2">Could not load classes</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 py-6">
      {/* My Classes */}
      <Section
        title="My Live Classes"
        icon={<FaChalkboardTeacher />}
        classes={myClasses}
        emptyMessage="No live classes currently. Check back later."
        loading={loading}
        light
      />

      {/* Public Classes */}
      <Section
        title="Public Classes"
        icon={<FaUsers />}
        classes={publicClasses}
        emptyMessage="No public classes available right now."
        loading={loading}
        light
      />
    </div>
  );
}

function Section({
  title,
  icon,
  classes,
  emptyMessage,
  loading = false,
  light = false,
}: {
  title: string;
  icon: JSX.Element;
  classes: Class[];
  emptyMessage: string;
  loading?: boolean;
  light?: boolean;
}) {
  // Show skeletons while loading
  const skeletons = Array.from({ length: 3 });

  return (
    <div
      className={`${
        light ? "bg-white text-gray-800" : "bg-[#1e1e2f] text-white"
      } rounded-xl shadow-lg overflow-hidden mb-10 border ${
        light ? "border-gray-200" : "border-gray-700"
      }`}
    >
      <div
        className={`${
          light
            ? "bg-gradient-to-r from-[#f7374f]/70 to-[#ff5c6c]/70 text-white"
            : "bg-gradient-to-r from-[#f7374f] to-[#ff5c6c] text-white"
        } p-5 flex items-center gap-3`}
      >
        <span className="text-2xl">{icon}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
      </div>

      <div className={`p-5 ${light ? "bg-gray-50" : "bg-[#f9f9f9]/5"}`}>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {skeletons.map((_, i) => (
              <div
                key={i}
                className={`${
                  light
                    ? "bg-white border-gray-200"
                    : "bg-[#2b2b3c] border-gray-700"
                } animate-pulse border rounded-xl overflow-hidden h-64`}
              >
                <div className="h-40 w-full bg-gray-300 dark:bg-gray-700"></div>
                <div className="p-5 space-y-2">
                  <div className="h-5 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  <div className="h-8 bg-gray-300 rounded w-full mt-auto"></div>
                </div>
              </div>
            ))}
          </div>
        ) : classes.length === 0 ? (
          <div
            className={`text-center py-12 ${
              light ? "bg-gray-100" : "bg-[#2b2b3c]"
            } rounded-lg`}
          >
            <FaClock
              className={`mx-auto text-5xl ${
                light ? "text-red-500" : "text-[#f7374f]"
              } mb-4`}
            />
            <h3
              className={`${
                light ? "text-gray-700" : "text-gray-300"
              } text-lg font-medium`}
            >
              {emptyMessage}
            </h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes
              .map((cls) => (
                <div
                  key={cls._id}
                  className={`${
                    light
                      ? "bg-white border-gray-200"
                      : "bg-[#f9f9f9]/5 border-gray-700"
                  } border rounded-xl overflow-hidden hover:shadow-lg hover:scale-[1.02] transition transform`}
                >
                  {cls.image && (
                    <img
                      src={cls.image}
                      alt={cls.title}
                      className="h-40 w-full object-cover"
                    />
                  )}
                  <div className="p-5 flex flex-col h-full">
                    <h3
                      className={`font-bold text-lg mb-2 ${
                        light ? "text-gray-800" : "text-white"
                      }`}
                    >
                      {cls.title}
                    </h3>
                    <p
                      className={`text-sm mb-1 ${
                        light ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      <span className="font-medium">Subject:</span>{" "}
                      {cls.subject}
                    </p>
                    <p
                      className={`text-sm mb-1 ${
                        light ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      <span className="font-medium">Instructor:</span>{" "}
                      {cls.instructor || "Unknown"}
                    </p>
                    <p
                      className={`text-sm mb-4 ${
                        light ? "text-gray-600" : "text-gray-400"
                      }`}
                    >
                      <span className="font-medium">Course:</span>{" "}
                      {cls.courseId?.title || "N/A"}
                    </p>

                    <a
                      href={`/dashboard/live-class/${cls._id}`}
                      className="mt-auto w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 hover:shadow-md transition flex items-center justify-center gap-2"
                    >
                      <FaVideo /> {cls.type === "live" ? "Join Live" : "Watch"}
                    </a>
                  </div>
                </div>
              ))
              .reverse()}
          </div>
        )}
      </div>
    </div>
  );
}

async function fetchClasses() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/classes`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to fetch classes");
  }

  const data = await response.json();
  return data.data;
}
