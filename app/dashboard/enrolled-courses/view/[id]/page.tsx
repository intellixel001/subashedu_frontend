import { Link } from "lucide-react";
import { FaEllipsisV, FaLongArrowAltLeft, FaVideo } from "react-icons/fa";
import { getMyEnrolledCourseById } from "./api";
import ViewClient from "./ViewClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const courseData = await getMyEnrolledCourseById(id);
  console.log(courseData);

  if (!id) {
    return (
      <div className="p-6 bg-yellow-900 text-center">
        <h2 className="text-xl font-bold text-red-600">Course ID not found</h2>
        <p className="text-gray-500">
          Cannot load course because the course ID is missing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-yellow-900">
      <div className="flex items-center justify-between bg-gray-800 px-4 py-3 shadow-md">
        <div className="flex items-center gap-2">
          {/* Back button */}
          <Link href={"/dashboard/enrolled-courses"}>
            <button className="flex items-center gap-2 text-gray-200 hover:text-white transition-colors">
              <FaLongArrowAltLeft className="text-white" />
              <span> Back</span>
            </button>
          </Link>

          {/* Center text */}
          <h1 className="text-lg font-semibold text-gray-100 truncate">
            {courseData?.title || "Course Details"}
          </h1>
        </div>

        {/* Right toolbar */}
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-sm font-medium transition-colors">
            <FaVideo className="text-white" /> Live Class
          </button>
          <button className="p-2 bg-gray-700 hover:bg-gray-600 rounded-md">
            <FaEllipsisV className="text-white" />
          </button>
        </div>
      </div>
      <div className="container mx-auto">
        {courseData && id && (
          <ViewClient
            img={courseData?.thumbnailUrl || ""}
            courseData={courseData}
            courseId={id}
          />
        )}
      </div>
    </div>
  );
}
