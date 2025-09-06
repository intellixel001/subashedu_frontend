
export default function Section12() {
  return (
    <section className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/2 aspect-video rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300 border-4 border-gray-800">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/tjb0BJTwmMY"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 lg:p-8 bg-gray-800 rounded-2xl shadow-xl border border-myred/50">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-myred-secondary text-center leading-tight mb-6">
              <span className="block">পরিস্থিতি যেমনই হোক</span>
              <span className="block mt-4">প্রস্তুতি চলবে</span>
            </h2>
            <div className="w-24 h-2 bg-myred-secondary rounded-full"></div>
            <p className="text-lg text-gray-400 mt-8 text-center max-w-md">
              যেকোনো পরিস্থিতিতে শিক্ষার অগ্রযাত্রা অব্যাহত রাখাই আমাদের লক্ষ্য
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
