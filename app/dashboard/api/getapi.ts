import { CourseType } from "@/_types/course";

export const getLessons = async (courseId: string): Promise<CourseType> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  const json = await res.json();
  return json.data;
};
