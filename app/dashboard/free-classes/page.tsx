"use client";
import { FaGraduationCap, FaBriefcase, FaChalkboardTeacher } from "react-icons/fa";
import { MdSchool } from "react-icons/md";
import Link from "next/link";

export default function FreeClassPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-myred">Free Classes</h1>
          <p className="mt-2 text-gray-600">
            Select a category to view available classes
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* HSC Card */}
          <Link
            href="/dashboard/free-classes/hsc"
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-gradient-to-r from-red-50 to-red-100 py-12 px-6 flex flex-col items-center">
              <MdSchool className="text-4xl text-myred mb-3" />
              <h2 className="text-xl font-bold text-gray-800">Higher Secondary (HSC)</h2>
            </div>
            <div className="p-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-600">Click to view HSC classes</p>
            </div>
          </Link>

          {/* SSC Card */}
          <Link
            href="/dashboard/free-classes/ssc"
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-12 px-6 flex flex-col items-center">
              <FaGraduationCap className="text-4xl text-blue-500 mb-3" />
              <h2 className="text-xl font-bold text-gray-800">Secondary (SSC)</h2>
            </div>
            <div className="p-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-600">Click to view SSC classes</p>
            </div>
          </Link>

          {/* Admission Card */}
          <Link
            href="/dashboard/free-classes/admission"
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 py-12 px-6 flex flex-col items-center">
              <FaChalkboardTeacher className="text-4xl text-purple-500 mb-3" />
              <h2 className="text-xl font-bold text-gray-800">Admission Preparation</h2>
            </div>
            <div className="p-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-600">Click to view Admission classes</p>
            </div>
          </Link>

          {/* Job Card */}
          <Link
            href="/dashboard/free-classes/job"
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="bg-gradient-to-r from-green-50 to-green-100 py-12 px-6 flex flex-col items-center">
              <FaBriefcase className="text-4xl text-green-500 mb-3" />
              <h2 className="text-xl font-bold text-gray-800">Job Preparation</h2>
            </div>
            <div className="p-4 bg-gray-50 text-center">
              <p className="text-sm text-gray-600">Click to view Job classes</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}