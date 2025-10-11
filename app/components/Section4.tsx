import { CourseType } from "@/_types/course";
import CourseSlider from "./CourseSlider"; // client component

async function getData(): Promise<CourseType[]> {
  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/get-all-course`, {
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404 || res.status === 400) return [];
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
    <section className="px-6 py-16 bg-transparent">
      <div className="container mx-auto">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 uppercase">
            চলমান কোর্সসমূহ
          </h2>
          <p className="text-gray-600 mt-3 text-base sm:text-lg">
            {upcomingCourses.length > 0
              ? "নতুন কোর্স গুলোতে যুক্ত হয়ে নিজেকে এগিয়ে রাখুন"
              : "এই মুহূর্তে কোন কোর্স উপলব্ধ নেই। পরে আবার দেখুন!"}
          </p>
        </div>

        {upcomingCourses.length > 0 && (
          <CourseSlider courses={upcomingCourses} />
        )}
      </div>
    </section>
  );
}
