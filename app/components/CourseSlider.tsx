"use client";

import Link from "next/link";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper styles
import { CourseType } from "@/_types/course";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CourseSliderProps {
  courses: CourseType[];
}

export default function CourseSlider({ courses }: CourseSliderProps) {
  // Duplicate slides to allow seamless loop
  const loopedCourses = [...courses, ...courses];

  return (
    <Swiper
      slidesPerView={5} // default for large screens
      spaceBetween={20}
      centeredSlides={true}
      loop={true}
      freeMode={true}
      speed={3000}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
      }}
      modules={[Autoplay]}
      breakpoints={{
        320: { slidesPerView: 1.5, spaceBetween: 10 },
        640: { slidesPerView: 2.5, spaceBetween: 15 },
        768: { slidesPerView: 3, spaceBetween: 20 },
        1024: { slidesPerView: 5, spaceBetween: 30 },
      }}
    >
      {loopedCourses.map((course, idx) => (
        <SwiperSlide key={idx} className="flex justify-center">
          {({ isActive }) => (
            <div
              className={`bg-white border border-gray-200 rounded-2xl shadow-md flex flex-col overflow-hidden transition-transform duration-500 ${
                isActive ? "scale-110 z-20" : "scale-90"
              }`}
            >
              <div className="relative w-full h-[180px] min-h-[180px] max-h-[180px] overflow-hidden rounded-t-2xl">
                <img
                  src={course.thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm line-clamp-5 h-[100px]">
                  {course.short_description}
                </p>
                <div className="mt-auto">
                  <Link href={`/course/${course._id}`}>
                    <button className="w-full py-2 px-6 rounded-full text-white font-medium bg-gradient-to-r from-blue-500 to-blue-600 shadow-md hover:shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300">
                      এখন ভর্তি হন
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
