// app/admin/course/lessons/[id]/page.tsx
import LessonsClient from "./LessonsClient";

interface PageProps {
  params: {
    id: string;
  };
}

export default function Page({ params }: PageProps) {
  return <LessonsClient courseId={params.id} />;
}
