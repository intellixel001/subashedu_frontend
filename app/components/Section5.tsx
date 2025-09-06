
"use client";
import Link from "next/link";
import { FaBook, FaGraduationCap, FaBriefcase, FaChalkboardTeacher } from "react-icons/fa";

export default function Section5() {
  const courses = [
    {
      id: 1,
      icon: <FaBook className="text-4xl text-myred-secondary" />,
      title: "SSC",
      description:
        "Comprehensive study materials and practice tests to excel in your SSC exams.",
    },
    {
      id: 2,
      icon: <FaGraduationCap className="text-4xl text-myred-secondary" />,
      title: "HSC",
      description:
        "Targeted resources and mock exams to boost your confidence for HSC success.",
    },
    {
      id: 3,
      icon: <FaChalkboardTeacher className="text-4xl text-myred-secondary" />,
      title: "Admission",
      description:
        "Prepare for university admissions with guided practice and expert tips.",
    },
    {
      id: 4,
      icon: <FaBriefcase className="text-4xl text-myred-secondary" />,
      title: "Job Preparation",
      description:
        "Build essential skills and practice for competitive job exams and interviews.",
    },
  ];

  return (
    <section className="freeCourses px-6 py-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-myred-secondary uppercase">
          Join Our Free Courses
        </h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Learn without limits - boost your knowledge for free
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link key={course.id} href="" passHref>
            <div
              className="bg-gray-800 border border-myred/50 rounded-2xl shadow-lg hover:scale-105 hover:shadow-myred/50 transition-all duration-300 ease-in-out cursor-pointer"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="mb-4">{course.icon}</div>
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">{course.description}</p>
                <button className="bg-myred-dark text-white px-6 py-2 rounded-full hover:bg-myred-secondary bg-myred hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-all text-sm">
                  Enroll Now
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
