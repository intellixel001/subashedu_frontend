// NO "use client" here
import LessonsClient from "./LessonsClient";

export default function page({ params }: { params: { id: string } }) {
  return <LessonsClient courseId={params.id} />;
}
