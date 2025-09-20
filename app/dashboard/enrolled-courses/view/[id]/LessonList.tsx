"use client";

import { Content, Lesson } from "@/app/admin/components/CourseTable";
import LessonCard from "./LessonCard";

interface Props {
  courseId: string;
  lessons: Lesson[];
  setCurrentContent: (content: Content) => void;
}

export default function LessonList({
  courseId,
  lessons,
  setCurrentContent,
}: Props) {
  console.log(courseId);

  return (
    <div className="flex flex-col gap-3">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.name}
          {...lesson}
          contents={lesson.contents || []}
          setCurrentContent={setCurrentContent}
        />
      ))}
    </div>
  );
}
