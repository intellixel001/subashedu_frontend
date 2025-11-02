"use client";

import { useEffect, useMemo, useState } from "react";

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
    class: "",
    subject: "",
    position: "",
    duration: 0,
    cutmark: 0,
    nagetivemark: 0,
    isLive: false,
    status: true,
    startDate: "",
    resultPublishedDate: "",
  });

  const [options, setOptions] = useState([]); // all options from backend

  // Load initial data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...formData,
        ...initialData,
        // startDate: initialData.startDate
        //   ? new Date(initialData.startDate).toISOString().slice(0, 16)
        //   : "",
        // resultPublishedDate: initialData.resultPublishedDate
        //   ? new Date(initialData.resultPublishedDate).toISOString().slice(0, 16)
        //   : "",
      });
    }
  }, [initialData]);

  // Fetch all options once
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/option/get`,
          { credentials: "include" }
        );
        const data = await res.json();
        if (data.data) setOptions(data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchOptions();
  }, []);

  // Filtered classes by position
  const classesByPosition = useMemo(() => {
    if (!formData.position) return [];
    return options.filter(
      (opt) => opt.type === "class" && opt.position === formData.position
    );
  }, [formData.position, options]);

  const subjectsByClass = useMemo(() => {
    if (!formData.class || !formData.position) return [];

    // 1️⃣ Find the selected class object
    const selectedClass = options.find(
      (opt) => opt.type === "class" && +opt.id === +formData.class
    );

    console.log({ selectedClass, options });

    if (!selectedClass) return [];

    // 2️⃣ Filter subjects matching className and position
    return options.filter(
      (opt) =>
        opt.type === "subject" &&
        opt.className === selectedClass.className &&
        opt.position === selectedClass.position &&
        opt.status === true
    );
  }, [formData.class, formData.position, options]);

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (key === "position")
      setFormData((prev) => ({ ...prev, class: "", subject: "" }));
    if (key === "class") setFormData((prev) => ({ ...prev, subject: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: "",
      description: "",
      billingType: "",
      class: "",
      subject: "",
      position: "",
      duration: 0,
      cutmark: 0,
      nagetivemark: 0,
      isLive: false,
      status: true,
      startDate: "",
      resultPublishedDate: "",
    });
  };

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
            onClick={() => {
              onClose();
              setFormData({
                name: "",
                description: "",
                billingType: "",
                class: "",
                subject: "",
                position: "",
                duration: 0,
                cutmark: 0,
                nagetivemark: 0,
                isLive: false,
                status: true,
                startDate: "",
                resultPublishedDate: "",
              });
            }}
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
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              rows={3}
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

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.position}
              onChange={(e) => handleChange("position", e.target.value)}
            >
              <option value="">Select position</option>
              <option value="Academic">Academic</option>
              <option value="Admission">Admission</option>
              <option value="Job">Job</option>
            </select>
          </div>

          {/* Class */}
          {classesByPosition.length > 0 && (
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
                {classesByPosition.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject */}
          {subjectsByClass.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
              >
                <option value="">Select subject</option>
                {subjectsByClass.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
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
              value={formData.duration}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </div>

          {/* cutmark */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Cutmark (%)
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.cutmark}
              onChange={(e) => handleChange("cutmark", e.target.value)}
            />
          </div>

          {/* nagetivemark */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Exam Nagetive Mark
            </label>
            <input
              type="number"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.nagetivemark}
              onChange={(e) => handleChange("nagetivemark", e.target.value)}
            />
          </div>

          {/* Start Date */}
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

          {/* Result Published */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Result Published Time
            </label>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.resultPublishedDate}
              onChange={(e) =>
                handleChange("resultPublishedDate", e.target.value)
              }
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
              onClick={() => {
                onClose();
                setFormData({
                  name: "",
                  description: "",
                  billingType: "",
                  class: "",
                  subject: "",
                  position: "",
                  duration: 0,
                  cutmark: 0,
                  isLive: false,
                  status: true,
                  startDate: "",
                  resultPublishedDate: "",
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
