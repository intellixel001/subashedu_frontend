import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { FaCamera, FaSpinner } from "react-icons/fa";
import { MdClose } from "react-icons/md";

export function StaffModal({
  currentStaff,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  submittingLoading,
}) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    currentStaff?.photoUrl || null
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const passwordsMatch =
    formData.password === formData.confirmPassword ||
    (!formData.password && !formData.confirmPassword);

  const isPasswordValid = !currentStaff
    ? formData.password && formData.password.length >= 6 && passwordsMatch
    : (!formData.password || formData.password.length >= 6) && passwordsMatch;

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.phone &&
    (formData.role === "staff" || formData.role === "teacher") &&
    (currentStaff ? true : isPasswordValid) &&
    (currentStaff ? true : photoFile);

  const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.role || !["staff", "teacher"].includes(formData.role)) {
      alert("Please select a valid role (Staff or Teacher)");
      return;
    }
    console.log("Submitting Form Data:", formData, "Photo:", photoFile); // Debug
    handleSubmit(e, photoFile || undefined);
  };

  return (
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b px-4 py-3 bg-gray-50 sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">
            {currentStaff ? "Edit Staff Member" : "Add New Staff Member"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            disabled={submittingLoading}
          >
            <MdClose size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-6">
          {/* Photo Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200 mb-2">
              {photoPreview ? (
                <Image
                  src={photoPreview}
                  alt="Profile Preview"
                  fill
                  className="object-cover"
                  onLoad={() =>
                    photoPreview && URL.revokeObjectURL(photoPreview)
                  }
                />
              ) : currentStaff?.photoUrl ? (
                <Image
                  src={currentStaff.photoUrl}
                  alt="Current Profile"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <FaCamera className="text-gray-400 text-2xl" />
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={triggerFileInput}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              disabled={submittingLoading}
            >
              {photoPreview || currentStaff?.photoUrl
                ? "Change Photo"
                : "Upload Photo"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handlePhotoChange}
              accept="image/*"
              className="hidden"
              disabled={submittingLoading}
            />
            <p className="text-xs text-gray-500 mt-1 text-center">
              {!currentStaff
                ? "Photo is required"
                : "Optional - leave empty to keep current"}
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  formData.fullName
                    ? "border-gray-300 focus:ring-blue-500"
                    : "border-red-300 focus:ring-red-500"
                }`}
                required
                disabled={submittingLoading}
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  formData.email
                    ? "border-gray-300 focus:ring-blue-500"
                    : "border-red-300 focus:ring-red-500"
                }`}
                required
                disabled={submittingLoading}
              />
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  formData.phone
                    ? "border-gray-300 focus:ring-blue-500"
                    : "border-red-300 focus:ring-red-500"
                }`}
                required
                disabled={submittingLoading}
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Role <span className="text-red-500">*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  formData.role
                    ? "border-gray-300 focus:ring-blue-500"
                    : "border-red-300 focus:ring-red-500"
                }`}
                required
                disabled={submittingLoading}
              >
                <option value="">Select Role</option>
                <option value="staff">Staff</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            {/* Passwords */}
            <>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {currentStaff ? "New Password" : "Password"}
                  {!currentStaff && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    passwordsMatch || !formData.password
                      ? "border-gray-300 focus:ring-blue-500"
                      : "border-red-300 focus:ring-red-500"
                  }`}
                  required={!currentStaff}
                  minLength={6}
                  disabled={submittingLoading}
                />
                {formData.password && formData.password.length < 6 && (
                  <p className="mt-1 text-sm text-red-600">
                    Password must be at least 6 characters
                  </p>
                )}
                {!passwordsMatch &&
                  (formData.password || formData.formData.confirmPassword) && (
                    <p className="mt-1 text-sm text-red-600">
                      {`Passwords don't match`}
                    </p>
                  )}
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm {currentStaff ? "New " : ""}Password
                  {!currentStaff && <span className="text-red-500"> *</span>}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    passwordsMatch ||
                    (!formData.password && !formData.confirmPassword)
                      ? "border-gray-300 focus:ring-blue-500"
                      : "border-red-300 focus:ring-red-500"
                  }`}
                  required={!currentStaff}
                  minLength={6}
                  disabled={submittingLoading}
                />
                {!passwordsMatch &&
                  (formData.password || formData.confirmPassword) && (
                    <p className="mt-1 text-sm text-red-600">
                      {`Passwords don't match`}
                    </p>
                  )}
              </div>
            </>
          </div>

          {/* Modal Footer */}
          <div className="flex justify-end mt-6 space-x-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={submittingLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`px-4 py-2 rounded-md text-white transition-colors flex items-center justify-center min-w-[120px] ${
                isFormValid
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-blue-400 cursor-not-allowed"
              }`}
              disabled={!isFormValid || submittingLoading}
            >
              {submittingLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {currentStaff ? "Updating..." : "Creating..."}
                </>
              ) : currentStaff ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}