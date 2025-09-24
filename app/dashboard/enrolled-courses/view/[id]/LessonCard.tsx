"use client";

import { Content } from "@/app/admin/components/CourseTable";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

interface Props {
  id?: string;
  name: string;
  contents: Content[];
  setCurrentContent: (content: Content) => void;
}

export default function LessonCard({
  id,
  name,
  contents,
  setCurrentContent,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lessonIdParam = searchParams.get("lessonid");
  const contentIdParam = searchParams.get("contentid");

  const [isOpen, setIsOpen] = useState(false);

  // Auto-open lesson if query matches
  useEffect(() => {
    if (lessonIdParam === id) {
      setIsOpen(true);

      // auto-select current content if matches
      if (contentIdParam) {
        const found = contents.find((c) => c._id === contentIdParam);
        if (found) {
          setCurrentContent(found);
        }
      }
    }
  }, [lessonIdParam, contentIdParam, id, contents, setCurrentContent]);

  const toggleCollapse = () => setIsOpen((prev) => !prev);

  const handleContentClick = (lessonId: string, content: Content) => {
    setCurrentContent(content);

    // update query params
    router.push(`${pathname}?lessonid=${lessonId}&contentid=${content._id}`, {
      scroll: false,
    });
  };

  return (
    <div className="p-4 border rounded-xl shadow-sm transition bg-gray-700 text-gray-100">
      {/* Lesson Header */}
      <button
        onClick={toggleCollapse}
        className="w-full flex items-center justify-between text-left cursor-pointer"
      >
        <h4 className="font-medium">{name}</h4>
        <FaChevronDown
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Collapsible Contents */}
      {isOpen && contents.length > 0 && (
        <div className="mt-3 border-l border-gray-700 space-y-2">
          {contents.map((content) => {
            const isActive =
              lessonIdParam === id && contentIdParam === content._id;

            return (
              <div
                key={content._id}
                onClick={() => handleContentClick(id ?? "", content)}
                className={`flex items-start justify-between rounded-lg p-2 transition-all duration-200 cursor-pointer
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-900 to-purple-800 text-white shadow-md scale-[1.02]"
                      : "bg-gray-800 hover:bg-gray-700 hover:scale-[1.01] hover:shadow-sm"
                  }`}
              >
                <div>
                  <p className="text-sm font-medium">{content.name}</p>
                  <p className="text-xs opacity-70">{content.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
