import Link from 'next/link';
import { FaChalkboardTeacher, FaBookOpen, FaVideo, FaPlusCircle, FaBell } from 'react-icons/fa';
export default function StudentDashboard() {
  const cards = [
    {
      title: "Join Live Class",
      path: "/dashboard/live-class",
      icon: <FaChalkboardTeacher className="text-4xl text-blue-600" />,
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    {
      title: "Enrolled Courses",
      path: "/dashboard/enrolled-courses",
      icon: <FaBookOpen className="text-4xl text-purple-600" />,
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200"
    },
    {
      title: "Free Classes",
      path: "/dashboard/free-classes",
      icon: <FaVideo className="text-4xl text-green-600" />,
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200"
    },
    {
      title: "Add Course",
      path: "/dashboard/add-course",
      icon: <FaPlusCircle className="text-4xl text-orange-600" />,
      bgColor: "bg-gradient-to-br from-orange-50 to-orange-100",
      borderColor: "border-orange-200"
    },
    {
      title: "Notifications",
      path: "/dashboard/notifications",
      icon: <FaBell className="text-4xl text-red-600" />,
      bgColor: "bg-gradient-to-br from-red-50 to-red-100",
      borderColor: "border-red-200"
    }
  ];

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Student Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <Link
            href={card.path} 
            key={index}
            className={`rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border ${card.bgColor} ${card.borderColor} transform hover:-translate-y-1`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-3 bg-white rounded-full shadow-sm">
                {card.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-700">{card.title}</h3>
              <p className="mt-2 text-sm text-gray-500">Click to explore</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}