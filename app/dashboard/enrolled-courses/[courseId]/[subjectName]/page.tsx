"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaChalkboardTeacher, FaSpinner } from "react-icons/fa";

interface ClassData {
  _id: string;
  title: string;
  subject: string;
  videoLink: string;
  instructor: string;
  course: string;
  isActiveLive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ClassVideosList = () => {
  const params = useParams();
  const courseId = params?.courseId as string;
  const subjectName = params?.subjectName as string;
  const [classesData, setClassesData] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recorded classes
  useEffect(() => {
    const fetchClasses = async () => {
      if (!courseId || !subjectName) {
        setError("Missing course ID or subject name");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/get-course-classes-videos/${courseId}/${subjectName}`,
          { credentials: "include" }
        );
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.message || "Failed to fetch classes");
        }
        const recordedClasses = result.data.filter(
          (cls: ClassData) => !cls.isActiveLive
        );
        setClassesData(recordedClasses);
      } catch (err) {
        setError((err as Error).message || "An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [courseId, subjectName]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-[#f7374f] mb-4" />
        <p className="text-lg text-gray-600">Loading class data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <p className="text-lg font-medium mb-2">Error loading classes</p>
        <p className="text-sm">{error}</p>
        <Link href="/dashboard/enrolled-courses">
          <button className="mt-4 bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2">
            <FaArrowLeft /> Back to Courses
          </button>
        </Link>
      </div>
    );
  }

  if (!classesData.length) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <p className="text-lg text-gray-600">No recorded classes available</p>
        <Link href="/dashboard/enrolled-courses">
          <button className="mt-4 bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors flex items-center gap-2">
            <FaArrowLeft /> Back to Courses
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="bg-[#f7374f] p-6 text-white">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <FaChalkboardTeacher className="text-2xl" />
              <h1 className="text-xl md:text-2xl font-bold">
                Recorded Classes -{" "}
                {subjectName.charAt(0)?.toUpperCase() ||
                  "" ||
                  "" + subjectName.slice(1)}
              </h1>
            </div>
            <Link
              href="/student-dashboard/courses"
              className="bg-white/20 px-3 py-1 rounded-full text-sm hover:bg-white/30 transition-colors flex items-center gap-1"
            >
              <FaArrowLeft /> All Courses
            </Link>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Available Classes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classesData.map((cls) => (
              <div
                key={cls._id}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
              >
                <p className="font-medium text-gray-800">{cls.title}</p>
                <p className="text-sm text-gray-600">{cls.instructor}</p>
                <p className="text-xs text-gray-500">
                  {new Date(cls.createdAt).toLocaleDateString()}
                </p>
                <Link
                  href={`/dashboard/enrolled-courses/${courseId}/${subjectName}/${cls._id}`}
                >
                  <button className="mt-3 w-full bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] transition-colors">
                    View Class
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassVideosList;
