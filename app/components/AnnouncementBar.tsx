/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";

export function AnnouncementBar() {
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

  if (!message.trim()) {
    return null;
  }

  return (
    <div className="h-8 sm:h-10 w-full bg-[#F7374F] overflow-hidden flex items-center">
      <div className="w-full">
        <div className="animate-marquee whitespace-nowrap text-xs sm:text-sm font-medium text-white">
          {message}
        </div>
      </div>
    </div>
  );
}
