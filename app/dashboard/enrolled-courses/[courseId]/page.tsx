import { cookies } from "next/headers";
import Link from "next/link";

export default async function CourseClasses({ params }) {
  const { courseId } = await params;
  const result = await getCourseClasses(courseId);

  // Error handling
  if (!result.success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-red-600">Error</h1>
          <p className="mt-2 text-gray-600">{result.message}</p>
          <Link
            href="/dashboard/enrolled-courses"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  const data = result.data;

  // Not found or no subjects
  if (!data || !data.title) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800">Course Not Found</h1>
          <p className="mt-2 text-gray-600">The course does not exist.</p>
          <Link
            href="/dashboard/enrolled-courses"
            className="mt-4 inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight">
            {data.title}
          </h1>
          {/* <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
            {data.short_description}
          </p> */}
        </div>

        {/* Subjects Section */}
        <div className="text-center mb-4">
          <h2 className="text-3xl font-bold text-gray-900">Class Subjects</h2>
          <p className="mt-2 text-lg text-gray-600">
            Select a subject to view available classes
          </p>
        </div>

        {/* Subjects Grid */}
        {data.subjects && data.subjects.length > 0 ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {data.subjects.map((subject, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex items-center justify-center mb-4">
                    <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-2xl font-bold">
                        {subject.charAt(0)}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-center text-gray-900 mb-2">
                    {subject}
                  </h3>
                  <p className="text-gray-600 text-center mb-6">
                    {data.courseFor.toUpperCase()}
                  </p>

                  <Link
                    href={`/dashboard/enrolled-courses/${courseId}/${subject.toLowerCase()}`}
                    className="w-full flex items-center justify-center px-6 py-3 rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                  >
                    View Classes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-12">
            <p className="text-gray-600">
              No subjects available for this course.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const getCourseClasses = async (courseId) => {
  const cookiesInstance = await cookies();
  const accessToken = cookiesInstance.get("accessToken");
  const accessTokenValue =
    accessToken && typeof accessToken !== "string" ? accessToken.value : "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/get-course-classes-subjects/${courseId}`,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Cookie: `accessToken=${accessTokenValue}`,
      },
    }
  );

  if (!res.ok) {
    return { success: false, message: "Failed to fetch course classes." };
  }

  return await res.json();
};
