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
    <section
      style={{
        background: `url("/assets/staticbg.png")`,
        backgroundAttachment: "fixed",
      }}
      className="w-full relative"
    >
      <div className="bg-[#f2f4f7]/90">
        <div className="max-w-7xl relative mx-auto">
          <div className="text-center py-20 px-6 sm:px-12 lg:px-20 lg:pb-[150px] pb-[350px]">
            {/* University Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {universities.map((uni) => (
                <div
                  key={uni.id}
                  className="bg-gradient-to-tr to-teal-500/50 backdrop-blur-xl transform group relative rounded-2xl shadow-lg hover:shadow-lg transition-all duration-500 overflow-hidden cursor-pointer border border-gray-200 bg-white hover:bg-gradient-to-tl hover:to-white via-[#f2f4f7] from-white hover:-translate-y-5"
                >
                  <div className="p-8 flex flex-col items-center text-center">
                    {/* Icon */}
                    <div className="w-24 h-24 rounded-full bg-[#fca00a]/10 text-[#fca00a] flex items-center justify-center mb-6 text-3xl shadow-md group-hover:scale-110 transition-transform duration-300">
                      {uni.icon}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-[#fca00a] transition-colors duration-300">
                      {uni.name}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 text-sm">
                      {uni.description}
                    </p>

                    {/* Student Count */}
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <FaUsers className="text-[#fca00a]" />
                      <span className="text-2xl font-bold text-[#fca00a]">
                        {uni.students}
                      </span>
                    </div>

                    <p className="text-gray-600 uppercase text-xs font-medium tracking-wider">
                      সফল শিক্ষার্থী
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay Section Below Cards */}
          <div className="absolute bottom-[-200px] w-full mx-auto bg-gradient-to-t from-white via-white shadow-lg rounded-4xl to-transparent">
            <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-20 py-16 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="text-white">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 uppercase">
                  আমাদের শিক্ষার যাত্রা
                </h2>
                <p className="text-gray-600 mt-3 text-base sm:text-lg">
                  আমাদের প্ল্যাটফর্মে যোগ দিন এবং বিভিন্ন বিশ্ববিদ্যালয় থেকে
                  শিক্ষার্থীদের সঙ্গে যুক্ত হোন। সফলতার পথে এগিয়ে চলুন, প্রতিটি
                  কোর্স আপনাকে শক্তিশালী করবে।{" "}
                </p>

                <button className="brand-button font-bold px-6 py-3 rounded-lg shadow-lg transition-transform duration-300">
                  আরও জানুন
                </button>
              </div>
              <div className="flex justify-center lg:justify-end">
                <img
                  src="https://media.gettyimages.com/id/1298899298/vector/man-at-the-institute-studying-geometric-shapes.jpg?s=612x612&w=0&k=20&c=QA_3_XYQQDK6C6fwv4cCBNF1BtPIPNsHOxsjWeBE5qM="
                  alt="Students collage"
                  className="rounded-3xl shadow-2xl max-w-full lg:max-w-lg max-h-[250px]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
