"use client";

import { CourseType } from "@/_types/course";
import { Content, Lesson } from "@/app/admin/components/CourseTable";
import { useState } from "react";
import ContentPlayer from "./ContentPlayer";
import LessonList from "./LessonList";

interface Props {
  courseId: string;
  courseData: CourseType;
}

export default function ViewClient({ courseId, courseData }: Props) {
  // Demo data
  const demoLessons: Lesson[] = courseData?.enrollcourse?.map((s_enc) => {
    return {
      ...s_enc,
      contents: s_enc?.contents || [],
      status: s_enc?.status || "locked",
    };
  });

  //   const demoLessons: Lesson[] = [
  //   {
  //     name: "Introduction",
  //     status: "completed",
  //     contents: [
  //       {
  //         name: "Intro Video",
  //         type: "Video",
  //         link: "https://www.w3schools.com/html/mov_bbb.mp4",
  //         description: "Welcome to the course, overview of topics.",
  //       },
  //       {
  //         name: "Slides",
  //         type: "PDF",
  //         link: "#",
  //         description: "Lecture slides for the introduction.",
  //       },
  //     ],
  //   },
  //   {
  //     name: "Setup & Installation",
  //     status: "running",
  //     contents: [
  //       {
  //         name: "Setup Video",
  //         type: "Video",
  //         link: "https://www.w3schools.com/html/mov_bbb.mp4",
  //         description: "Step by step installation guide.",
  //       },
  //       {
  //         name: "Checklist",
  //         type: "PDF",
  //         link: "#",
  //         description: "Things to prepare before starting.",
  //       },
  //     ],
  //   },
  //   {
  //     name: "First Project",
  //     status: "locked",
  //     contents: [],
  //   },
  // ];

  // State to track currently playing content
  const [currentContent, setCurrentContent] = useState<Content>({
    name: "",
    link: "",
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen p-4">
      {/* Left side - Video + Tools */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <ContentPlayer courseId={courseId} />
        {/* <VideoTools content={currentContent} /> */}
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
