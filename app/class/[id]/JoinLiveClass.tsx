"use client";

import { Class } from "@/app/admin/manage-class/page";
import { useEffect, useState } from "react";

export default function JoinLiveClass({
  startTime,
  isActiveLive,
  freeClass,
}: {
  startTime?: string;
  isActiveLive?: boolean;
  freeClass: Class;
}) {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    if (!startTime) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const start = new Date(startTime).getTime();
      const diff = start - now;

      if (diff <= 0) {
        setCountdown(""); // countdown finished
        clearInterval(interval);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setCountdown(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const now = new Date().getTime();
  const start = startTime ? new Date(startTime).getTime() : 0;

  // Show join button if class is active or start time passed
  const showJoinButton = isActiveLive || !startTime || start <= now;

  return (
    <div className="p-6 bg-gray-800 text-white rounded-2xl shadow-md text-center space-y-4">
      <h2 className="text-2xl sm:text-3xl font-bold">Live Class</h2>

      {/* HLS Player */}
      {/* <HlsPlayer src={"http://147.93.123.63/live/mystream.m3u8"} /> */}

      {showJoinButton ? (
        <a
          href={freeClass?.videoLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className="bg-green-600 hover:bg-green-700 transition-colors text-white px-8 py-4 rounded-lg font-bold text-xl shadow-md">
            Join Now
          </button>
        </a>
      ) : countdown ? (
        <>
          <p className="text-gray-300 text-lg">
            Your class will start soon. Get ready!
          </p>
          <div className="text-4xl sm:text-6xl font-extrabold text-yellow-400">
            {countdown}
          </div>
          <p className="text-gray-400 text-sm">
            Scheduled to start at:{" "}
            {startTime ? new Date(startTime).toLocaleString() : "TBA"}
          </p>
        </>
      ) : (
        <p className="text-gray-400">
          The class schedule is being prepared. Please check back later.
        </p>
      )}
    </div>
  );
}
