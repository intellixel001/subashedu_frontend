import { deleteLesson } from "./api";

export default function LessonItem({ lesson, index, courseId, onDelete }) {
  const handleDelete = async () => {
    await deleteLesson(courseId, index);
    onDelete(index);
  };

  return (
    <div className="border p-4 mb-3 rounded-md shadow-sm flex justify-between items-center">
      <div>
        <h3 className="font-bold">{lesson.name}</h3>
        <p>{lesson.description}</p>
        <span className="badge badge-outline mt-1">{lesson.type}</span>
      </div>
      <button onClick={handleDelete} className="btn btn-error btn-sm">
        Delete
      </button>
    </div>
  );
}
