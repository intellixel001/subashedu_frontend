"use client";
import { deleteAdminCookies } from "@/actions/deleteAdminCookies";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BsCashStack } from "react-icons/bs";
import {
  FaBlog,
  FaChartLine,
  FaExclamation,
  FaSignOutAlt,
  FaTimes,
  FaUserGraduate,
  FaUsers,
} from "react-icons/fa";
import { GiGraduateCap } from "react-icons/gi";
import { IoIosNotifications, IoIosNotificationsOutline } from "react-icons/io";
import { IoBookSharp } from "react-icons/io5";
import { MdEmail } from "react-icons/md";
import { SiGoogleclassroom } from "react-icons/si";
import { useAdminContext } from "../admin/context/AdminContext";

export function AdminSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { hasAdminNotification, hasStudentNotification } = useAdminContext();

  const navItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: <FaChartLine className="mr-3" />,
    },
    {
      name: "Manage Class",
      href: "/admin/manage-class",
      icon: <SiGoogleclassroom className="mr-3" />,
    },
    {
      name: "Manage Staff",
      href: "/admin/manage-staff",
      icon: <FaUsers className="mr-3" />,
    },
    {
      name: "Manage Student",
      href: "/admin/manage-student",
      icon: <FaUserGraduate className="mr-3" />,
    },
    {
      name: "Course",
      href: "/admin/course",
      icon: <GiGraduateCap className="mr-3" />,
    },
    {
      name: "Material",
      href: "/admin/material",
      icon: <IoBookSharp className="mr-3" />,
    },
    {
      name: "Payment Verification",
      href: "/admin/payment-verification",
      icon: <BsCashStack className="mr-3" />,
    },
    {
      name: "Exam",
      href: "/admin/exam",
      icon: <FaExclamation className="mr-3" />,
    },
    {
      name: "Blog",
      href: "/admin/blog",
      icon: <FaBlog className="mr-3" />,
    },
    {
      name: "Staff notification",
      href: "/admin/staff-notification",
      icon: <IoIosNotifications className="mr-3" />,
      hasNotification: hasAdminNotification,
    },
    {
      name: "Student notification",
      href: "/admin/student-notification",
      icon: <IoIosNotificationsOutline className="mr-3" />,
      hasNotification: hasStudentNotification,
    },
    {
      name: "Staff leave",
      href: "/admin/staff-leave",
      icon: <MdEmail className="mr-3" />,
    },
  ];

  const handleLogout = async () => {
    await deleteAdminCookies();
  };

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
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <button onClick={onClose} className="text-white">
          <FaTimes size={20} />
        </button>
      </div>

      {/* Header for desktop */}
      <div className="hidden lg:block mb-4 p-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex text-sm items-center p-3 rounded-lg transition-colors relative ${
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
