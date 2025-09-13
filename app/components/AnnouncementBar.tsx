/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai"; // React Icons close icon

// Props type definition
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

  // Don't render if message is empty or notice is hidden
  if (!message.trim() || !showNotice) {
    return null;
  }

  return (
    <div className="h-8 sm:h-10 w-full bg-[#F7374F] overflow-hidden flex items-center justify-between px-4">
      <div className="w-full overflow-hidden">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-medium text-white">
          {message}
        </div>
      </div>
      {/* Close Button */}
      <button
        onClick={() => setShowNotice(false)}
        className="text-white text-lg ml-4 shrink-0"
        aria-label="Close announcement"
      >
        <AiOutlineClose />
      </button>
    </div>
  );
}
