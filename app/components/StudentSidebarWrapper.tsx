"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaBars, FaBook, FaFolderOpen, FaHome } from "react-icons/fa";
import { StudentSidebar } from "./StudentSidebar";

export function StudentSidebarWrapper() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const inDashboard = pathname?.includes("dashboard");

  const ckkk = pathname.includes("dashboard/enrolled-courses/view/");

  if (ckkk) {
    return null;
  }

  return (
    <>
      {/* --- Desktop Sidebar --- */}
      {inDashboard && (
        <div className="hidden lg:block">
          <StudentSidebar isOpen={true} onClose={() => {}} />
        </div>
      )}

      {/* --- Mobile Sidebar (Slide Over) --- */}
      {inDashboard && (
        <StudentSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      )}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* --- Mobile Bottom Navigation (10MS style) --- */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around items-center py-2 lg:hidden z-50">
        <Link
          href="/"
          className={`flex flex-col items-center ${
            pathname === "/" ? "text-blue-600 font-semibold" : "text-gray-700"
          } hover:text-blue-600`}
        >
          <FaHome size={20} />
          <span className="text-xs mt-1">Home</span>
        </Link>

        <Link
          href="/student/courses"
          className={`flex flex-col items-center ${
            pathname?.includes("/student/courses")
              ? "text-blue-600 font-semibold"
              : "text-gray-700"
          } hover:text-blue-600`}
        >
          <FaBook size={20} />
          <span className="text-xs mt-1">Courses</span>
        </Link>

        <Link
          href="/student/materials"
          className={`flex flex-col items-center ${
            pathname?.includes("/student/materials")
              ? "text-blue-600 font-semibold"
              : "text-gray-700"
          } hover:text-blue-600`}
        >
          <FaFolderOpen size={20} />
          <span className="text-xs mt-1">Materials</span>
        </Link>

        {/* Smart Menu button */}
        {inDashboard ? (
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex flex-col items-center text-gray-700 hover:text-blue-600"
          >
            <FaBars size={20} />
            <span className="text-xs mt-1">Menu</span>
          </button>
        ) : (
          <Link
            href="/dashboard"
            className="flex flex-col items-center text-gray-700 hover:text-blue-600"
          >
            <FaBars size={20} />
            <span className="text-xs mt-1">Menu</span>
          </Link>
        )}
      </nav>
    </>
  );
}
