import { getPublicSingleCourse } from "@/app/globalapi/getapi";
import { getCurrentStudent } from "@/lib/getCurrentStudent";
import AlreadyPurchased from "./AlreadyPurchased";
import Purchase from "./Purchase";

export default async function EnrollmentPage({
  params,
}: {
  params: { id: string };
}) {
  const courseId = params.id;
  const studentObject = await getCurrentStudent();

  // Fetch course
  const course = await getPublicSingleCourse(courseId); // <- fix typo
  if (!course)
    return <p className="text-gray-400 mt-20 text-center">Course not found</p>;

  // Check if user already purchased
  const alreadyPurchased = course === "purchased"; // adjust this logic if needed
  return alreadyPurchased ? (
    <AlreadyPurchased course={course} />
  ) : (
    <div className="bg-white py-[150px]">
      <Purchase studentObject={studentObject?.data?.student} course={course} />
    </div>
  );
}
