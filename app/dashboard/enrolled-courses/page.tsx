import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function Enrolled() {
  const result = await getCourses();
  const data = result.data;



  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-2 sm:px-4 lg:px-6 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900  sm:tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="mt-1 max-w-xl mx-auto text-large text-gray-500">
            Continue your learning journey with these courses
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data?.coursesEnrolled?.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                {/* <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-md">
                  {course.studentsEnrolled} students
                </div> */}
              </div>

              <div className="p-2 px-4">
                <div className="flex justify-between items-start">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {course.title}
                  </h2>
                </div>

                <p className="text-gray-600 text-sm mb-2 line-clamp-2 h-[40px]">
                  {course.short_description} hhhh hhhhhhhhhhhh hbhbhbhbhb hbhbhbhbh jjjjjjjjjjj hgh hghghghgh
                </p>

                <div className="mb-2">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Subjects:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.subjects.map((subject: string, index: number) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    Instructor:
                  </h3>
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-gray-600 text-sm">
                        {course.instructors[0]?.name?.charAt(0) || "I"}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {course.instructors[0]?.name || "Instructor"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {course.instructors[0]?.bio || "Suvash Edu"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href={`/dashboard/enrolled-courses/${course._id}`}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300"
                  >
                    View Classes
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data?.coursesEnrolled?.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              No courses enrolled
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by enrolling in a course from our catalog.
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/add-course"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
  const cookiesInstance = await cookies();

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
    };
  }

  const result = await response.json();

  return result;
};
