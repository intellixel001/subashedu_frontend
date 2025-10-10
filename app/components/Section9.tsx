"use client";

import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";

const reviews = [
  {
    id: 1,
    name: "আয়েশা রহমান",
    text: "এই HSC রসায়ন ক্র্যাশ কোর্স আমাকে আমার গ্রেড উন্নত করতে অনেক সাহায্য করেছে।",
  },
  {
    id: 2,
    name: "শফিক ইসলাম",
    text: "অ্যাডমিশন ম্যাথ কোর্সটি বিশ্ববিদ্যালয়ে প্রবেশ পরীক্ষার জন্য আমার প্রয়োজনীয় কোর্স ছিল।",
  },
  {
    id: 3,
    name: "মেহেদী হাসান",
    text: "BCS প্রস্তুতি কোর্সটি ব্যাপক এবং সুসংগঠিত।",
  },
  {
    id: 4,
    name: "রাফিয়া আহমেদ",
    text: "ইংরেজি কোর্সটি আমার যোগাযোগ দক্ষতা কার্যকরভাবে উন্নত করেছে।",
  },
];

export default function Section9() {
  return (
    <section className="py-16 px-6 sm:px-12 lg:px-20 bg-transparent">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 uppercase">
            শিক্ষার্থীর অভিজ্ঞতা
          </h2>
          <p className="text-gray-600 mt-3 text-base sm:text-lg">
            আমাদের শিক্ষার্থীরা তাদের শেখার অভিজ্ঞতা সম্পর্কে কী বলছে তা শুনুন।
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 group relative rounded-2xl shadow-lg hover:shadow-lg transition-all duration-500 overflow-hidden cursor-pointer border border-gray-200 bg-white hover:bg-gradient-to-tl hover:to-white via-[#f2f4f7] from-white hover:-translate-y-5"
            >
              <div className="absolute -top-4 left-4 text-blue-500 text-xl sm:text-2xl md:text-3xl">
                <FaQuoteLeft />
              </div>
              <p className="text-gray-700 text-sm sm:text-base md:text-base mt-2">
                {review.text}
              </p>
              <div className="mt-6 flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-sm sm:text-base md:text-lg">
                  {review.name[0]}
                </div>
                <h4 className="ml-3 text-[#fca00a] font-semibold text-sm sm:text-base md:text-lg">
                  {review.name}
                </h4>
              </div>
              <div className="absolute bottom-4 right-4 text-blue-500 text-xl sm:text-2xl md:text-3xl">
                <FaQuoteRight />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-12">
          <button className="brand-button px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold transition-colors duration-300 text-sm sm:text-base">
            আরও রিভিউ পড়ুন
          </button>
        </div>
      </div>
    </section>
  );
}
