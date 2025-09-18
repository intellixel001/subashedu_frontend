import { getPublicSingleCourse } from "@/app/globalapi/getapi";
import { getCurrentStudent } from "@/lib/getCurrentStudent";
import AlreadyPurchased from "./AlreadyPurchased";
import Purchase from "./Purchase";

export default async function EnrollmentPage({
  params,
}: {
  params: { id: string }; // <- just object, no Promise
}) {
  const courseId = params.id; // this will correctly be '123' for /myroute/123/enrollment
  const studentObject = await getCurrentStudent();

  // Fetch course
  const course = await getPublicSingleCourse(courseId);
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
