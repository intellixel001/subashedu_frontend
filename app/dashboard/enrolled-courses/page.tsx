import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Enrolled() {
  const result = await getCourses();
  const data = result.data || [];
  console.log(data);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-2 sm:px-4 lg:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="mt-1 max-w-xl mx-auto text-large text-gray-500">
            Continue your learning journey with these courses
          </p>
        </div>

        {data.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.map((courseEnroll: unknown) => {
              const course = courseEnroll.course; // assuming populated course info
              const isApproved = courseEnroll.status === "approved";

              return (
                <div
                  key={courseEnroll._id}
                  className="relative bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                >
                  {/* Status Badge */}
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded ${
                      isApproved
                        ? "bg-green-500 text-white"
                        : "bg-yellow-400 text-white"
                    }`}
                  >
                    {isApproved ? "Approved" : "Pending"}
                  </span>

                  <div className="relative h-48 w-full">
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-2 px-4">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">
                      {course.title}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2 h-[40px]">
                      {course.short_description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-2">
                      {course.subjects.map((subject: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {subject}
                        </span>
                      ))}
                    </div>

                    <div className="mt-4">
                      <Link
                        href={`/dashboard/enrolled-courses/view/${course._id}`}
                        className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                          isApproved
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                        } transition-colors duration-300`}
                      >
                        {isApproved ? "View Classes" : "Pending Approval"}
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No courses enrolled
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by enrolling in a course from our catalog.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/add-course"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const getCourses = async () => {
  const cookiesInstance = cookies();
  const accessToken = cookiesInstance.get("accessToken");
  const accessTokenValue =
    accessToken && typeof accessToken !== "string" ? accessToken.value : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/my-courses`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessTokenValue}`,
      },
    }
  );

  if (!response.ok) {
    return {
      success: false,
      message: "Failed to fetch courses",
      data: [],
    };
  }

  return response.json();
};
