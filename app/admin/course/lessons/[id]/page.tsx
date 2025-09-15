import LessonsClient from "./LessonsClient";

// Server Component
export default function Page({ params }: any) {
  const courseId = params?.id;

  if (!courseId) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold text-red-600">Course ID not found</h2>
        <p className="text-gray-500">
          Cannot load lessons because the course ID is missing.
        </p>
      </div>
    );
  }

  return <LessonsClient courseId={courseId} />;
}
