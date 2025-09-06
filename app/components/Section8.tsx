
import React from 'react'
import { FaBookOpen, FaFileAlt, FaPencilRuler, FaTrophy } from 'react-icons/fa'

export default function Section8() {
  return (
    <section className="text-white flex flex-col items-center justify-center px-4 sm:px-6 pt-10 pb-6 relative">
      <div className="mb-2 text-center px-4">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-wide mb-2 text-myred-secondary">
          GROW WITH US
        </h2>
        <p className="text-gray-400 text-base sm:text-lg md:text-xl">
          Your journey to success starts here
        </p>
      </div>

      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-[18rem] md:h-[18rem] lg:w-[22rem] lg:h-[22rem] mt-12">
        <div className="absolute inset-0 rounded-full border border-myred/50 opacity-50"></div>

        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-gray-100 transition rounded-full p-2 sm:p-3 text-center bg-gray-800 shadow-lg w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex flex-col items-center justify-center">
            <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 text-myred-secondary">
              <FaBookOpen />
            </div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold">
              Learn
            </h3>
          </div>
        </div>

        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
          <div className="text-gray-100 transition rounded-full p-2 sm:p-3 text-center bg-gray-800 shadow-lg w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex flex-col items-center justify-center">
            <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 text-myred-secondary">
              <FaPencilRuler />
            </div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold">
              Practice
            </h3>
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="text-gray-100 transition rounded-full p-2 sm:p-3 text-center bg-gray-800 shadow-lg w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex flex-col items-center justify-center">
            <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 text-myred-secondary">
              <FaFileAlt />
            </div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold">
              Exam
            </h3>
          </div>
        </div>

        <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-gray-100 transition rounded-full p-2 sm:p-3 text-center bg-gray-800 shadow-lg w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 flex flex-col items-center justify-center">
            <div className="text-lg sm:text-xl md:text-2xl mb-1 sm:mb-2 text-myred-secondary">
              <FaTrophy />
            </div>
            <h3 className="text-xs sm:text-sm md:text-base font-semibold">
              Success
            </h3>
          </div>
        </div>
      </div>
    </section>
  )
}
