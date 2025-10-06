"use client";
import Link from "next/link";
import { FaBookReader, FaBriefcase, FaGraduationCap } from "react-icons/fa";

export default function Section3() {
  const prepareCards = [
    {
      id: 1,
      icon: <FaBookReader className="text-3xl" />,
      title: "একাডেমিক ৯ম - ১২শ শ্রেণি",
      description: "সর্বাঙ্গীণ পাঠ্যক্রম উচ্চতর ফলাফলের জন্য",
      link: "/courses/class%209-12",
      gradient: "bg-gradient-to-r from-blue-600 to-purple-600",
    },
    {
      id: 2,
      icon: <FaGraduationCap className="text-3xl" />,
      title: "ভর্তি প্রস্তুতি ১২+",
      description: "শীর্ষ বিশ্ববিদ্যালয়ে ভর্তি জন্য দিকনির্দেশনা",
      link: "/courses/admission",
      gradient: "bg-gradient-to-r from-green-500 to-teal-500",
    },
    {
      id: 3,
      icon: <FaBriefcase className="text-3xl" />,
      title: "চাকরি প্রস্তুতি",
      description: "ক্যারিয়ার-উন্মুখ প্রশিক্ষণ এবং সাক্ষাৎকার প্রস্তুতি",
      link: "/courses/job%20preparation",
      gradient: "bg-gradient-to-r from-pink-500 to-red-500",
    },
  ];

  return (
    <section className="relative py-20 px-4 sm:px-6 bg-gradient-to-tl from-gray-400 via-gray-300 to-transparent rounded-[70px]">
      <div className="container mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 uppercase tracking-tight">
            সেরা মেন্টরের সাথে{" "}
            <span className="text-gradient bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              প্রস্তুতি নিন
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-800 max-w-3xl mx-auto">
            Suvash Edu আপনাকে সেরা শিক্ষকের নির্দেশনা প্রদান করছে আপনার
            শিক্ষাজীবন গড়ার জন্য
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {prepareCards.map((card) => (
            <div
              key={card.id}
              className="group relative bg-gray-100 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-200 hover:-translate-y-2"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div
                  className={`mb-6 w-24 h-24 rounded-full flex items-center justify-center ${card.gradient} text-white text-3xl shadow-lg`}
                >
                  {card.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 transition-colors duration-300 group-hover:text-blue-600">
                  {card.title}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  {card.description}
                </p>
                <div
                  className={`mt-6 w-20 h-1 rounded-full ${card.gradient} transition-all duration-500 group-hover:w-24`}
                ></div>
              </div>
              <div className="px-8 pb-8 text-center">
                <Link href={card.link}>
                  <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300">
                    কোর্স দেখুন
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
