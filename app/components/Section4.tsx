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
    <section className="px-6 py-16 bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="container mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 uppercase">
            আসন্ন কোর্সসমূহ
          </h2>
          <p className="text-gray-600 mt-3 text-base sm:text-lg">
            {upcomingCourses.length > 0
              ? "নতুন প্রোগ্রামের মাধ্যমে আপনার দক্ষতা বৃদ্ধি করুন"
              : "এই মুহূর্তে কোন কোর্স উপলব্ধ নেই। পরে আবার দেখুন!"}
          </p>
        </div>

        {/* Courses Grid */}
        {upcomingCourses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {upcomingCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col"
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
