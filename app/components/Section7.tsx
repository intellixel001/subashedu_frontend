"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaPlayCircle, FaVideoSlash } from "react-icons/fa";

export interface FreeClass {
  _id: string;
  title: string;
  subject: string;
  videoLink?: string;
  instructor?: string;
  startTime?: string;
  type: "live" | "recorded";
  image?: string;
}

export default function Section7() {
  const [freeClasses, setFreeClasses] = useState<FreeClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState<Record<string, string>>({});

  // fetch data
  useEffect(() => {
    const fetchFreeClasses = async () => {
      try {
        const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
        const response = await fetch(`${serverUrl}/api/free-class`);
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

  // countdown updater
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdowns: Record<string, string> = {};
      freeClasses.forEach((fc) => {
        if (fc.type === "live" && fc.startTime) {
          const now = new Date().getTime();
          const start = new Date(fc.startTime).getTime();
          const diff = start - now;

          if (diff > 0) {
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            newCountdowns[fc._id] = `${hours
              .toString()
              .padStart(2, "0")}:${minutes
              .toString()
              .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          } else {
            newCountdowns[fc._id] = "লাইভ চলছে";
          }
        }
      });
      setCountdowns(newCountdowns);
    }, 1000);
    return () => clearInterval(interval);
  }, [freeClasses]);

  const renderBadge = (freeClass: FreeClass) => {
    if (freeClass.type === "live" && freeClass.startTime) {
      const now = new Date().getTime();
      const start = new Date(freeClass.startTime).getTime();
      if (start > now) {
        return (
          <span className="absolute top-3 right-3 bg-yellow-400 text-gray-900 font-bold text-xs sm:text-sm px-3 py-1 rounded-full animate-pulse shadow-md">
            শুরু হবে {countdowns[freeClass._id] || "লোড হচ্ছে..."}
          </span>
        );
      } else {
        return (
          <span className="absolute top-3 right-3 bg-red-500 text-white font-bold text-xs sm:text-sm px-3 py-1 rounded-full animate-pulse shadow-md">
            লাইভ চলছে
          </span>
        );
      }
    }
    return (
      <span className="absolute top-3 right-3 bg-gray-300 text-gray-800 font-medium text-xs sm:text-sm px-3 py-1 rounded-full shadow-sm">
        দেখুন
      </span>
    );
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-200 rounded-2xl shadow animate-pulse overflow-hidden"
        >
          <div className="aspect-video bg-gray-300"></div>
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            <div className="flex gap-3 flex-wrap">
              <div className="h-8 bg-gray-300 rounded w-20"></div>
              <div className="h-8 bg-gray-300 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCards = () => {
    if (freeClasses.length === 0) {
      return (
        <div className="text-center py-12">
          <FaVideoSlash className="mx-auto text-5xl text-gray-400 mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
            কোনো ফ্রি ক্লাস উপলব্ধ নেই
          </h3>
          <p className="text-gray-600 text-sm sm:text-base">
            আমরা নতুন ফ্রি ক্লাস তৈরি করছি। অনুগ্রহ করে পরে আবার দেখুন।
          </p>
          <div className="mt-6">
            <Link
              href="/courses"
              className="inline-block bg-gradient-to-r from-blue-500 to-teal-500 text-white px-6 py-2 rounded-full hover:shadow-lg transition-all duration-300"
            >
              আমাদের কোর্স দেখুন
            </Link>
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {freeClasses.map((fc) => (
          <div
            key={fc._id}
            className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 relative overflow-hidden"
          >
            <div className="aspect-video relative rounded-t-2xl overflow-hidden">
              <img
                src={fc.image || "/default-thumb.jpg"}
                alt={fc.title}
                className="w-full h-full object-cover"
              />
              {renderBadge(fc)}
            </div>
            <div className="p-5 flex flex-col justify-between h-[180px]">
              <div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">
                  {fc.title}
                </h3>
                <p className="text-gray-600 mb-2 text-sm sm:text-base">
                  {fc.subject} {fc.instructor ? `দ্বারা ${fc.instructor}` : ""}
                </p>
              </div>
              <Link
                href={`/class/${fc._id}`}
                className="inline-flex items-center justify-center brand-button px-4 py-2 rounded-full transition-all duration-300 text-sm sm:text-base font-medium"
              >
                <FaPlayCircle className="mr-2" /> চলুন শুরু করি
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="px-4 sm:px-6 py-24 bg-transparent">
      <div className="container mx-auto">
        <div className="text-center max-w-7xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 uppercase">
            আমাদের ফ্রি ক্লাসসমূহ
          </h2>
          <p className="text-gray-600 mt-3 text-base sm:text-lg">
            বিভিন্ন বিষয় শিখুন এবং নিজের গতিতে উন্নতি করুন। নিচের বোতামগুলো
            ক্লিক করুন।
          </p>
        </div>
        {loading ? renderSkeletons() : renderCards()}
      </div>
    </section>
  );
}
