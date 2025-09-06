export default function Section9() {
  return (
    <section className="studentReviews px-6 pt-18 pb-6">
      <div className="text-center md:mb-[200px]">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-myred-secondary uppercase">
          Student Reviews
        </h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Hear what our students say about their learning experience
        </p>
      </div>

      <div className="relative w-[100px] h-[100px] md:w-[200px] md:h-[200px] mx-auto mt-16 mb-20">
        {/* Rotated Square Border (larger) */}
        <div className="absolute inset-0 border-2 border-[#F7374F] rotate-45 rounded-lg"></div>

        {/* Review Card 1 (Top Left Corner) */}
        <div className="absolute top-0 left-0 transform -translate-x-[-88px] -translate-y-[46px] md:-translate-x-[266px] lg:-translate-x-[315px] md:-translate-y-[-32px] lg:-translate-y-[-26px] w-32 md:w-56 lg:w-68 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 md:p-4 hover:shadow-xl transition-all duration-300 z-10">
          <div className="flex items-center mb-0 md:mb-2">
            <div className="h-3 w-3 md:h-10 md:w-10 rounded-full bg-myred flex items-center justify-center text-white text-xs md:text-xl font-bold mr-1 md:mr-4">
              A
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-[10px] md:text-sm">
                Ayesha Rahman
              </h4>
            </div>
          </div>
          <p className="text-gray-600 text-[8px] md:text-xs lg:text-sm">
            The HSC Chemistry Crash course helped me improve my grades
            significantly.
          </p>
        </div>

        {/* Review Card 2 (Top Right Corner) */}
        <div className="absolute top-0 right-0 transform translate-x-[-88px] -translate-y-[46px] md:translate-x-[20px] lg:translate-x-1/4 md:-translate-y-[174px] lg:-translate-y-[185px] w-32 md:w-56 lg:w-68 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 md:p-4 hover:shadow-xl transition-all duration-300 z-10">
          <div className="flex items-center mb-0 md:mb-2">
            <div className="h-3 w-3 md:h-10 md:w-10 rounded-full bg-myred flex items-center justify-center text-white text-xs md:text-xl font-bold mr-1 md:mr-4">
              S
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-[10px] md:text-sm">
                Shafiq Islam
              </h4>
            </div>
          </div>
          <p className="text-gray-600 text-[8px] md:text-xs lg:text-sm">
            The admission math course was exactly what I needed for university
            entrance exams.
          </p>
        </div>

        {/* Review Card 3 (Bottom Left Corner) */}
        <div className="absolute bottom-0 left-0 transform -translate-x-[112px] translate-y-[50px] md:-translate-x-[18px] lg:-translate-x-[36px] md:translate-y-[172px] lg:translate-y-[165px] w-32 md:w-56 lg:w-68 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 md:p-4 hover:shadow-xl transition-all duration-300 z-10">
          <div className="flex items-center mb-0 md:mb-2">
            <div className="h-3 w-3 md:h-10 md:w-10 rounded-full bg-myred flex items-center justify-center text-white text-xs md:text-xl font-bold mr-1 md:mr-4">
              M
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-[10px] md:text-sm">
                Mehedi Hasan
              </h4>
            </div>
          </div>
          <p className="text-gray-600 text-[8px] md:text-xs lg:text-sm">
            The BCS preparation course is comprehensive and well-structured.
          </p>
        </div>

        {/* Review Card 4 (Bottom Right Corner) */}
        <div className="absolute bottom-0 right-0 transform translate-x-[114px] translate-y-[60px] md:translate-x-[268px] lg:translate-x-[314px] md:translate-y-[-40px] lg:translate-y-[-40px] w-32 md:w-56 lg:w-68 bg-white border border-gray-200 rounded-2xl shadow-lg p-2 md:p-4 hover:shadow-xl transition-all duration-300 z-10">
          <div className="flex items-center mb-0 md:mb-2">
            <div className="h-3 w-3 md:h-10 md:w-10 rounded-full bg-myred flex items-center justify-center text-white text-xs md:text-xl font-bold mr-1 md:mr-4">
              R
            </div>
            <div>
              <h4 className="font-semibold text-gray-800 text-[10px] md:text-sm">
                Rafia Ahmed
              </h4>
            </div>
          </div>
          <p className="text-gray-600 text-[8px] md:text-xs lg:text-sm">
            The English course transformed my communication skills effectively.
          </p>
        </div>
      </div>

      <div className="flex justify-center mt-[60px] md:mt-[192px]">
        <button className="bg-myred text-white px-6 py-2 sm:px-8 sm:py-3 rounded-full font-semibold hover:bg-myred-secondary transition-colors duration-300 text-sm sm:text-base">
          Read More Reviews
        </button>
      </div>
    </section>
  );
}
