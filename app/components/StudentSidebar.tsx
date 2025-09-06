"use client";
import { deleteStudentCookies } from "@/actions/deleteStudentCookies";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBook, FaChartLine, FaSignOutAlt, FaTimes, FaUsers } from "react-icons/fa";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlineClass } from "react-icons/md";
import { RiLiveFill } from "react-icons/ri";
import { SiGoogleclassroom } from "react-icons/si";
import { useStudentContext } from "../dashboard/context/StudentContext";

export function StudentSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const { hasNotification } = useStudentContext();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <FaChartLine className="mr-3" />,
    },
    {
      name: "Live Class",
      href: "/dashboard/live-class",
      icon: <RiLiveFill className="mr-3" />,
    },
    {
      name: "Add Course",
      href: "/dashboard/add-course",
      icon: <SiGoogleclassroom className="mr-3" />,
    },
    {
      name: "Courses & Content",
      href: "/dashboard/enrolled-courses",
      icon: <FaUsers className="mr-3" />,
    },
    {
      name: "Free Classes",
      href: "/dashboard/free-classes",
      icon: <MdOutlineClass className="mr-3" />,
    },
    {
      name: "Materials",
      href: "/dashboard/materials",
      icon: <FaBook className="mr-3" />,
    },
    {
      name: "Notifications",
      href: "/dashboard/notifications",
      icon: <IoIosNotificationsOutline className="mr-3" />,
      hasNotification: hasNotification,
    },
  ];

  const handleLogout = async () => {
    await deleteStudentCookies();
  };

  return (
    <div
      className={`
        bg-gray-800 text-white p-4 z-50 w-64
        h-screen fixed left-0 top-0 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0
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
      <div className="hidden lg:block mb-8 p-4">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center p-3 rounded-lg transition-colors relative ${
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
          className="mt-8 flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
        >
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </button>
      </nav>
    </div>
  );
}
