import { getPublicCourseByType } from "@/app/globalapi/getapi";
import CourseListClient from "./CourseListClient";

export default async function Page({
  params,
}: {
  params: Promise<{ coursetype: string }>;
}) {
  const { coursetype } = await params;

  const data = await getPublicCourseByType(coursetype);
  const courses = Array.isArray(data) ? data : [data].filter(Boolean);

  return (
    <div className="bg-white">
      <main className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 capitalize text-black flex items-center gap-2">
          {decodeURIComponent(coursetype)} Courses
        </h1>
        <CourseListClient courses={courses} />
      </main>
    </div>
  );
}
