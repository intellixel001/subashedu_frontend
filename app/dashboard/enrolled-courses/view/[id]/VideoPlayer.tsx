"use client";

import { Content } from "@/app/admin/components/CourseTable";

interface Props {
  currentContent: Content;
}

export default function VideoPlayer({ currentContent }: Props) {
  return (
    <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-md">
      {/* <video controls className="w-full h-full">
        <source src={currentContent} type="video/mp4" />
        Your browser does not support video playback.
      </video> */}
    </div>
  );
}
