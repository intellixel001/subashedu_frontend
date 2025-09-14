// Do NOT use "use client" here
import LessonsClient from "./LessonsClient";

// This is a server component, so it can receive params
export default function Page({ params }: { params: { id: string } }) {
  return <LessonsClient courseId={params.id} />;
}
