"use client";
import Link from "next/link";
import { FaBookReader, FaBriefcase, FaGraduationCap } from "react-icons/fa";

export default function Section3() {
  const prepareCards = [
    {
      id: 1,
      icon: <FaBookReader className="text-3xl" />,
      title: "একাডেমিক ৯ম - ১২তম শ্রেণি",
      description: "সেরা ফলাফলের জন্য আমাদের একাডেমিক কোরসসমূহই সেরা",
      link: "/courses/class%209-12",
      gradient: "bg-gradient-to-r from-blue-600 to-purple-600",
    },
    {
      id: 2,
      icon: <FaGraduationCap className="text-3xl" />,
      title: "বিশ্ববিদ্যালয়ে ভর্তি প্রস্তুতি",
      description: "শীর্ষ বিশ্ববিদ্যালয়ে ভর্তি জন্য দিকনির্দেশনা",
      link: "/courses/admission",
      gradient: "bg-gradient-to-r from-green-500 to-teal-500",
    },
    {
      id: 3,
      icon: <FaBriefcase className="text-3xl" />,
      title: "চাকরি প্রস্তুতি",
      description: "ক্যারিয়ার- গড়ার সেরা প্রস্তুতি নিন এখান থেকেই",
      link: "/courses/job%20preparation",
      gradient: "bg-gradient-to-r from-pink-500 to-red-500",
    },
  ];

  return (
    <section
      id="withmentor"
      className="relative px-4 sm:px-6 bg-transparent rounded-[70px]"
    >
      <div className="container mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 uppercase">
            সেরা মেন্টরের সাথে{" "}
            <span className="text-[#fca00a]">প্রস্তুতি নিন</span>
          </h2>
          <p className="text-gray-600 mt-3 text-base sm:text-lg">
            সেরা শিক্ষকদের দিকনির্দেশনায় আপনার
            শিক্ষাজীবন হোক আরও সফল
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {prepareCards.map((card) => (
            <div
              key={card.id}
              className="group relative rounded-2xl shadow-lg hover:shadow-lg transition-all duration-500 overflow-hidden cursor-pointer border border-gray-200 bg-white hover:bg-gradient-to-tl hover:to-white via-[#f2f4f7] from-white hover:-translate-y-5"
            >
              {/* Content Section */}
              <div className="p-8 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="mb-6 w-24 h-24 rounded-full flex items-center justify-center bg-[#fca00a]/10 text-[#fca00a] text-4xl shadow-md transition-transform duration-300 group-hover:scale-110">
                  {card.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-gray-900 group-hover:text-[#fca00a] transition-colors duration-300">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-600">
                  {card.description}
                </p>

                {/* Accent line */}
                <div className="mt-6 w-20 h-1 rounded-full bg-[#fca00a] transition-all duration-500 group-hover:w-24"></div>
              </div>

              {/* Button Section */}
              <div className="px-8 pb-8 text-center">
                <Link href={card.link}>
                  <button className="px-6 w-[60%] flex items-center justify-center py-3 brand-button font-semibold rounded-xl shadow-md bg-white text-black">
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
