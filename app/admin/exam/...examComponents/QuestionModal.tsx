"use client";
import { useState } from "react";

export function QuestionModal({ onClose, onSave, initialData }) {
  const [type] = useState<"mcq" | "written">(initialData?.type || "mcq");
  const [body, setBody] = useState(initialData?.body || "");
  const [fields, setFields] = useState<string[]>(
    initialData?.fields || ["", "", "", ""]
  );
  const [answer, setAnswer] = useState<number>(initialData?.answer || 0);
  const [explanation, setExplanation] = useState(
    initialData?.explanation || ""
  );

  // 🟢 Handle Save
  const handleSubmit = () => {
    if (!body.trim()) return alert("Please enter the main question body");
    if (fields.some((f) => !f.trim()))
      return alert("Please fill all 4 answer fields before saving");
    if (!answer) return alert("Please select the correct answer");

    onSave({
      id: initialData?._id,
      type,
      body,
      fields,
      answer,
      explanation,
    });
  };

  // 🧩 Handle Answer Option Edit
  const handleFieldChange = (index: number, value: string) => {
    const updated = [...fields];
    updated[index] = value;
    setFields(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full h-[90vh] overflow-hidden overflow-y-auto max-w-lg rounded-xl p-6 shadow-lg">
        {/* Header */}
        <h2 className="text-lg font-semibold mb-4 text-gray-800">
          {initialData ? "Edit Question" : "Create Question"}
        </h2>

        <div className="space-y-4">
          {/* 🟩 Main Question */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
              rows={3}
              placeholder="Enter the main question..."
            />
          </div>

          {/* 🟩 Answer Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {type === "mcq"
                ? "Answer Options (4)"
                : "Sub Questions for Paragraph (4)"}
            </label>

            {fields.map((f, i) => (
              <div
                key={i}
                className="flex items-center gap-3 mb-2 border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50"
              >
                <input
                  type="radio"
                  name="correct-answer"
                  value={i + 1}
                  checked={answer === i + 1}
                  onChange={() => setAnswer(i + 1)}
                  className="text-blue-600 transform scale-125 cursor-pointer focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={f}
                  onChange={(e) => handleFieldChange(i, e.target.value)}
                  placeholder={`Answer ${i + 1}`}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-400 outline-none"
                />
              </div>
            ))}
          </div>

          {/* 🟩 Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Explanation (optional)
            </label>
            <textarea
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              rows={3}
              placeholder="Enter explanation for the correct answer..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            />
          </div>
        </div>

        {/* 🟩 Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
