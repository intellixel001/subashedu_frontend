import { getMyEnrolledCourseById } from "./api";
import ViewClient from "./ViewClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const courseData = await getMyEnrolledCourseById(id);

  if (!id) {
    return (
      <div className="p-6 bg-yellow-900 text-center">
        <h2 className="text-xl font-bold text-red-600">Course ID not found</h2>
        <p className="text-gray-500">
          Cannot load course because the course ID is missing.
        </p>
      </div>
    );
  }

  console.log(courseData);

  return (
    <div className="bg-yellow-900">
      <div className="container mx-auto">
        {courseData && id && (
          <ViewClient courseData={courseData} courseId={id} />
        )}
      </div>
    </div>
  );
}
