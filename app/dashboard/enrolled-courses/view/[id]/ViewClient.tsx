"use client";

import { CourseType } from "@/_types/course";
import { Content, Lesson } from "@/app/admin/components/CourseTable";
import { useState } from "react";
import ContentPlayer from "./ContentPlayer";
import LessonList from "./LessonList";

interface Props {
  courseId: string;
  img: string;
  courseData: CourseType;
}

export default function ViewClient({ courseId, courseData, img }: Props) {
  // Prepare lessons
  const demoLessons: Lesson[] = courseData?.enrollcourse?.map((s_enc) => ({
    ...s_enc,
    contents: s_enc?.contents || [],
    status: s_enc?.status || "locked",
  }));

  // Prepare materials
  const [materials] = useState(courseData?.materials || []);

  // Prepare classes
  const [classes] = useState(courseData?.classes || []);

  // State to track currently playing content
  const [currentContent, setCurrentContent] = useState<Content>({
    name: "",
    link: "",
  });

  console.log(currentContent);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-screen p-4">
      {/* Left side - Video + Tools */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <ContentPlayer img={img} courseId={courseId} />
      </div>

      {/* Right side - Lessons */}
      <div className="lg:col-span-1 overflow-y-auto">
        <LessonList
          courseId={courseId}
          lessons={demoLessons}
          materials={materials} // Pass materials
          classes={classes} // Pass classes
          setCurrentContent={setCurrentContent}
        />
      </div>
    </div>
  );
}
