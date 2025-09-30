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
  instructorId?: string;
  classFor?: "hsc" | "ssc" | "job" | "admission";
  courseId?: string;
  courseType?: "hsc" | "ssc" | "job" | "admission";
  billingType?: "free" | "paid";
  createdAt?: string;
  updatedAt?: string;
  type: "live" | "recorded";
  startTime?: string;
  image?: string;
  isActiveLive?: boolean;
  __v?: number;
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
            newCountdowns[fc._id] = "LIVE";
          }
        }
      });

      setCountdowns(newCountdowns);
    }, 1000);

    return () => clearInterval(interval);
  }, [freeClasses]);

  const renderBadge = (freeClass: FreeClass) => {
    if (freeClass.type?.toLowerCase() === "live" && freeClass.startTime) {
      const now = new Date().getTime();
      const start = new Date(freeClass.startTime).getTime();

      if (start > now) {
        // future → countdown
        return (
          <span className="absolute top-3 right-3 bg-yellow-500 text-white text-[25px] px-10 py-3 rounded-full animate-pulse">
            Starts in {countdowns[freeClass._id] || "Loading..."}
          </span>
        );
      } else {
        // already started → live now
        return (
          <span className="absolute top-3 right-3 bg-red-600 text-white text-[25px] px-10 py-3 rounded-full animate-pulse">
            Live Now
          </span>
        );
      }
    }

    // anything not live → normal watch
    return (
      <span className="absolute top-3 right-3 bg-gray-600 text-white text-[25px] px-10 py-3 rounded-full">
        Watch Now
      </span>
    );
  };

  const renderSkeletons = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="bg-gray-800 border border-gray-700 rounded-2xl shadow-md overflow-hidden animate-pulse"
        >
          <div className="aspect-video bg-gray-700"></div>
          <div className="p-5 space-y-3">
            <div className="h-4 bg-gray-600 rounded w-3/4"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            <div className="flex gap-3">
              <div className="h-8 bg-gray-700 rounded w-20"></div>
              <div className="h-8 bg-gray-700 rounded w-20"></div>
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
          <h3 className="text-xl font-semibold text-gray-100 mb-2">
            No Free Classes Available
          </h3>
          <p className="text-gray-400">
            We&apos;re preparing new free classes for you. Please check back
            soon!
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
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {freeClasses.map((freeClass) => (
          <div
            key={freeClass._id}
            className="bg-gray-800 border border-myred/30 rounded-2xl shadow-md hover:scale-[1.02] hover:shadow-myred/50 transition-all duration-300 ease-in-out overflow-hidden relative"
          >
            <div className="aspect-video relative">
              <img
                src={freeClass.image || "/default-thumb.jpg"}
                alt={freeClass.title}
                className="w-full h-full object-cover"
              />
              {renderBadge(freeClass)}
            </div>
            <div className="p-5">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                {freeClass.title}
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                {freeClass.subject}{" "}
                {freeClass.instructor ? `by ${freeClass.instructor}` : ""}
              </p>
              <div className="flex gap-3 flex-wrap">
                <Link
                  href={`/class/${freeClass._id}`}
                  className="inline-flex items-center bg-myred-dark text-white px-4 py-2 rounded-full hover:bg-myred hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-all text-sm"
                >
                  <FaPlayCircle className="mr-2" /> Let&apos;s Go
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <section className="watchFreeClasses px-4 sm:px-6 py-8 sm:py-12">
      <div className="text-center mb-10 max-w-7xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-myred-secondary uppercase mb-4">
          Watch Our Free Classes
        </h2>
        <p className="text-gray-400 text-sm pb-2 sm:text-base">
          Explore valuable topics and learn at your own pace with these free
          sessions. Click the buttons below to access full content.
        </p>
        {loading ? renderSkeletons() : renderCards()}
      </div>
    </section>
  );
}
