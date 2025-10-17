"use client";

import { Content, Lesson } from "@/app/admin/components/CourseTable";
import { Class } from "@/app/admin/manage-class/page";
import { MaterialType } from "@/app/components/PDFViewer";
import LessonCard from "./LessonCard";

interface Props {
  courseId: string;
  lessons: Lesson[];
  materials?: MaterialType[];
  classes?: Class[];
  setCurrentContent: (content: Content) => void;
}

export default function LessonList({
  courseId,
  lessons,
  materials = [],
  classes = [],
  setCurrentContent,
}: Props) {
  return (
    console.log(courseId)
    <div className="flex flex-col gap-4">
      {/* Lessons Section */}
      {lessons.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 uppercase mb-1">Lessons</p>
          <div className="flex flex-col gap-3">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson._id}
                id={lesson._id}
                name={lesson.name}
                contents={lesson.contents || []}
                setCurrentContent={setCurrentContent}
              />
            ))}
          </div>
        </div>
      )}

      {/* Materials Section */}
      {materials.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 uppercase mb-1">Materials</p>
          <div className="flex flex-col gap-2">
            {materials.map((material) => (
              <div
                key={material._id}
                className="p-2 rounded cursor-pointer text-white bg-gradient-to-r from-blue-900 via-pink-500 to-red-500 hover:opacity-90 transition-opacity duration-200"
                // onClick={() =>
                //   material.link &&
                //   setCurrentContent({
                //     name: material.title,
                //     link: material.link,
                //   })
                // }
              >
                {material.title}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Classes Section */}
      {classes.length > 0 && (
        <div>
          <p className="text-sm text-gray-400 uppercase mb-1">Classes</p>
          <div className="flex flex-col gap-2">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="p-2 border border-gray-700 rounded cursor-pointer hover:bg-gray-800"
              >
                {cls.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
