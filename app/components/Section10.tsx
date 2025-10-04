"use client";

import {
  FaBookReader,
  FaGlobe,
  FaGraduationCap,
  FaUniversity,
  FaUsers,
} from "react-icons/fa";

export default function Section10() {
  const universities = [
    {
      id: 1,
      icon: <FaUniversity className="text-3xl" />,
      name: "ডিইউ (DU)",
      students: "১০০০+",
      description: "ঢাকা বিশ্ববিদ্যালয়",
    },
    {
      id: 2,
      icon: <FaGraduationCap className="text-3xl" />,
      name: "বিইউপি (BUP)",
      students: "৫০০০+",
      description: "বাংলাদেশ ইউনিভার্সিটি অব প্রফেশনালস",
    },
    {
      id: 3,
      icon: <FaBookReader className="text-3xl" />,
      name: "জেএইউ (JU)",
      students: "২০০০+",
      description: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়",
    },
    {
      id: 4,
      icon: <FaGlobe className="text-3xl" />,
      name: "অন্যান্য বিশ্ববিদ্যালয়",
      students: "৩০০০+",
      description: "দেশের বিভিন্ন প্রতিষ্ঠান",
    },
  ];

  return (
    <section className="w-full py-16 px-6 sm:px-12 lg:px-20 bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto text-center">
        <div className="mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-teal-900 mb-4">
            আমাদের সাফল্যের <span className="text-myred-secondary">যাত্রা</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-3xl mx-auto">
            শীর্ষস্থানীয় বিশ্ববিদ্যালয় থেকে হাজার হাজার শিক্ষার্থী আমাদের সাথে
            তাদের শিক্ষাজীবনকে রূপান্তরিত করেছে।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="group relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-400 to-teal-400 text-white flex items-center justify-center mb-6 text-3xl">
                  {uni.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-1">
                  {uni.name}
                </h3>
                <p className="text-gray-500 mb-4 text-sm">{uni.description}</p>
                <div className="flex items-center justify-center gap-2 mb-1">
                  <FaUsers className="text-myred-secondary" />
                  <span className="text-2xl font-bold text-myred-secondary">
                    {uni.students}
                  </span>
                </div>
                <p className="text-gray-400 uppercase text-xs font-medium tracking-wider">
                  সফল শিক্ষার্থী
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="relative overflow-hidden bg-myred-dark text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-600 hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-all duration-300 shadow-lg group">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <FaUsers /> আমাদের কমিউনিটিতে যোগ দিন
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-myred-dark to-myred opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>
    </section>
  );
}
