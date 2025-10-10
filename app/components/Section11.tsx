"use client";

import Link from "next/link";
import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaLaptopCode,
  FaLightbulb,
  FaQuestionCircle,
} from "react-icons/fa";

export default function Section11() {
  const services = [
    {
      id: 1,
      icon: <FaLaptopCode />,
      title: "অনলাইন প্রোগ্রাম",
      description: "ইন্টারেক্টিভ লাইভ ও রেকর্ডেড ক্লাস",
      gradient: "from-blue-500 to-blue-700",
      limk: "#withmentor",
    },
    {
      id: 2,
      icon: <FaChalkboardTeacher />,
      title: "অভিজ্ঞ শিক্ষক",
      description: "শিল্প বিশেষজ্ঞদের কাছ থেকে শিখুন",
      gradient: "from-green-400 to-teal-500",
      limk: "/blog",
    },
    {
      id: 3,
      icon: <FaBook />,
      title: "শিক্ষণ উপকরণ",
      description: "সম্পূর্ণ শিক্ষামূলক রিসোর্স",
      gradient: "from-purple-500 to-pink-500",
      limk: "/materials",
    },
    {
      id: 4,
      icon: <FaLightbulb />,
      title: "ধারণা ভিত্তিক ক্লাস",
      description: "মূল ধারণার উপর জোর",
      limk: "/class",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      id: 5,
      icon: <FaClipboardCheck />,
      title: "একক পরীক্ষা পদ্ধতি",
      description: "নিয়মিত মূল্যায়ন এবং অগ্রগতি ট্র্যাকিং",
      gradient: "from-indigo-500 to-purple-600",
      limk: "",
    },
    {
      id: 6,
      icon: <FaQuestionCircle />,
      title: "প্রশ্ন ও উত্তর সেবা",
      description: "আপনার প্রশ্নের জন্য সঙ্গে সঙ্গে সমাধান",
      gradient: "from-red-400 to-pink-500",
      limk: "",
    },
  ];

  return (
    <section className="w-full py-20 px-6 sm:px-5 lg:px-5 bg-transparent">
      <div className="container mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-4">
            আমাদের <span className="text-myred-secondary">সেবাসমূহ</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            আপনার সাফল্যের জন্য আমাদের সম্পূর্ণ শিক্ষামূলক সমাধান
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-2xl shadow-lg hover:shadow-lg transition-all duration-500 overflow-hidden cursor-pointer border border-gray-200 bg-white hover:bg-gradient-to-tl hover:to-white via-[#f2f4f7] from-white hover:-translate-y-5"
            >
              <div className="p-8 flex flex-col items-center text-center">
                {/* Icon */}
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-[#fca00a]/10 text-[#fca00a] text-4xl mb-6 shadow-md group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900 group-hover:text-[#fca00a] transition-colors duration-300">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-gray-700 mb-6">
                  {service.description}
                </p>

                {/* Accent Line */}
                <div className="mt-auto w-12 h-1 bg-[#fca00a]/80 rounded-full group-hover:w-20 transition-all duration-300"></div>

                {/* Optional Button */}
                <div className="mt-6">
                  <Link href={service?.limk || ""}>
                    <button className="px-6 py-2 text-sm font-semibold rounded-full bg-[#fca00a] text-white shadow-md hover:bg-[#e69207] transition-colors duration-300">
                      বিস্তারিত দেখুন
                    </button>
                  </Link>
                </div>
              </div>

              {/* Subtle corner overlay effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[#fca00a]/10 to-transparent pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
