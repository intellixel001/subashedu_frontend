
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlayCircle, FaVideoSlash } from "react-icons/fa";

interface FreeClass {
  _id: string;
  title: string;
  subject: string;
  videoLink: string;
  instructor: string;
  classFor: "hsc" | "ssc" | "job" | "admission";
  createdAt: string;
}

const getYouTubeVideoId = (url: string): string => {
  try {
    const urlObj = new URL(url);
    if (urlObj.searchParams.has("v")) {
      return urlObj.searchParams.get("v") || "";
    }
    const pathSegments = urlObj.pathname.split("/");
    const videoId = pathSegments[pathSegments.length - 1];
    return videoId || "";
  } catch {
    return "";
  }
};

export default function Section7() {
  const [freeClasses, setFreeClasses] = useState<FreeClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreeClasses = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        const response = await fetch(`${serverUrl}/api/free-classes`);
        
        if (!response.ok) {
          setFreeClasses([]);
          setLoading(false);
          return;
        }
        
        const data = await response.json();
        setFreeClasses(data.data || []);
      } catch {
        setFreeClasses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFreeClasses();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center">
          <p className="text-gray-400">Loading free classes...</p>
        </div>
      );
    }

    if (freeClasses.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <FaVideoSlash className="mx-auto text-5xl text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-100 mb-2">
              No Free Classes Available
            </h3>
            <p className="text-gray-400">
              {`We're currently preparing new free classes for you. Please check back soon!`}
            </p>
            <div className="mt-6">
              <Link
                href="/courses"
                className="inline-block bg-myred-dark text-white px-6 py-2 rounded-full hover:bg-myred hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-all text-sm"
              >
                Browse Our Courses
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {freeClasses.map((freeClass) => {
          const videoId = getYouTubeVideoId(freeClass.videoLink);
          return (
            <div
              key={freeClass._id}
              className="bg-gray-800 border border-myred/50 rounded-2xl shadow-md hover:scale-[1.02] hover:shadow-myred/50 transition-all duration-300 ease-in-out overflow-hidden relative group"
            >
              <div className="aspect-video relative">
                {videoId ? (
                  <>
                    <iframe
                      className="w-full h-full pointer-events-none"
                      src={`https://www.youtube.com/embed/${videoId}?controls=0&modestbranding=1`}
                      title={freeClass.title}
                      frameBorder="0"
                      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                    <div className="absolute inset-0 bg-transparent bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 cursor-pointer z-10"
                         onClick={(e) => e.preventDefault()}>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-myred-dark flex items-center justify-center">
                    <p className="text-gray-400">Invalid YouTube URL</p>
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  {freeClass.title}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">
                  {freeClass.subject} by {freeClass.instructor}
                </p>
                <div className="flex gap-3 flex-wrap">
                  <Link
                    href={`/dashboard/free-classes/${freeClass._id}`}
                    className="inline-flex items-center bg-myred-dark text-white px-4 py-2 rounded-full hover:bg-myred hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-all text-sm"
                  >
                    <FaPlayCircle className="mr-2" /> Watch Now
                  </Link>
                  <a
                    href={freeClass.videoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center bg-gray-600 text-white px-4 py-2 rounded-full hover:bg-myred hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-all text-sm"
                  >
                    <FaPlayCircle className="mr-2" /> Watch on YouTube
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="watchFreeClasses px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-10 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-myred-secondary uppercase mb-4">
          Watch Our Free Classes
        </h2>
        <p className="text-gray-400 text-sm sm:text-base">
          Explore valuable topics and learn at your own pace with these free
          recorded sessions. Click the buttons below to access full content.
        </p>
      </div>

      {renderContent()}
    </section>
  );
}
