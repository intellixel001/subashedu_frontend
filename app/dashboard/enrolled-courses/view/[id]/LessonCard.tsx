"use client";

import { useState } from "react";
import {
  FaCheckCircle,
  FaChevronDown,
  FaLock,
  FaPlayCircle,
} from "react-icons/fa";

interface Content {
  id: string;
  name: string;
  type: string;
  link: string;
  description: string;
  status: "completed" | "running" | "locked";
}

interface Props {
  id: string;
  title: string;
  duration: string;
  status: "completed" | "running" | "locked";
  contents: Content[];
  setCurrentContent: (content: Content) => void;
}

export default function LessonCard({
  title,
  duration,
  status,
  contents,
  setCurrentContent,
}: Props) {
  const [isOpen, setIsOpen] = useState(status === "running");

  const toggleCollapse = () => {
    if (status === "completed" || status === "running") {
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div
      className={`p-4 border rounded-xl shadow-sm transition
        ${
          status === "running"
            ? "bg-gradient-to-r from-purple-900 to-pink-700 text-white"
            : "bg-gray-700 text-gray-100"
        }`}
    >
      {/* Lesson Header */}
      <button
        onClick={toggleCollapse}
        className={`w-full flex items-center justify-between text-left ${
          status === "locked"
            ? "cursor-not-allowed opacity-60"
            : "cursor-pointer"
        }`}
      >
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm opacity-80">{duration}</p>
        </div>

        <div className="flex items-center gap-2">
          {status === "completed" && (
            <FaCheckCircle className="text-green-400 w-5 h-5" />
          )}
          {status === "running" && (
            <FaPlayCircle className="text-yellow-300 w-5 h-5 animate-pulse" />
          )}
          {status === "locked" && <FaLock className="text-gray-500 w-5 h-5" />}

          {(status === "completed" || status === "running") && (
            <FaChevronDown
              className={`w-4 h-4 transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          )}
        </div>
      </button>

      {/* Collapsible Contents */}
      {(status === "completed" || status === "running") &&
        isOpen &&
        contents.length > 0 && (
          <div className="mt-3 border-l border-gray-700 space-y-2">
            {contents.map((content) => (
              <div
                key={content.id}
                onClick={() =>
                  content.status !== "locked" && setCurrentContent(content)
                }
                className={`flex items-start justify-between rounded-lg p-2 transition-all duration-200 cursor-pointer
                ${
                  content.status === "running"
                    ? "bg-gradient-to-r from-indigo-900 to-purple-800 text-white hover:scale-[1.02] hover:shadow-lg"
                    : content.status === "completed"
                    ? "bg-gray-800 hover:bg-gray-700 hover:scale-[1.01] hover:shadow-sm"
                    : "bg-gray-700 opacity-60 cursor-not-allowed"
                }`}
              >
                <div className="flex items-center gap-2">
                  {content.status === "completed" && (
                    <FaCheckCircle className="text-green-400 w-4 h-4" />
                  )}
                  {content.status === "running" && (
                    <FaPlayCircle className="text-yellow-300 w-4 h-4 animate-pulse" />
                  )}
                  {content.status === "locked" && (
                    <FaLock className="text-gray-500 w-4 h-4" />
                  )}

                  <div>
                    <p className="text-sm font-medium">{content.name}</p>
                    <p className="text-xs opacity-70">{content.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  );
}
