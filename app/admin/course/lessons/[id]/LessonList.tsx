import LessonItem from "./LessonItem";

export default function LessonList({ lessons, courseId, setLessons }) {
  const handleDelete = (index: number) => {
    setLessons((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-2">Lessons</h2>
      {lessons.map((lesson, index) => (
        <LessonItem
          key={index}
          index={index}
          lesson={lesson}
          courseId={courseId}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}
