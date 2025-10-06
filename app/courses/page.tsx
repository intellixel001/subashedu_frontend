import Link from "next/link";
import { Suspense } from "react";
import {
  FaChalkboardTeacher,
  FaGraduationCap,
  FaUserTie,
} from "react-icons/fa";
import { CoursesListing } from "../components/CoursesListing";

export default async function CoursesPage() {
  return (
    <main className="w-full min-h-screen bg-white">
      {/* Our Courses Section */}
      <section className="py-12 px-2 md:px-4 lg:px-16 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cards Array */}
            {[
              {
                title: "Class 9-12",
                description:
                  "Comprehensive curriculum for high school excellence",
                link: "/courses/class%209-12",
                icon: <FaChalkboardTeacher className="text-3xl" />,
                gradient: "bg-gradient-to-tr from-blue-400 to-purple-500",
              },
              {
                title: "Admission Preparation",
                description: "Guidance for top university placements",
                link: "/courses/admission",
                icon: <FaGraduationCap className="text-3xl" />,
                gradient: "bg-gradient-to-tr from-green-400 to-teal-400",
              },
              {
                title: "Job Preparation",
                description: "Career-focused training and interview prep",
                link: "/courses/job%20preparation",
                icon: <FaUserTie className="text-3xl" />,
                gradient: "bg-gradient-to-tr from-pink-400 to-red-400",
              },
            ].map((course, idx) => (
              <div
                key={idx}
                className="group flex flex-col items-center text-center rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 bg-white border border-gray-200 hover:-translate-y-1"
              >
                <div
                  className={`mb-4 w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl ${course.gradient} shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  {course.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors duration-300">
                  {course.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {course.description}
                </p>
                <Link href={course.link}>
                  <button
                    className={`px-6 py-2 rounded-full text-white font-semibold transition-all duration-300 ${course.gradient} hover:brightness-110 shadow-md`}
                  >
                    View Now
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto">
        {/* All Courses Listing Section */}
        <Suspense
          fallback={
            <div className="text-center py-12 text-gray-300">
              Loading courses...
            </div>
          }
        >
          <CoursesListing />
        </Suspense>
      </div>
    </main>
  );
}
