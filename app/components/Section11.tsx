"use client";

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
    },
    {
      id: 2,
      icon: <FaChalkboardTeacher />,
      title: "অভিজ্ঞ শিক্ষক",
      description: "শিল্প বিশেষজ্ঞদের কাছ থেকে শিখুন",
      gradient: "from-green-400 to-teal-500",
    },
    {
      id: 3,
      icon: <FaBook />,
      title: "শিক্ষণ উপকরণ",
      description: "সম্পূর্ণ শিক্ষামূলক রিসোর্স",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 4,
      icon: <FaLightbulb />,
      title: "ধারণা ভিত্তিক ক্লাস",
      description: "মূল ধারণার উপর জোর",
      gradient: "from-yellow-400 to-orange-500",
    },
    {
      id: 5,
      icon: <FaClipboardCheck />,
      title: "একক পরীক্ষা পদ্ধতি",
      description: "নিয়মিত মূল্যায়ন এবং অগ্রগতি ট্র্যাকিং",
      gradient: "from-indigo-500 to-purple-600",
    },
    {
      id: 6,
      icon: <FaQuestionCircle />,
      title: "প্রশ্ন ও উত্তর সেবা",
      description: "আপনার প্রশ্নের জন্য সঙ্গে সঙ্গে সমাধান",
      gradient: "from-red-400 to-pink-500",
    },
  ];

  return (
    <section className="w-full py-20 px-6 sm:px-5 lg:px-5 bg-gradient-to-b from-blue-50 via-white to-blue-50">
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
              className={`group relative rounded-3xl shadow-2xl overflow-hidden transform hover:-translate-y-2 transition-all duration-500`}
              style={{
                background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
              }}
            >
              <div
                className={`p-8 flex flex-col items-center text-center bg-gradient-to-br ${service.gradient} text-white rounded-3xl shadow-lg transition-transform duration-500 group-hover:scale-105`}
              >
                <div className="w-20 h-20 rounded-full flex items-center justify-center bg-white text-gray-900 text-3xl mb-6 shadow-md">
                  {service.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2">
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base">{service.description}</p>
                <div className="mt-6 w-12 h-1 bg-white rounded-full group-hover:w-20 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
