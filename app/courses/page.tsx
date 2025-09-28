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
    <main className="w-full min-h-screen bg-gray-900 pt-20">
      {/* Our Courses Section */}
      <section className="py-12 px-2 hidden md:px-4 lg:px-16 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl text-center uppercase text-myred-secondary font-bold mb-8">
            Our Courses
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Class 9-12 Box */}
            <div className="group bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg hover:shadow-myred/50 transition-all duration-300 overflow-hidden border border-myred/30">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="mb-6 w-20 h-20 rounded-full bg-myred/20 text-myred flex items-center justify-center group-hover:bg-myred group-hover:text-gray-100 transition-colors duration-300">
                  <FaChalkboardTeacher className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  Class 9-12
                </h3>
                <p className="text-gray-300 mb-6 line-clamp-2 h-[50px]">
                  Comprehensive curriculum for high school excellence
                </p>
                <Link
                  href="/courses/class%209-12"
                  className="w-full px-6 py-2 bg-gradient-to-r from-myred to-myred-secondary text-gray-100 rounded-md hover:bg-myred-dark transition-colors duration-200 relative overflow-hidden group"
                >
                  <span className="relative z-10">View Now</span>
                  <span className="absolute inset-0 bg-myred-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <div className="mt-6 w-12 h-1 bg-myred group-hover:w-20 transition-all duration-300"></div>
              </div>
            </div>

            {/* Admission Preparation Box */}
            <div className="group bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg hover:shadow-myred/50 transition-all duration-300 overflow-hidden border border-myred/30">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="mb-6 w-20 h-20 rounded-full bg-myred/20 text-myred flex items-center justify-center group-hover:bg-myred group-hover:text-gray-100 transition-colors duration-300">
                  <FaGraduationCap className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  Admission Preparation
                </h3>
                <p className="text-gray-300 mb-6 line-clamp-2 h-[50px]">
                  Guidance for top university placements
                </p>
                <Link
                  href="/courses/admission"
                  className="w-full px-6 py-2 bg-gradient-to-r from-myred to-myred-secondary text-gray-100 rounded-md hover:bg-myred-dark transition-colors duration-200 relative overflow-hidden group"
                >
                  <span className="relative z-10">View Now</span>
                  <span className="absolute inset-0 bg-myred-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <div className="mt-6 w-12 h-1 bg-myred group-hover:w-20 transition-all duration-300"></div>
              </div>
            </div>

            {/* Job Preparation Box */}
            <div className="group bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg hover:shadow-myred/50 transition-all duration-300 overflow-hidden border border-myred/30">
              <div className="p-8 flex flex-col items-center text-center">
                <div className="mb-6 w-20 h-20 rounded-full bg-myred/20 text-myred flex items-center justify-center group-hover:bg-myred group-hover:text-gray-100 transition-colors duration-300">
                  <FaUserTie className="text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  Job Preparation
                </h3>
                <p className="text-gray-300 mb-6 line-clamp-2 h-[50px]">
                  Career-focused training and interview prep
                </p>
                <Link
                  href="/courses/job%20preparation"
                  className="w-full px-6 py-2 bg-gradient-to-r from-myred to-myred-secondary text-gray-100 rounded-md hover:bg-myred-dark transition-colors duration-200 relative overflow-hidden group"
                >
                  <span className="relative z-10">View Now</span>
                  <span className="absolute inset-0 bg-myred-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
                <div className="mt-6 w-12 h-1 bg-myred group-hover:w-20 transition-all duration-300"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
    </main>
  );
}
