"use client";

export default function OptionCreateUpdateModal({
  handleSubmit,
  editingItem,
  formData,
  setFormData,
  closeModal,
  errorMsg,
  mode,
  setMode,
}) {
  const positionOptions = ["Academic", "Admission", "Job"];
  const classOptions = ["6", "7", "8", "9", "10", "11", "12"];

  const handleChange = (key: string, value: string | boolean) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-h-[80vh] overflow-hidden overflow-y-auto max-w-md shadow-lg">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-4">
          {editingItem ? "Edit Options" : "Add Options"}
        </h2>

        {/* Mode Selector */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setMode("class")}
            className={`flex-1 py-2 rounded-md border ${
              mode === "class"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Class
          </button>
          <button
            onClick={() => setMode("subject")}
            className={`flex-1 py-2 rounded-md border ${
              mode === "subject"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300"
            }`}
          >
            Subject
          </button>
        </div>

        {/* Fields */}
        <div className="space-y-3">
          {/* Position Dropdown */}
          <div>
            <label className="block text-sm font-medium mb-1">Position</label>
            <select
              value={formData.position || ""}
              onChange={(e) => handleChange("position", e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="">Select position</option>
              {positionOptions.map((pos) => (
                <option key={pos} value={pos}>
                  {pos}
                </option>
              ))}
            </select>
          </div>

          {/* Class Dropdown (only if subject mode) */}
          {mode === "subject" && (
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select
                value={formData.className || ""}
                onChange={(e) => handleChange("className", e.target.value)}
                className="w-full border border-gray-300 rounded-md p-2"
              >
                <option value="">Select class</option>
                {classOptions.map((cls) => (
                  <option key={cls} value={cls}>
                    Class {cls}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={formData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={`Enter ${mode} name`}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>

          {/* ✅ Status Switch */}
          <div className="flex items-center justify-between border border-gray-200 rounded-md p-3 mt-2">
            <label className="text-sm font-medium text-gray-700">
              Status:{" "}
              <span
                className={`font-semibold ${
                  formData.status ? "text-green-600" : "text-red-600"
                }`}
              >
                {formData.status ? "Active" : "Inactive"}
              </span>
            </label>

            <button
              type="button"
              onClick={() => handleChange("status", !formData.status)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                formData.status ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  formData.status ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {errorMsg && <p>{errorMsg}</p>}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {editingItem ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
