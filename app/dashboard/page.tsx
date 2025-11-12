import { getCurrentStudent } from "@/lib/getCurrentStudent";
import { cookies } from "next/headers";
import Link from "next/link";
import {
  FaBell,
  FaBookOpen,
  FaChalkboardTeacher,
  FaPlusCircle,
  FaVideo,
} from "react-icons/fa";
import EnrolledCoursesPage from "./components/StudentDashboard";

// interface Enrollment {
//   _id: string;
//   status: "approved" | "pending";
//   paymentMethod: string;
//   transactionId: string;
//   course: CourseType;
// }

export default async function StudentDashboard() {
  const studentObject = await getCurrentStudent();
  const result = await getCourses();
  const data = result.data || [];
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshAccessToken = cookieStore.get("refreshToken")?.value;

  // --- Greeting based on time ---
  const currentHour = new Date().getHours();
  let greeting = "Hello";
  if (currentHour < 12) greeting = "Good Morning";
  else if (currentHour < 18) greeting = "Good Afternoon";
  else greeting = "Good Evening";

  // --- Dashboard Cards ---
  const cards = [
    {
      title: "Explore Exam",
      path: `https://exam.suvashedu.com?accessToken=${accessToken}&refreshAccessToken=${refreshAccessToken}`,
      icon: <FaChalkboardTeacher className="text-2xl text-white" />,
      bgColor: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
    },
    {
      title: "Join Live Class",
      path: "/dashboard/class",
      icon: <FaChalkboardTeacher className="text-2xl text-white" />,
      bgColor: "bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600",
    },
    {
      title: "Enrolled Courses",
      path: "/dashboard/enrolled-courses",
      icon: <FaBookOpen className="text-2xl text-white" />,
      bgColor: "bg-gradient-to-br from-purple-500 via-violet-600 to-indigo-700",
    },
    {
      title: "Free Classes",
      path: "/dashboard/class",
      icon: <FaVideo className="text-2xl text-white" />,
      bgColor: "bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600",
    },
    {
      title: "Add Course",
      path: "/dashboard/add-course",
      icon: <FaPlusCircle className="text-2xl text-white" />,
      bgColor: "bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500",
    },
    {
      title: "Notifications",
      path: "/dashboard/notifications",
      icon: <FaBell className="text-2xl text-white" />,
      bgColor: "bg-gradient-to-br from-pink-500 via-rose-600 to-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Greeting */}
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 text-center md:text-left">
        {greeting},{" "}
        <span className="text-black">
          {studentObject?.data?.student?.fullName}
        </span>
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {cards.map((card, index) => (
          <Link
            href={card.path}
            key={index}
            className={`rounded-xl p-4 shadow-md hover:shadow-xl transition-all duration-300 ${card.bgColor} text-white transform hover:-translate-y-1`}
          >
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="p-3 bg-white/20 rounded-full">{card.icon}</div>
              <h3 className="lg:text-sm text-[10px] font-semibold">
                {card.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>

      <EnrolledCoursesPage data={data} />
    </div>
  );
}

const getCourses = async () => {
  const cookiesInstance = await cookies();
  const accessToken = cookiesInstance.get("accessToken");
  const accessTokenValue =
    accessToken && typeof accessToken !== "string" ? accessToken.value : "";

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/my-enrolled-courses`,
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
      data: [],
    };
  }

  return response.json();
};
