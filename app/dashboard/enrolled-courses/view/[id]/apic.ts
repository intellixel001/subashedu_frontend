// api/course.ts
export const getCourseContent = async (
  courseId: string,
  lessonId: string,
  contentId: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/get-course-content?courseId=${courseId}&lessonId=${lessonId}&contentId=${contentId}`,
      {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Failed to fetch content");
    return json.data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
