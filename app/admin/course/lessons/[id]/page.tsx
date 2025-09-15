import LessonsClient from "./LessonsClient";

interface Params {
  id: string;
}

// Server Component
export default async function Page({ params }: { params: Params }) {
  // Now you can safely await if needed
  const courseId = params.id;

  return <LessonsClient courseId={courseId} />;
}
