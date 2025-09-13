"use client";
import React, { useState } from "react";
import { addLesson } from "./api";

// Define types
interface Content {
  name: string;
  type: string;
  link: string;
  description: string;
  requiredForNext?: boolean;
}

interface Lesson {
  name: string;
  description: string;
  type: "video" | "quiz" | "note";
  requiredForNext?: boolean;
  contents?: Content[];
}

export default function LessonForm({
  courseId,
  onSuccess,
}: {
  courseId: string;
  onSuccess: (lesson: Lesson) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<Lesson["type"]>("video");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newLesson = { name, description, type };
    const savedLesson = await addLesson(courseId, newLesson);
    onSuccess(savedLesson);
    setName("");
    setDescription("");
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
          onChange={(e) => setType(e.target.value)}
          className="px-4 py-2 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition w-full"
        >
          <option value="video">Video</option>
          <option value="quiz">Quiz</option>
          <option value="note">Note</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-md transition"
        >
          Save Lesson
        </button>
      </div>
    </form>
  );
}
