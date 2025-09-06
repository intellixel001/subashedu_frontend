"use client";

import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import { FaCamera, FaSpinner } from "react-icons/fa";
import { MdClose } from "react-icons/md";

interface StudentModalProps {
  currentStudent: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    registrationNumber: string;
    educationLevel: string;
    institution: string;
    photoUrl?: string;
    fatherName: string;
    motherName: string;
    guardianPhone: string;
  } | null;
  setIsModalOpen: (isOpen: boolean) => void;
  formData: {
    _id: string;
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    educationLevel: string;
    institution: string;
    fatherName: string;
    motherName: string;
    guardianPhone: string;
    sscYear: string;
    hscYear: string;
  };
  handleInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e: React.FormEvent, photoFile?: File) => void;
  submittingLoading: boolean;
  years: number[];
}

export function StudentModal({
  currentStudent,
  setIsModalOpen,
  formData,
  handleInputChange,
  handleSubmit,
  submittingLoading,
  years,
}: StudentModalProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    currentStudent?.photoUrl || null
  );
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const passwordsMatch =
    formData.password === formData.confirmPassword ||
    (!formData.password && !formData.confirmPassword);

  const isPasswordValid = !currentStudent
    ? formData.password && formData.password.length >= 6 && passwordsMatch
    : (!formData.password || formData.password.length >= 6) && passwordsMatch;

  const isFormValid =
    formData.fullName &&
    formData.email &&
    formData.phone &&
    formData.educationLevel &&
    formData.institution &&
    formData.fatherName &&
    formData.motherName &&
    formData.guardianPhone &&
    (currentStudent ? true : isPasswordValid) &&
    (currentStudent ? true : photoFile);

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
    handleSubmit(e, photoFile || undefined);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b px-6 py-4 bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-800">
            {currentStudent ? "Edit Student" : "Add New Student"}
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
        <form onSubmit={handleFormSubmit} className="p-6">
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
              ) : currentStudent?.photoUrl ? (
                <Image
                  src={currentStudent.photoUrl}
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
              className="text-sm text-[#f7374f] hover:text-[#d62e44] font-medium cursor-pointer"
              disabled={submittingLoading}
            >
              {photoPreview || currentStudent?.photoUrl
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
            <p className="text-xs text-gray-500 mt-1">
              {!currentStudent
                ? "Photo is required"
                : "Optional - leave empty to keep current"}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">
                Personal Information
              </h3>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f]"
                  required
                  disabled={submittingLoading}
                />
              </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f]"
                  required
                  disabled={submittingLoading}
                />
              </div>

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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f]"
                  required
                  disabled={submittingLoading}
                />
              </div>
            </div>

            {/* Educational Information */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700 border-b pb-2">
                Educational Information
              </h3>

              <div>
                <label
                  htmlFor="educationLevel"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Education Level <span className="text-red-500">*</span>
                </label>
                <select
                  id="educationLevel"
                  name="educationLevel"
                  value={formData.educationLevel}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f]"
                  required
                  disabled={submittingLoading}
                >
                  <option value="">Select Education Level</option>
                  <option value="class 9">Class 9</option>
                  <option value="class 10">Class 10</option>
                  <option value="class 11">Class 11</option>
                  <option value="class 12">Class 12</option>
                  <option value="admission">Admission</option>
                  <option value="job preparation">Job Preparation</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="institution"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Institution <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f]"
                  required
                  disabled={submittingLoading}
                />
              </div>

              <div>
                <label
                  htmlFor="sscYear"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  SSC Year (if applicable)
                </label>
                <select
                  id="sscYear"
                  name="sscYear"
                  value={formData.sscYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f]"
                  disabled={submittingLoading}
                >
                  <option value="na">Not applicable</option>
                  {years.map((year) => (
                    <option key={`ssc-${year}`} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="hscYear"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  HSC Year (if applicable)
                </label>
                <select
                  id="hscYear"
                  name="hscYear"
                  value={formData.hscYear}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f]"
                  disabled={submittingLoading}
                >
                  <option value="na">Not applicable</option>
                  {years.map((year) => (
                    <option key={`hsc-${year}`} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Family Information */}
            <div className="space-y-4 md:col-span-2">
              <h3 className="font-medium text-gray-700 border-b pb-2">
                Family Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="fatherName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {`Father's Name`} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="fatherName"
                    name="fatherName"
                    value={formData.fatherName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f]"
                    required
                    disabled={submittingLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="motherName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {`Mother's Name`} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="motherName"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f]"
                    required
                    disabled={submittingLoading}
                  />
                </div>

                <div>
                  <label
                    htmlFor="guardianPhone"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    {`Guardian's Phone`} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="guardianPhone"
                    name="guardianPhone"
                    value={formData.guardianPhone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f]"
                    required
                    disabled={submittingLoading}
                  />
                </div>
              </div>
            </div>

            {/* Password Fields - Only required for new student or when changing password */}
            {(!currentStudent || formData.password) && (
              <div className="space-y-4 md:col-span-2">
                <h3 className="font-medium text-gray-700 border-b pb-2">
                  {currentStudent ? "Change Password" : "Account Password"}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {currentStudent ? "New Password" : "Password"}
                      {!currentStudent && (
                        <span className="text-red-500"> *</span>
                      )}
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        passwordsMatch || !formData.password
                          ? "border-gray-300 focus:ring-[#f7374f] focus:border-[#f7374f]"
                          : "border-red-300 focus:ring-red-500 focus:border-red-500"
                      }`}
                      required={!currentStudent}
                      minLength={6}
                      disabled={submittingLoading}
                    />
                    {formData.password && formData.password.length < 6 && (
                      <p className="mt-1 text-sm text-red-600">
                        Password must be at least 6 characters
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Confirm {currentStudent ? "New " : ""}Password
                      {!currentStudent && (
                        <span className="text-red-500"> *</span>
                      )}
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        passwordsMatch ||
                        (!formData.password && !formData.confirmPassword)
                          ? "border-gray-300 focus:ring-[#f7374f] focus:border-[#f7374f]"
                          : "border-red-300 focus:ring-red-500 focus:border-red-500"
                      }`}
                      required={!currentStudent}
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
                </div>
              </div>
            )}
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
              className={`px-4 py-2 rounded-md cursor-pointer text-white transition-colors flex items-center justify-center min-w-[120px] ${
                isFormValid
                  ? "bg-[#f7374f] hover:bg-[#d62e44]"
                  : "bg-[#f7374f] bg-opacity-50 cursor-not-allowed"
              }`}
              disabled={!isFormValid || submittingLoading}
            >
              {submittingLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {currentStudent ? "Updating..." : "Creating..."}
                </>
              ) : currentStudent ? (
                "Update Student"
              ) : (
                "Create Student"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
