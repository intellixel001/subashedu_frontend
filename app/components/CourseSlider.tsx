"use client";

import Link from "next/link";
import type { Swiper as SwiperType } from "swiper";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

// Styles
import { CourseType } from "@/_types/course";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface CourseSliderProps {
  courses: CourseType[];
}

export default function CourseSlider({ courses }: CourseSliderProps) {
  const loopedCourses = [...courses, ...courses];

  // ✅ Properly type the Swiper instance
  let swiperInstance: SwiperType | null = null;

  return (
    <div
      onMouseEnter={() => swiperInstance?.autoplay?.stop()}
      onMouseLeave={() => swiperInstance?.autoplay?.start()}
    >
      <Swiper
        onSwiper={(swiper) => (swiperInstance = swiper)}
        slidesPerView={5}
        spaceBetween={20}
        centeredSlides
        loop
        freeMode
        speed={1000}
        autoplay={{
          delay: 1000,
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
          <SwiperSlide key={idx} className="flex justify-center pb-20">
            {({ isActive }) => (
              <div
                className={`bg-white border border-gray-200 flex flex-col overflow-hidden transition-transform duration-500 ${
                  isActive
                    ? "rounded-xl scale-110 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                    : "rounded-2xl shadow-md hover:scale-110 hover:rounded-xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                }`}
              >
                <div className="relative w-full h-[180px] overflow-hidden rounded-t-2xl">
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
                  <div className="mt-auto text-center">
                    <Link href={`/course/${course._id}`}>
                      <button className="w-full py-2 px-6 rounded-full brand-button font-[700]">
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
    </div>
  );
}
