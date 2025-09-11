import { getCurrentStudent } from "@/lib/getCurrentStudent";
import Link from "next/link";
import {
  FaBell,
  FaBookOpen,
  FaChalkboardTeacher,
  FaPlusCircle,
  FaVideo,
} from "react-icons/fa";

export default async function StudentDashboard() {
  const studentObject = await getCurrentStudent();

  // --- Greeting based on time ---
  const currentHour = new Date().getHours();
  let greeting = "Hello";
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  const cards = [
    {
      title: "Join Live Class",
      path: "/dashboard/live-class",
      icon: <FaChalkboardTeacher className="text-3xl text-blue-600" />,
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
    },
    {
      title: "Enrolled Courses",
      path: "/dashboard/enrolled-courses",
      icon: <FaBookOpen className="text-3xl text-purple-600" />,
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
    },
    {
      title: "Free Classes",
      path: "/dashboard/free-classes",
      icon: <FaVideo className="text-3xl text-green-600" />,
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200",
    },
    {
      title: "Add Course",
      path: "/dashboard/add-course",
      icon: <FaPlusCircle className="text-3xl text-orange-600" />,
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      borderColor: "border-orange-200",
    },
    {
      title: "Notifications",
      path: "/dashboard/notifications",
      icon: <FaBell className="text-3xl text-red-600" />,
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      borderColor: "border-red-200",
    },
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      {/* Greeting */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
        {greeting},{" "}
        <span className="text-black">
          {studentObject?.data?.student?.fullName}
        </span>
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link
            href={card.path}
            key={index}
            className={`rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border ${card.bgColor} ${card.borderColor} transform hover:-translate-y-1`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-white rounded-full shadow-sm">
                {card.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-700">
                {card.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500">Click to explore</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
