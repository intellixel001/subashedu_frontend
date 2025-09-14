// app/admin/course/lessons/[id]/api.tsx
export interface Content {
  _id?: string;
  name: string;
  type: "video" | "pdf" | "quiz" | "note" | "link";
  link: string;
  description: string;
  requiredForNext?: boolean;
}

export interface Lesson {
  _id?: string;
  name: string;
  description: string;
  type: string;
  requiredForNext?: boolean;
  contents?: Content[];
}

// --- Fetch all lessons for a course ---
export const getLessons = async (
  courseId: string
): Promise<{ success: boolean; data: Lesson[] }> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}`,
    {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  const data = await res.json();
  return data.data || [];
};

// --- Add a new lesson ---
export const addLesson = async (courseId: string, lesson: Lesson) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(lesson),
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.json();
};

// --- Delete a lesson ---
export const deleteLesson = async (courseId: string, lessonId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons/${lessonId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.json();
};

// --- Update a lesson ---
export const updateLesson = async (
  courseId: string,
  lessonId: string,
  lesson: Lesson
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons/${lessonId}`,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(lesson),
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.json();
};

// --- Add content to a lesson ---
export const addContent = async (
  courseId: string,
  lessonId: string,
  content: Content
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons/${lessonId}/contents`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(content),
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.json();
};

// --- Update content ---
export const updateContent = async (
  courseId: string,
  lessonId: string,
  contentId: string,
  content: Content
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons/${lessonId}/contents/${contentId}`,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(content),
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.json();
};

// --- Delete content ---
export const deleteContent = async (
  courseId: string,
  lessonId: string,
  contentId: string
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons/${lessonId}/contents/${contentId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.json();
};
