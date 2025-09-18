import { getPublicSingleCourse } from "@/app/globalapi/getapi";
import { getCurrentStudent } from "@/lib/getCurrentStudent";
import AlreadyPurchased from "./AlreadyPurchased";
import Purchase from "./Purchase";

interface EnrollmentPageProps {
  params: { id: string }; // plain object
}

export default async function EnrollmentPage({ params }: EnrollmentPageProps) {
  const courseId = params.id;
  const studentObject = await getCurrentStudent();

  const course = await getPublicSingleCourse(courseId);
  if (!course)
    return <p className="text-gray-400 mt-20 text-center">Course not found</p>;

  const alreadyPurchased = false; // adjust logic if needed

  return alreadyPurchased ? (
    <AlreadyPurchased course={course} />
  ) : (
    <div className="bg-white py-[150px]">
      <Purchase studentObject={studentObject?.data?.student} course={course} />
    </div>
  );
}
