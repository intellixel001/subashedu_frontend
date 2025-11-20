"use client";

import { useEffect, useMemo, useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";

export default function ExamPermissionSelector({ formData, setFormData }) {
  const [options, setOptions] = useState([]);

  const [selected, setSelected] = useState({
    position: "",
    class: "",
    subject: "",
  });

  // Fetch exam options
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

  // Filter class by position
  const classesByPosition = useMemo(() => {
    if (!selected.position) return [];
    return options.filter(
      (opt) => opt.type === "class" && opt.position === selected.position
    );
  }, [selected.position, options]);

  // Filter subjects by class
  const subjectsByClass = useMemo(() => {
    if (!selected.class || !selected.position) return [];

    const selectedClass = options.find(
      (opt) =>
        opt.type === "subject" &&
        opt.className === options?.find((s) => s?._id === selected.class)?.name
    );

    if (!selectedClass) return [];

    return options.filter(
      (opt) =>
        opt.type === "subject" &&
        opt.className === selectedClass.className &&
        opt.position === selectedClass.position &&
        opt.status === true
    );
  }, [selected.class, selected.position, options]);

  // Add Permission
  const addPermission = () => {
    if (!selected.position || !selected.class || !selected.subject) return;

    const newPermission = {
      position: selected.position, // text only
      classId: selected.class, // id
      subjectId: selected.subject, // id
    };

    setFormData((prev) => ({
      ...prev,
      exam_permission: [...prev.exam_permission, newPermission],
    }));

    setSelected({ position: "", class: "", subject: "" });
  };

  // Remove Permission
  const removePermission = (index) => {
    setFormData((prev) => ({
      ...prev,
      exam_permission: prev.exam_permission.filter((_, i) => i !== index),
    }));
  };

  // Resolve class/subject names from IDs
  const getClassName = (id) => {
    return options.find((o) => o._id === id)?.name || id;
  };

  const getSubjectName = (id) => {
    return options.find((o) => o._id === id)?.name || id;
  };

  return (
    <div className="mt-4 border p-4 rounded-lg bg-gray-50">
      <h3 className="text-md font-semibold mb-3">Exam Permissions</h3>

      {/* SELECT ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {/* Position */}
        <select
          className="border p-2 rounded"
          value={selected.position}
          onChange={(e) =>
            setSelected({
              position: e.target.value,
              class: "",
              subject: "",
            })
          }
        >
          <option value="">Position</option>
          <option value="Academic">Academic</option>
          <option value="Admission">Admission</option>
          <option value="Job">Job</option>
        </select>

        {/* Class */}
        <select
          className="border p-2 rounded"
          value={selected.class}
          onChange={(e) =>
            setSelected((prev) => ({ ...prev, class: e.target.value }))
          }
          disabled={!classesByPosition.length}
        >
          <option value="">Class</option>
          {classesByPosition.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.name}
            </option>
          ))}
        </select>

        {/* Subject */}
        <select
          className="border p-2 rounded"
          value={selected.subject}
          onChange={(e) =>
            setSelected((prev) => ({ ...prev, subject: e.target.value }))
          }
          disabled={!subjectsByClass.length}
        >
          <option value="">Subject</option>
          {subjectsByClass.map((sub) => (
            <option key={sub._id} value={sub._id}>
              {sub.name}
            </option>
          ))}
        </select>
      </div>

      {/* Add Button */}
      <button
        type="button"
        onClick={addPermission}
        className="px-3 py-2 bg-blue-600 text-white rounded-md flex items-center gap-2"
      >
        <FaPlus /> Add Permission
      </button>

      {/* List of Permissions */}
      <div className="mt-4 space-y-2">
        {formData.exam_permission.map((perm, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white border p-2 rounded-md"
          >
            <span className="text-sm text-gray-700">
              <strong>{perm.position}</strong> →
              <strong>{getClassName(perm.classId)}</strong> →
              <strong>{getSubjectName(perm.subjectId)}</strong>
            </span>

            <button
              type="button"
              onClick={() => removePermission(index)}
              className="text-red-500"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
