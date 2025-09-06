"use client";

import { ErrorBoundary } from 'react-error-boundary';
import CoursePage from '../components/CoursePage';

// Define ErrorFallback as a standalone component
function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 bg-red-100 text-red-700 rounded-lg">
      <h2>Something went wrong:</h2>
      <p>{error.message}</p>
    </div>
  );
}

export default function CoursePageWrapper() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <CoursePage />
    </ErrorBoundary>
  );
}