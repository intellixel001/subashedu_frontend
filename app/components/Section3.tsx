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
      gradient: "bg-gradient-to-r from-blue-400 to-purple-400",
    },
    {
      id: 2,
      icon: <FaGraduationCap className="text-3xl" />,
      title: "ভর্তি প্রস্তুতি ১২+",
      description: "শীর্ষ বিশ্ববিদ্যালয়ে ভর্তি জন্য দিকনির্দেশনা",
      link: "/courses/admission",
      gradient: "bg-gradient-to-r from-green-400 to-teal-400",
    },
    {
      id: 3,
      icon: <FaBriefcase className="text-3xl" />,
      title: "চাকরি প্রস্তুতি",
      description: "ক্যারিয়ার-উन्मুখ প্রশিক্ষণ এবং সাক্ষাৎকার প্রস্তুতি",
      link: "/courses/job%20preparation",
      gradient: "bg-gradient-to-r from-pink-400 to-red-400",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 uppercase tracking-tight">
            সেরা মেন্টরের সাথে{" "}
            <span className="text-blue-600">প্রস্তুতি নিন</span>
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto normal-case">
            Suvash Edu আপনাকে সেরা শিক্ষকের নির্দেশনা প্রদান করছে আপনার
            শিক্ষাজীবন গড়ার জন্য
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {prepareCards.map((card) => (
            <div
              key={card.id}
              className="group relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div
                  className={`mb-6 w-20 h-20 rounded-full flex items-center justify-center ${card.gradient} text-white text-3xl`}
                >
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-600 text-sm">{card.description}</p>
                <div
                  className={`mt-6 w-16 h-1 rounded-full ${card.gradient} transition-all duration-300`}
                ></div>
              </div>
              <div className="px-8 pb-8 text-center">
                <Link href={card.link}>
                  <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
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
