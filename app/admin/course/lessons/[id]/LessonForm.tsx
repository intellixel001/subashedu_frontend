"use client";
import React, { useEffect, useState } from "react";
import { addLesson, updateLesson } from "./api";

interface Lesson {
  _id?: string;
  name: string;
  description: string;
  type: string;
  requiredForNext?: boolean;
  contents?: Content[];
}

export default function LessonForm({
  courseId,
  onSuccess,
  fetchLessons,
  lesson, // <- pass here when editing
}: {
  courseId: string;
  onSuccess: (lesson: Lesson) => void;
  fetchLessons: () => void;
  lesson?: Lesson; // optional prop
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<Lesson["type"]>("video");
  const [requiredForNext, setRequiredForNext] = useState(false);

  // preload values if editing
  useEffect(() => {
    if (lesson) {
      setName(lesson.name);
      setDescription(lesson.description);
      setType(lesson.type);
      setRequiredForNext(!!lesson.requiredForNext);
    }
  }, [lesson]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLesson = { name, description, type, requiredForNext };

    let savedLesson: Lesson;
    if (lesson?._id) {
      // edit existing
      savedLesson = await updateLesson(courseId, lesson._id, newLesson);
    } else {
      // create new
      savedLesson = await addLesson(courseId, newLesson);
    }

    onSuccess(savedLesson);
    fetchLessons();

    // reset only for add mode
    if (!lesson?._id) {
      setName("");
      setDescription("");
      setType("video");
      setRequiredForNext(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Name */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Lesson Name <span className="text-red-500">*</span>
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Introduction to Chemistry"
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full"
          required
        />
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short overview of the lesson..."
          rows={3}
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full resize-none"
          required
        />
      </div>

      {/* Type */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-700 mb-1">
          Lesson Type
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as Lesson["type"])}
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full"
        >
          <option value="video">Video</option>
          <option value="quiz">Quiz</option>
          <option value="note">Note</option>
        </select>
      </div>

      {/* Required For Next (Toggle) */}
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Required to Unlock Next Lesson?
        </label>
        <button
          type="button"
          onClick={() => setRequiredForNext(!requiredForNext)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
            requiredForNext ? "bg-blue-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
              requiredForNext ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
        >
          {lesson ? "Update Lesson" : "Save Lesson"}
        </button>
      </div>
    </form>
  );
}
