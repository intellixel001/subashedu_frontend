"use client";

import { CourseType } from "@/_types/course";
import { useEffect, useState } from "react";
import { getLessons } from "./api";
import LessonForm from "./LessonForm";
import LessonList from "./LessonList";

export interface Content {
  _id?: string;
  name: string;
  description: string;
  type: string;
  requiredForNext?: boolean;
  contents?: Content[];
}

export interface Lesson {
  _id?: string;
  name: string;
  description: string;
  type: string;
  requiredForNext?: boolean;
  contents?: Content[];
}

interface Props {
  courseId: string;
}

export default function LessonsClient({ courseId }: Props) {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [courseData, setCourseData] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const fetchLessons = async () => {
    setLoading(true);
    const data: CourseType = await getLessons(courseId);
    setCourseData(data);
    setLessons(data?.lessons || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchLessons();
  }, [courseId]);

  // const handleAddLesson = (newLesson: Lesson) => {
  //   setLessons((prev) => [...prev, newLesson]);
  //   setModalOpen(false);
  // };

  const handleEditLesson = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setModalOpen(true);
  };

  const handleSaveLesson = (savedLesson: Lesson) => {
    if (editingLesson) {
      // Update existing lesson
      setLessons((prev) =>
        prev.map((l) => (l._id === savedLesson._id ? savedLesson : l))
      );
    } else {
      // Add new lesson
      setLessons((prev) => [...prev, savedLesson]);
    }
    setModalOpen(false);
    setEditingLesson(null);
  };

  return (
    <div className="p-6 container mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{courseData?.title || "N/A"}</h1>
        <button
          onClick={() => {
            setEditingLesson(null);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          + Add Lesson
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <p className="text-gray-500">No lessons found.</p>
      ) : (
        <LessonList
          fetchLessons={fetchLessons}
          lessons={lessons}
          courseId={courseId}
          setLessons={setLessons}
          onEditLesson={handleEditLesson} // 👈 pass edit handler
        />
      )}

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4">
              {editingLesson ? "Edit Lesson" : "Add New Lesson"}
            </h2>
            <LessonForm
              courseId={courseId}
              onSuccess={handleSaveLesson}
              fetchLessons={fetchLessons}
              lesson={editingLesson || undefined} // 👈 pass lesson when editing
            />
          </div>
        </div>
      )}
    </div>
  );
}
