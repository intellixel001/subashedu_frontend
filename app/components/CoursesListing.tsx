"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export function CoursesListing() {
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;
  const [data, setData] = useState([]);

  useEffect(() => {
    async function getData() {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-all-course`);
      if (!res.ok) {
        throw new Error("Failed to fetch courses");
      }
      const result = await res.json();
      setData(result.data);
    }
    getData();
  }, []);

  // Get current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = data.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(data.length / coursesPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section className="mx-auto px-2 md:px-4 lg:px-16 py-4 bg-transparent">
      <h1 className="text-3xl md:text-4xl text-center uppercase text-myred-secondary font-bold mb-8">
        All Courses
      </h1>

      {/* Courses grid */}
      {currentCourses.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {currentCourses.map((course) => (
              <div
                key={course.id}
                className="bg-gray-800/70 backdrop-blur-md rounded-lg shadow-md hover:shadow-myred/50 transition-shadow duration-300 flex flex-col border border-myred/30"
              >
                <div className="relative w-full h-48">
                  <Image
                    src={course.thumbnailUrl}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="bg-myred/20 text-myred text-xs px-2 py-1 rounded">
                      {course.subject}
                    </span>
                    <span className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded">
                      {course.class}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-100 mb-2 line-clamp-2 min-h-[3rem]">
                    {course.title}
                  </h3>
                  <p className="text-gray-300 mb-4 line-clamp-5 flex-grow">
                    {course.short_description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">{course.duration}</span>
                    <div className="flex items-center gap-2">
                      {course.offer_price && course.offer_price.toString().trim() !== "" ? (
                        <>
                          <span className="font-bold text-myred-secondary">৳{course.offer_price}</span>
                          <span className="text-sm text-gray-400 line-through">
                            ৳{course.price}
                          </span>
                        </>
                      ) : (
                        <span className="font-bold text-myred-secondary">৳{course.price}</span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`${process.env.NEXT_PUBLIC_URL}/course/${course.id}`}
                    className="block mt-auto"
                  >
                    <button className="w-full bg-gradient-to-r from-myred to-myred-secondary text-gray-100 py-2 rounded-md hover:bg-myred-dark transition-colors duration-200 relative overflow-hidden group">
                      <span className="relative z-10">Enroll Now</span>
                      <span className="absolute inset-0 bg-myred-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8">
            <nav className="inline-flex rounded-md shadow">
              <button
                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-l-md border border-myred/30 bg-gray-800 text-gray-300 hover:bg-myred/20 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => paginate(index + 1)}
                  className={`px-3 py-1 border-t border-b border-myred/30 ${
                    currentPage === index + 1
                      ? "bg-myred text-gray-100"
                      : "bg-gray-800 text-gray-300 hover:bg-myred/20"
                  }`}
                  disabled={currentPage === index + 1}
                >
                  {index + 1}
                </button>
              ))}
              <button
                onClick={() =>
                  paginate(currentPage < totalPages ? currentPage + 1 : totalPages)
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-r-md border border-myred/30 bg-gray-800 text-gray-300 hover:bg-myred/20 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-300 text-lg">
            No courses available at the moment.
          </p>
        </div>
      )}
    </section>
  );
}