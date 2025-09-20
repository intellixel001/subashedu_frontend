import { CourseType } from "@/_types/course";
import { Content } from "@/app/admin/components/CourseTable";
import { Lesson } from "./LessonItem";

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
  return json.data as CourseType;
};
// --- Add a new lesson ---
export const addLesson = async (
  courseId: string,
  lesson: Lesson
): Promise<Lesson> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(lesson),
      headers: { "Content-Type": "application/json" },
    }
  );
  const json = await res.json();
  return json.data as Lesson;
};

// --- Delete a lesson with confirmation ---
export const deleteLesson = async (
  courseId: string,
  lessonId: string
): Promise<{ success: boolean }> => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this lesson? All related content will also be removed."
  );

  if (!confirmed) {
    return { success: false };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons/${lessonId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  const json = await res.json();
  return json as { success: boolean };
};

// --- Add content to a lesson ---
export const addContent = async (
  courseId: string,
  lessonId: string,
  content: Content
): Promise<Content> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons/${lessonId}/contents`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(content),
      headers: { "Content-Type": "application/json" },
    }
  );
  const json = await res.json();
  return json;
};

// --- Update content ---
export const updateContent = async (
  courseId: string,
  lessonId: string,
  contentId: string,
  content: Content
): Promise<Content> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons/${lessonId}/contents/${contentId}`,
    {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(content),
      headers: { "Content-Type": "application/json" },
    }
  );
  const json = await res.json();
  return json.data as Content;
};

// --- Delete content with confirmation ---
export const deleteContent = async (
  courseId: string,
  lessonId: string,
  contentId: string
): Promise<{ success: boolean }> => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this content? This action cannot be undone."
  );

  if (!confirmed) {
    return { success: false };
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons/${lessonId}/contents/${contentId}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    }
  );

  const json = await res.json();
  return json as { success: boolean };
};

// --- Update a lesson ---
export const updateLesson = async (
  courseId: string,
  lessonId: string,
  data: Partial<Lesson>
): Promise<Lesson> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/courses/${courseId}/lessons/${lessonId}`,
    {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }
  );
  return res.json();
};
