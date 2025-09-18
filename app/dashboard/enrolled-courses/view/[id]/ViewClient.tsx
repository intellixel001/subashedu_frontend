"use client";

import { useState } from "react";
import LessonList from "./LessonList";
import VideoPlayer from "./VideoPlayer";
import VideoTools from "./VideoTools";

interface Content {
  id: string;
  name: string;
  type: string;
  link: string;
  description: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: string;
  status: "completed" | "running" | "locked";
  contents: Content[];
}

interface Props {
  courseId: string;
}

export default function ViewClient({ courseId }: Props) {
  // Demo data
  const demoLessons: Lesson[] = [
    {
      id: "1",
      title: "Introduction",
      duration: "5:12",
      status: "completed",
      contents: [
        {
          id: "c1",
          name: "Intro Video",
          type: "Video",
          link: "https://www.w3schools.com/html/mov_bbb.mp4",
          description: "Welcome to the course, overview of topics.",
        },
        {
          id: "c2",
          name: "Slides",
          type: "PDF",
          link: "#",
          description: "Lecture slides for the introduction.",
        },
      ],
    },
    {
      id: "2",
      title: "Setup & Installation",
      duration: "12:30",
      status: "running",
      contents: [
        {
          id: "c3",
          name: "Setup Video",
          type: "Video",
          link: "https://www.w3schools.com/html/mov_bbb.mp4",
          description: "Step by step installation guide.",
        },
        {
          id: "c4",
          name: "Checklist",
          type: "PDF",
          link: "#",
          description: "Things to prepare before starting.",
        },
      ],
    },
    {
      id: "3",
      title: "First Project",
      duration: "18:45",
      status: "locked",
      contents: [],
    },
  ];

  // State to track currently playing content
  const [currentContent, setCurrentContent] = useState<Content>(
    demoLessons[1].contents[0]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen p-4">
      {/* Left side - Video + Tools */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <VideoPlayer videoUrl={currentContent.link} />
        <VideoTools content={currentContent} />
      </div>

      {/* Right side - Lessons */}
      <div className="lg:col-span-1 overflow-y-auto">
        <LessonList
          courseId={courseId}
          lessons={demoLessons}
          setCurrentContent={setCurrentContent}
        />
      </div>
    </div>
  );
}
