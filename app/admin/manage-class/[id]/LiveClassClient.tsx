"use client";
import { useEffect, useState } from "react";
import { Class } from "../page";

export default function LiveClassClient({ liveClass }: { liveClass: Class }) {
  const [now, setNow] = useState(new Date());
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive] = useState(liveClass.isActiveLive);

  // Countdown for upcoming classes
  useEffect(() => {
    if (liveClass.type !== "live") return;

    const interval = setInterval(() => {
      const startTime = new Date(liveClass.startTime).getTime();
      const current = new Date().getTime();
      const diff = startTime - current;
      setTimeLeft(diff > 0 ? diff : 0);
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, [liveClass]);

  const canStart =
    liveClass.type === "live" &&
    now >= new Date(liveClass.startTime) &&
    !isActive;
  const showCountdown =
    liveClass.type === "live" && now < new Date(liveClass.startTime);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const startLiveClass = async () => {
    try {
      const streamUrl = liveClass.videoLink;
      window.open(streamUrl, "_blank");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 rounded-2xl shadow-xl text-gray-100">
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        {liveClass.title}
      </h1>

      {showCountdown && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-yellow-400 mb-2">
            Class starts in
          </h2>
          <div className="text-3xl font-mono">{formatTime(timeLeft)}</div>
        </div>
      )}

      {canStart && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-green-400 mb-2">
            Ready to Start
          </h2>
          <button
            onClick={startLiveClass}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            Watch Live
          </button>
        </div>
      )}

      {isActive && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-red-400 mb-2">
            🔴 Live Now
          </h2>
          <button
            onClick={startLiveClass}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow hover:bg-red-700 transition"
          >
            Open Live Stream
          </button>
        </div>
      )}

      {liveClass.type !== "live" && (
        <div className="mb-6 p-4 bg-gray-800 rounded-lg shadow-md text-center">
          <h2 className="text-xl font-semibold text-blue-400 mb-2">
            Recorded Class
          </h2>
          <button
            onClick={() => window.open(liveClass.videoLink, "_blank")}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 transition"
          >
            Watch Recording
          </button>
        </div>
      )}
    </div>
  );
}
