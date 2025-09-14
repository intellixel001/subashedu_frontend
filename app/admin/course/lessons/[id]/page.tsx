import LessonsClient from "./LessonsClient";

// This receives `params` directly because it's a server component
export default function Page({ params }: { params: { id: string } }) {
  return <LessonsClient courseId={params.id} />;
}
