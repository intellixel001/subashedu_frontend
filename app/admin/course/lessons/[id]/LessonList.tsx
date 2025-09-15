"use client";

import LessonItem, { Lesson } from "./LessonItem";

interface LessonListProps {
  lessons: Lesson[];
  courseId: string;
  setLessons: React.Dispatch<React.SetStateAction<Lesson[]>>;
  fetchLessons?: () => void;
  onEditLesson?: (lesson: Lesson, index: number) => void; // optional edit handler
}

export default function LessonList({
  lessons,
  courseId,
  setLessons,
  fetchLessons,
  onEditLesson,
}: LessonListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Lessons</h2>
      {lessons.length === 0 ? (
        <p className="text-gray-500">No lessons available.</p>
      ) : (
        lessons.map((lesson, index) => (
          <LessonItem
            key={lesson._id || index}
            index={index}
            lesson={lesson}
            courseId={courseId}
            fetchLessons={fetchLessons}
            onEdit={() => onEditLesson?.(lesson, index)} // ✅ properly passed
            onUpdateLesson={(updatedLesson, idx) => {
              setLessons((prevLessons) => {
                const newLessons = [...prevLessons];
                newLessons[idx] = updatedLesson;
                return newLessons;
              });
            }}
          />
        ))
      )}
    </div>
  );
}
