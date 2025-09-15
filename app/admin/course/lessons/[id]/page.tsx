import LessonsClient from "./LessonsClient";

interface Params {
  id: string;
}

export default async function Page({
  params,
}: {
  params: Params | Promise<Params>;
}) {
  // Await if Next.js gives params as a promise
  const resolvedParams = params instanceof Promise ? await params : params;
  const courseId = resolvedParams.id;

  if (!courseId) {
    // Render a friendly message if courseId is missing
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
