"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  FaBars,
  FaBook,
  FaFolderOpen,
  FaHome,
  FaUserCircle,
} from "react-icons/fa";
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
      {/* --- Topbar --- */}
      {inDashboard && (
        <header className="bg-white border-b shadow-sm flex items-center justify-between px-4 py-3 lg:px-8">
          {/* Left Section - Logo or Title */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-700 hover:text-blue-600 focus:outline-none lg:hidden"
            >
              <FaBars size={22} />
            </button>

            <Link href="/" className="text-lg font-semibold text-gray-800">
              Home
            </Link>
          </div>

          {/* Right Section - Profile or Actions */}
          <div className="flex items-center space-x-4">
            <Link
              href="/student/profile"
              className="text-gray-700 hover:text-blue-600"
            >
              <FaUserCircle size={24} />
            </Link>
          </div>
        </header>
      )}

      {/* --- Desktop Sidebar --- */}
      {inDashboard && (
        <div className="hidden lg:block">
          {/* add top padding so sidebar doesn’t overlap topbar */}
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

      {/* --- Mobile Bottom Navigation --- */}
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
          href="/courses"
          className={`flex flex-col items-center ${
            pathname?.includes("/courses")
              ? "text-blue-600 font-semibold"
              : "text-gray-700"
          } hover:text-blue-600`}
        >
          <FaBook size={20} />
          <span className="text-xs mt-1">Courses</span>
        </Link>

        <Link
          href="/materials"
          className={`flex flex-col items-center ${
            pathname?.includes("/materials")
              ? "text-blue-600 font-semibold"
              : "text-gray-700"
          } hover:text-blue-600`}
        >
          <FaFolderOpen size={20} />
          <span className="text-xs mt-1">Materials</span>
        </Link>

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

      {/* Add padding so content doesn’t hide behind topbar & bottomnav */}
      {/* <div className="pt-16 pb-16 lg:pb-0" /> */}
    </>
  );
}
