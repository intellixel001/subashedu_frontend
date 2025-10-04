/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";

type AnnouncementBarProps = {
  showNotice: boolean;
  setShowNotice: (value: boolean) => void;
};

export function AnnouncementBar({
  showNotice,
  setShowNotice,
}: AnnouncementBarProps) {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/notice`
        );

        if (!res.ok) {
          setMessage("");
          return;
        }

        const data = await res.json();

        if (data?.success && data?.data?.content?.trim()) {
          setMessage(data.data.content);
        } else {
          setMessage("");
        }
      } catch (error) {
        setMessage("");
      }
    };

    fetchNotice();
  }, []);

  if (!message.trim() || !showNotice) {
    return null;
  }

  return (
    <div className="h-9 sm:h-11 w-full bg-gradient-to-r from-blue-900 via-indigo-900 to-purple-800 border-b border-indigo-100 flex items-center justify-between px-4 shadow-sm">
      {/* Scrolling text */}
      <div className="w-full overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-[700] text-white">
          {message}
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={() => setShowNotice(false)}
        className="ml-4 text-gray-500 hover:text-red-500 transition-colors duration-200"
        aria-label="Close announcement"
      >
        <AiOutlineClose size={18} />
      </button>
    </div>
  );
}
