// Define params type manually
interface PageProps {
  params: {
    id: string; // your route param
  };
}

// Server Component
export default function Page({ params }: PageProps) {
  return <LessonsClient courseId={params.id} />;
}
