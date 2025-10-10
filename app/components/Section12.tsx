"use client";

export default function Section12() {
  return (
    <section className="w-full py-16 px-6 sm:px-5 lg:px-5 bg-transparent">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Video Section */}
          <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.03] transition-transform duration-500 border-4 border-gray-800">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/tjb0BJTwmMY"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          {/* Text Section */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-12 bg-gradient-to-br from-[#001F3F] via-[#18314a] to-[#001F3F] text-white rounded-2xl shadow-xl border border-myred/50">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-myred-secondary text-center leading-tight mb-6">
              <span className="block">পরিস্থিতি যেমনই হোক</span>
              <span className="block mt-4">প্রস্তুতি চলবে</span>
            </h2>
            <div className="w-24 h-2 bg-myred-secondary rounded-full mb-6"></div>
            <p className="text-lg sm:text-xl text-gray-400 text-center max-w-md">
              যেকোনো পরিস্থিতিতে শিক্ষার অগ্রযাত্রা অব্যাহত রাখাই আমাদের মূল
              লক্ষ্য। আমাদের সাথে থাকুন এবং সর্বদা প্রস্তুত থাকুন।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
