
import Image from "next/image";
import Link from "next/link";

async function getData() {
  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/get-all-course`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 400) {
        return [];
      }
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data || [];
  } catch (err) {
    console.error("Failed to fetch courses:", err.message);
    return [];
  }
}

export default async function Section4() {
  const upcomingCourses = await getData();

  return (
    <section className="upcomingCourse px-6 py-6">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-myred-secondary uppercase">
          Upcoming Courses
        </h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          {upcomingCourses.length > 0
            ? "Boost your skills with our newest programs"
            : "No courses available at this time. Check back soon!"}
        </p>
      </div>

      {upcomingCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {upcomingCourses.map((course) => (
            <div
              key={course.id}
              className="bg-gray-800 border border-myred/50 rounded-2xl shadow-lg hover:scale-105 hover:shadow-myred/50 transition-all duration-300 ease-in-out flex flex-col"
            >
              <div className="relative w-full h-[180px] min-h-[180px] max-h-[180px] rounded-t-2xl overflow-hidden">
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-semibold text-gray-100 mb-2 line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm line-clamp-5 h-[100px]">
                  {course.short_description}
                </p>
                <div className="mt-auto">
                  <Link href={`/course/${course.id}`}>
                    <button className="bg-myred-dark text-white px-6 py-2 rounded-full hover:bg-myred-secondary bg-myred hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-all text-sm w-full">
                      Enroll Now
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
}
