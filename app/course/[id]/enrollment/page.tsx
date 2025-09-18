import { getPublicSingleCourse } from "@/app/globalapi/getapi";
import { getCurrentStudent } from "@/lib/getCurrentStudent";
import AlreadyPurchased from "./AlreadyPurchased";
import Purchase from "./Purchase";

interface EnrollmentPageProps {
  params: { id: string };
  userId: string;
}

export default async function EnrollmentPage({
  params,
  userId,
}: EnrollmentPageProps) {
  const courseId = params.id;
  const studentObject = await getCurrentStudent();

  // Fetch course
  const course = await getPublicSingleCourse(courseId);
  console.log(course);
  if (!course)
    return <p className="text-gray-400 mt-20 text-center">Course not found</p>;

  // Check if user already purchased
  const alreadyPurchased = course === "purchased";
  return alreadyPurchased ? (
    <AlreadyPurchased course={course} />
  ) : (
    <div className="bg-white py-[150px]">
      <Purchase studentObject={studentObject?.data?.student} course={course} />
    </div>
  );
}
