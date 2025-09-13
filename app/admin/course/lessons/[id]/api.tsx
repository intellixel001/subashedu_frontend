export const getLessons = async (courseId: string) => {
  const res = await fetch(`/api/courses/${courseId}`);
  const data = await res.json();
  return data.lessons || [];
};

export const addLesson = async (courseId: string, lesson: any) => {
  const res = await fetch(`/api/courses/${courseId}/lessons`, {
    method: "POST",
    body: JSON.stringify(lesson),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};

export const deleteLesson = async (courseId: string, index: number) => {
  const res = await fetch(`/api/courses/${courseId}/lessons/${index}`, {
    method: "DELETE",
  });
  return res.json();
};

export const updateLesson = async (
  courseId: string,
  index: number,
  lesson: any
) => {
  const res = await fetch(`/api/courses/${courseId}/lessons/${index}`, {
    method: "PUT",
    body: JSON.stringify(lesson),
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
};
