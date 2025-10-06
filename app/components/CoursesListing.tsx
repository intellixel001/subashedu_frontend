"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getPublicCourse } from "../globalapi/getapic";

export function CoursesListing() {
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await getPublicCourse();
      if (!res?.length) return setData([]);
      setData(res);
    }
    getData();
  }, []);

  // Pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = data.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(data.length / coursesPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-16 py-12 bg-gray-50">
      <h1 className="text-3xl md:text-4xl text-center font-extrabold text-gray-900 mb-10">
        All Courses
      </h1>

      {/* Courses Grid */}
      {currentCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border border-gray-200 flex flex-col overflow-hidden hover:-translate-y-1 transform"
              >
                <div className="relative w-full h-52 rounded-t-2xl overflow-hidden">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-1 rounded-full">
                      {course.subject}
                    </span>
                    <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-2 py-1 rounded-full">
                      {course.class}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-4 flex-grow">
                    {course.short_description}
                  </p>

                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      {course.offer_price &&
                      course.offer_price.toString().trim() !== "" ? (
                        <>
                          <span className="font-bold text-myred-secondary">
                            ৳{course.offer_price}
                          </span>
                          <span className="text-sm text-gray-400 line-through">
                            ৳{course.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-myred-secondary">
                          ৳{course.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <Link
                    href={`${process.env.NEXT_PUBLIC_URL}/course/${course._id}`}
                    className="mt-auto"
                  >
                    <button className="w-full bg-gradient-to-r from-blue-500 to-teal-500 text-white py-3 rounded-full font-semibold hover:from-blue-600 hover:to-teal-600 shadow-md hover:shadow-lg transition-all duration-300">
                      Enroll Now
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-l-md border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50 transition-all"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-4 py-2 border-t border-b border-gray-200 ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-white text-gray-700 hover:bg-blue-50"
                  } transition-all`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  paginate(
                    currentPage < totalPages ? currentPage + 1 : totalPages
                  )
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-r-md border border-gray-200 bg-white text-gray-700 hover:bg-blue-50 disabled:opacity-50 transition-all"
              >
                Next
              </button>
            </nav>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No courses available at the moment.
          </p>
        </div>
      )}
    </section>
  );
}
