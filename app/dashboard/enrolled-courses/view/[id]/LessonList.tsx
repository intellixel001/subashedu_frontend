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
  return (
    <div className="flex flex-col gap-3">
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson._id}
          id={lesson._id}
          name={lesson.name}
          contents={lesson.contents || []}
          setCurrentContent={setCurrentContent}
        />
      ))}
    </div>
  );
}
