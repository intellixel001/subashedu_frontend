import { CourseType } from "@/_types/course";
import { cookies } from "next/headers";

export const getMyEnrolledCourseById = async (
  courseId: string
): Promise<CourseType | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/get-enrolled-course/${courseId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store", // optional: prevents stale caching
    }
  );

  if (!res.ok) {
    const error = await res.json();
    console.error(error);
    return null;
  }

  const json = await res.json();
  return json.data;
};
