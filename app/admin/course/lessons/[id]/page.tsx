import LessonsClient from "./LessonsClient";

// Next.js App Router pages can be async server components
export default async function Page({ params }: { params: { id: string } }) {
  // Fetch course data here if needed
  // Or just pass the courseId to the client component
  return <LessonsClient courseId={params.id} />;
}
