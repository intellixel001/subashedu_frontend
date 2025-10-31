"use client";

import { useEffect, useState } from "react";
import { examSections } from "../examDb/examSubject";

export default function CreateUpdateExam({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  errorMsg,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    billingType: "",
    class: 0,
    subject: 0,
    admission: "job",
    duration: "",
    isLive: false,
    status: true,
    startDate: "",
    position: "",
  });

  const [subjects, setSubjects] = useState([]);

  // Load initial data if editing
  useEffect(() => {
    if (initialData)
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        startDate: initialData.startDate
          ? new Date(initialData.startDate).toISOString().slice(0, 16)
          : "",
      }));
  }, [initialData]);

  const handleChange = (key: keyof typeof formData, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    const classObj = examSections.find((cls) => +cls.id === +formData.class);
    setSubjects(classObj?.items || []);
  }, [formData.class]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center border-b px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">
            {initialData ? "Update Exam" : "Create Exam"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Name
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter exam name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Enter short description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* Billing Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Billing Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.billingType}
              onChange={(e) => handleChange("billingType", e.target.value)}
            >
              <option value="">Select billing type</option>
              <option value="free">Free</option>
              <option value="paid">Paid</option>
            </select>
          </div>

          {/* position Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position Type
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
            >
              <option value="academic">academic</option>
              <option value="admission">admission</option>
              <option value="job">job</option>
            </select>
          </div>

          {/* Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Class
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.class}
              onChange={(e) => handleChange("class", e.target.value)}
            >
              <option value="">Select class</option>
              {examSections.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          {subjects && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none disabled:opacity-50"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
                disabled={!formData.class}
              >
                <option value="">Select subject</option>
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. 60"
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </div>

          {/* ✅ Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Start Time
            </label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>

          {/* Switches */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isLive}
                onChange={(e) => handleChange("isLive", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Is Live</span>
            </label>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.status}
                onChange={(e) => handleChange("status", e.target.checked)}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Status</span>
            </label>
          </div>

          {/* Error message */}
          {errorMsg && (
            <p className="text-red-900 px-3 py-1 border border-red-900 rounded-3xl my-4">
              {errorMsg?.toString()}
            </p>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
