"use client";

import { Content } from "@/app/admin/components/CourseTable";
import { Loader2 } from "lucide-react"; // nice spinner
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBookOpen, FaExclamationTriangle } from "react-icons/fa";
import { getCourseContent } from "./apic";
import VideoTools from "./VideoTools";

interface Props {
  courseId: string;
}

export default function ContentPlayer({ courseId }: Props) {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonid");
  const contentId = searchParams.get("contentid");

  const [currentContent, setCurrentContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      if (!lessonId || !contentId) return;
      setLoading(true);
      setError(false);

      try {
        const data = await getCourseContent(courseId, lessonId, contentId);
        setCurrentContent(data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [courseId, lessonId, contentId]);

  // --- UI States ---
  if (!lessonId || !contentId) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-900 rounded-2xl text-gray-300">
        <FaBookOpen className="w-12 h-12 mb-3 text-blue-400" />
        <p className="text-lg font-medium">Select a lesson to start learning</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-900 rounded-2xl">
        <Loader2 className="animate-spin w-10 h-10 text-white mb-2" />
        <p className="text-gray-300">Loading content...</p>
      </div>
    );
  }

  if (error || !currentContent) {
    return (
      <div className="w-full aspect-video flex flex-col items-center justify-center bg-gray-900 rounded-2xl text-red-400">
        <FaExclamationTriangle className="w-12 h-12 mb-3" />
        <p className="text-lg font-medium">Couldn’t load content</p>
        <p className="text-sm text-gray-400">Please try again</p>
      </div>
    );
  }

  function getYouTubeID(url: string) {
    const regExp =
      /(?:youtube\.com\/(?:[^\/]+\/.+|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/i;
    const match = url.match(regExp);
    return match ? match[1] : "";
  }

  // ---- Render by type ----
  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden h-full shadow-md">
      {currentContent.type === "video" && (
        <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-md">
          {currentContent.link?.includes("youtube.com") ||
          currentContent.link?.includes("youtu.be") ? (
            // YouTube Embed
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${getYouTubeID(
                currentContent.link
              )}`}
              title={currentContent.name}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          ) : (
            // Direct video link
            <video controls className="w-full h-auto min-h-[450px]">
              <source src={currentContent.link} type="video/mp4" />
              Your browser does not support video playback.
            </video>
          )}
        </div>
      )}

      {currentContent.type === "pdf" && (
        <iframe
          src={currentContent.link}
          className="w-full h-auto"
          title={currentContent.name}
        />
      )}

      <VideoTools content={currentContent} />
    </div>
  );
}
