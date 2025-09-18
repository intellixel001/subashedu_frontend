"use client";

import LessonCard from "./LessonCard";

interface Props {
  courseId: string;
}

export default function LessonList({ courseId }: Props) {
  console.log(courseId);
  const lessons = [
    {
      id: "1",
      title: "Introduction",
      duration: "5:12",
      status: "completed" as const,
      contents: [
        {
          id: "c1",
          name: "Intro Video",
          type: "video",
          link: "#",
          description: "Welcome video",
        },
        {
          id: "c2",
          name: "Slides",
          type: "pdf",
          link: "#",
          description: "Lecture slides",
        },
      ],
    },
    {
      id: "2",
      title: "Setup & Installation",
      duration: "12:30",
      status: "running" as const,
      contents: [
        {
          id: "c3",
          name: "Setup Guide",
          type: "video",
          link: "#",
          description: "Step by step",
        },
      ],
    },
    {
      id: "3",
      title: "First Project",
      duration: "18:45",
      status: "locked" as const,
      contents: [],
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      {lessons.map((lesson) => (
        <LessonCard key={lesson.id} {...lesson} />
      ))}
    </div>
  );
}
