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
  const loopedCourses = [...courses, ...courses];

  // We'll keep a reference to the Swiper instance
  let swiperInstance: any = null;

  return (
    <div
      onMouseEnter={() => swiperInstance?.autoplay?.stop()}
      onMouseLeave={() => swiperInstance?.autoplay?.start()}
    >
      <Swiper
        onSwiper={(swiper) => (swiperInstance = swiper)} // Save instance
        slidesPerView={5}
        spaceBetween={20}
        centeredSlides={true}
        loop={true}
        freeMode={true}
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
                className={`bg-white hover:scale-110 hover:rounded-xl hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] border border-gray-200 flex flex-col overflow-hidden transition-transform duration-500 ${
                  isActive
                    ? "rounded-xl scale-110 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]"
                    : "rounded-2xl shadow-md"
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
                  <div className="mt-auto text-center">
                    <Link
                      className="text-center"
                      href={`/course/${course._id}`}
                    >
                      <button className="w-full py-2 flex items-center justify-center px-6 rounded-full brand-button text-center font-[700]">
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
