"use client";
import { deleteStaffCookies } from "@/actions/deleteStaffCookies";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsCashStack } from "react-icons/bs";
import {
  FaBlog,
  FaChalkboardTeacher,
  FaChartLine,
  FaSignOutAlt,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";
import { IoBookSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { useStaffContext } from "../management/context/StaffContext";

export function StaffSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { hasAdminNotification, hasStudentNotification, role, loading } =
    useStaffContext();

  const navItems = [
    {
      name: "Dashboard",
      href: "/management",
      icon: <FaChartLine className="mr-3" />,
    },
    {
      name: "Manage Class",
      href: "/management/manage-class",
      icon: <SiGoogleclassroom className="mr-3" />,
    },
    {
      name: "Manage Teacher",
      href: "/management/manage-teacher",
      icon: <FaChalkboardTeacher className="mr-3" />,
    },
    {
      name: "Manage Student",
      href: "/management/manage-student",
      icon: <FaUserGraduate className="mr-3" />,
    },
    {
      name: "Course",
      href: "/management/course",
      icon: <GiGraduateCap className="mr-3" />,
    },
    {
      name: "Material",
      href: "/management/material",
      icon: <IoBookSharp className="mr-3" />,
    },
    {
      name: "Payment Verification",
      href: "/management/payment-verification",
      icon: <BsCashStack className="mr-3" />,
    },
    {
      name: "Blog",
      href: "/management/blog",
      icon: <FaBlog className="mr-3" />,
    },
    {
      name: "Admin notification",
      href: "/management/admin-notification",
      icon: <IoIosNotifications className="mr-3" />,
      hasNotification: hasAdminNotification,
    },
    {
      name: "Student notification",
      href: "/management/student-notification",
      icon: <IoIosNotificationsOutline className="mr-3" />,
      hasNotification: hasStudentNotification,
    },
    {
      name: "Leave",
      href: "/management/leave",
      icon: <MdEmail className="mr-3" />,
    },
  ];

  // Filter navItems based on role
  const filteredNavItems =
    role === "teacher"
      ? navItems.filter(
          (item) =>
            item.name !== "Course" &&
            item.name !== "Material" &&
            item.name !== "Payment Verification" &&
            item.name !== "Manage Student" &&
            item.name !== "Manage Teacher" &&
            item.name !== "Blog"
        )
      : navItems;

  const handleLogout = async () => {
    await deleteStaffCookies();
  };

  if (loading) {
    return (
      <div
        className={`
          overflow-y-scroll
          bg-gray-800 text-white p-4 z-50 w-64
          h-screen fixed left-0 top-0 transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
          custom-scrollbar
        `}
      >
        <div className="flex flex-col justify-center items-center h-full">
          <div className="relative">
            {/* Cool Spinner */}
            <div
              className="
                animate-spin rounded-full h-12 w-12
                border-4 border-t-transparent border-blue-500
                shadow-md
              "
            ></div>
            {/* Pulsing Effect */}
            <div
              className="
                absolute top-0 left-0 h-12 w-12
                rounded-full bg-blue-500/20
                animate-ping
              "
            ></div>
          </div>
          <p className="mt-4 text-sm font-semibold text-gray-300 animate-pulse">
            Loading Management Panel...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        overflow-y-scroll
        bg-gray-800 text-white p-4 z-50 w-64
        h-screen fixed left-0 top-0 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
        custom-scrollbar
      `}
    >
      {/* Header for mobile */}
      <div className="flex justify-between items-center mb-6 lg:hidden">
        <h1 className="text-xl font-bold">Management Panel</h1>
        <button onClick={onClose} className="text-white">
          <FaTimes size={20} />
        </button>
      </div>

      {/* Header for desktop */}
      <div className="hidden lg:block mb-8 p-4">
        <h1 className="text-xl font-bold">Management Panel</h1>
      </div>

      <nav className="space-y-2">
        {filteredNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm flex items-center p-3 rounded-lg transition-colors relative ${
              pathname === item.href
                ? "bg-gray-700 text-white"
                : "text-gray-300 hover:bg-gray-700 hover:text-white"
            }`}
            onClick={onClose}
          >
            {item.icon}
            <span>{item.name}</span>
            {/* Notification Dot */}
            {item.hasNotification && (
              <span className="absolute right-3 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </Link>
        ))}

        {/* Logout button */}
        <button
          onClick={handleLogout}
          className="text-sm flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
