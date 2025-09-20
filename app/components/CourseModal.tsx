// CourseModal.tsx
"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";

import { CourseFor, Lesson } from "../admin/components/CourseTable";
import { CourseEditor } from "./CourseEditor";

// Define interfaces for props
interface Instructor {
  name: string;
  bio?: string;
  image?: string | null;
}

interface Course {
  _id: string;
  id?: string;
  title: string;
  description?: string;
  short_description?: string;
  subjects: string[];
  thumbnailUrl?: string;
  tags: string[];
  price: number;
  offer_price: number;
  instructors: Instructor[];
  type?: string;
  studentsEnrolled: number;
  courseFor: CourseFor;
  classes: string[];
  materials: string[];
  lessons?: Lesson[];
  createdAt?: string;
  updatedAt?: string;
}

interface FormData {
  title: string;
  description?: string;
  short_description?: string;
  subjects: string[];
  tags: string[];
  price: string;
  offer_price: string;
  instructors: Instructor[];
  courseFor: string;
}

interface CourseModalProps {
  isModalOpen: boolean;
  Fragment: typeof Fragment;
  currentCourse: Course | null;
  handleSubmit: (
    e: React.FormEvent,
    thumbnailFile: File | null,
    sanitizedFormData: FormData,
    instructorImageFiles: (File | null)[]
  ) => void;
  formData: FormData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleTagsChange: (tags: string[]) => void;
  addInstructor: () => void;
  handleArrayChange: (field: keyof FormData, value: string) => void;
  handleInstructorChange: (
    index: number,
    field: keyof Instructor,
    value: string
  ) => void;
  removeInstructor: (index: number) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  isCreating: boolean;
  setFormData: (formData: FormData) => void;
}

export const CourseModal: React.FC<CourseModalProps> = ({
  isModalOpen,
  Fragment,
  currentCourse,
  handleSubmit,
  formData,
  handleInputChange,
  handleTagsChange,
  addInstructor,
  handleArrayChange,
  handleInstructorChange,
  removeInstructor,
  setIsModalOpen,
  isCreating,
  setFormData,
}) => {
  const [thumbnailPreview, setThumbnailPreview] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [instructorImagePreviews, setInstructorImagePreviews] = useState<
    (string | null)[]
  >([]);
  const [instructorImageFiles, setInstructorImageFiles] = useState<
    (File | null)[]
  >([]);
  const [tagInput, setTagInput] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const tagInputRef = useRef<HTMLInputElement>(null);
  const instructorFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize thumbnail, instructor images, and tag input when course changes
  useEffect(() => {
    if (currentCourse && currentCourse.thumbnailUrl) {
      setThumbnailPreview(currentCourse.thumbnailUrl);
    } else {
      setThumbnailPreview("");
    }
    setThumbnailFile(null);

    // Initialize instructor images
    if (currentCourse && currentCourse.instructors) {
      setInstructorImagePreviews(
        currentCourse.instructors.map((instructor) => instructor.image || null)
      );
      setInstructorImageFiles(currentCourse.instructors.map(() => null));
    } else {
      setInstructorImagePreviews([]);
      setInstructorImageFiles([]);
    }

    // Initialize tag input
    if (currentCourse) {
      setTagInput((currentCourse.tags || []).join(", "));
    } else {
      setTagInput("");
    }
  }, [currentCourse]);

  // Sync instructor image previews and files when instructors change
  useEffect(() => {
    setInstructorImagePreviews((prev) =>
      formData.instructors.map(
        (_, index) => prev[index] || formData.instructors[index].image || null
      )
    );
    setInstructorImageFiles((prev) =>
      formData.instructors.map((_, index) => prev[index] || null)
    );
  }, [formData.instructors]);

  // Handle thumbnail file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle instructor image file input change
  const handleInstructorFileChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const newFiles = [...instructorImageFiles];
      const newPreviews = [...instructorImagePreviews];
      newFiles[index] = file;
      newPreviews[index] = URL.createObjectURL(file);
      setInstructorImageFiles(newFiles);
      setInstructorImagePreviews(newPreviews);

      // Update formData to remove any existing image URL since a new file is uploaded
      const updatedInstructors = [...formData.instructors];
      updatedInstructors[index] = { ...updatedInstructors[index], image: null };
      setFormData({ ...formData, instructors: updatedInstructors });
    }
  };

  // Remove instructor image
  const removeInstructorImage = (index: number) => {
    const newPreviews = [...instructorImagePreviews];
    const newFiles = [...instructorImageFiles];
    newPreviews[index] = null;
    newFiles[index] = null;
    setInstructorImagePreviews(newPreviews);
    setInstructorImageFiles(newFiles);

    // Update formData to remove image URL
    const updatedInstructors = [...formData.instructors];
    updatedInstructors[index] = { ...updatedInstructors[index], image: null };
    setFormData({ ...formData, instructors: updatedInstructors });
  };

  // Process and add a single tag
  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      handleTagsChange([...formData.tags, trimmedTag]);
    }
    setTagInput("");
    tagInputRef.current?.focus();
  };

  // Handle tag input change
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };

  // Handle keydown events for tag input
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim()) {
        addTag(tagInput);
        tagInputRef.current?.blur();
      }
    }
  };

  // Handle blur event for tag input
  const handleTagBlur = () => {
    if (tagInput.trim()) {
      addTag(tagInput);
    }
  };

  // Handle form submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate instructors
    if (!formData.instructors || formData.instructors.length === 0) {
      setFormError("At least one instructor is required.");
      return;
    }
    setFormError(null);
    const sanitizedFormData = {
      ...formData,
      subjects: Array.isArray(formData.subjects) ? formData.subjects : [],
      tags: Array.isArray(formData.tags) ? formData.tags : [],
      instructors: Array.isArray(formData.instructors)
        ? formData.instructors
        : [],
    };
    handleSubmit(e, thumbnailFile, sanitizedFormData, instructorImageFiles);
  };

  // Trigger thumbnail file input click
  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Trigger instructor file input click
  const triggerInstructorFileInput = (index: number) => {
    instructorFileInputRefs.current[index]?.click();
  };

  // Handle description change from CourseEditor
  const handleDescriptionChange = (html: string) => {
    handleInputChange({
      target: { name: "description", value: html },
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsModalOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md sm:max-w-lg lg:w-[90%] lg:max-w-none rounded-xl bg-card p-6 sm:p-8 lg:p-10 shadow-xl animate-fade-in dark:bg-card">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold text-foreground dark:text-foreground"
                >
                  {currentCourse ? "Edit Course" : "Create New Course"}
                </Dialog.Title>
                {formError && (
                  <div className="mt-4 p-3 bg-destructive/20 text-destructive rounded-md animate-pulse">
                    {formError}
                  </div>
                )}
                <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                  {/* Thumbnail Upload Section */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Thumbnail Image
                    </label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-4">
                      <div className="w-48 h-27 rounded-md overflow-hidden border border-border dark:border-border">
                        {thumbnailPreview ? (
                          <Image
                            src={thumbnailPreview}
                            alt="Thumbnail preview"
                            width={192}
                            height={108}
                            className="w-full h-full object-cover glow"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground dark:bg-muted dark:text-muted-foreground">
                            No thumbnail
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={triggerFileInput}
                        className="px-3 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 dark:text-foreground dark:hover:bg-muted dark:focus:ring-primary"
                      >
                        {thumbnailPreview ? "Change" : "Upload"}
                      </button>
                      {thumbnailPreview && (
                        <button
                          type="button"
                          onClick={() => {
                            setThumbnailPreview("");
                            setThumbnailFile(null);
                          }}
                          className="text-sm text-myred hover:text-myred-dark transition-colors duration-200 dark:text-myred dark:hover:text-myred-dark"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground dark:text-muted-foreground">
                      Recommended aspect ratio: 16:9
                    </p>
                  </div>

                  {/* Title and Course For */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                        Course For
                      </label>
                      <select
                        name="courseFor"
                        value={formData.courseFor || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                        required
                      >
                        <option value="">Select</option>
                        <option value="class 9">Class 9</option>
                        <option value="class 10">Class 10</option>
                        <option value="class 11">Class 11</option>
                        <option value="class 12">Class 12</option>
                        <option value="hsc">HSC</option>
                        <option value="ssc">SSC</option>
                        <option value="admission">Admission</option>
                        <option value="job preparation">Job Preparation</option>
                      </select>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="short_description"
                      value={formData.short_description || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">
                      Description
                    </label>
                    <CourseEditor
                      value={formData.description || ""}
                      onChange={handleDescriptionChange}
                    />
                  </div>

                  {/* Price and Offer Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                        Price
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                        Offer Price
                      </label>
                      <input
                        type="number"
                        name="offer_price"
                        value={formData.offer_price}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                        required
                      />
                    </div>
                  </div>

                  {/* Subjects */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Subjects (Select all that apply)
                    </label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {[
                        "Math",
                        "Physics",
                        "Chemistry",
                        "Biology",
                        "English",
                        "Bangla",
                        "ICT",
                        "Accounting",
                        "Finance",
                        "General Knowledge",
                        "Interview Preparation",
                      ].map((subject) => (
                        <label
                          key={subject}
                          className="inline-flex items-center"
                        >
                          <input
                            type="checkbox"
                            checked={(formData.subjects || []).includes(
                              subject
                            )}
                            onChange={() =>
                              handleArrayChange("subjects", subject)
                            }
                            className="h-4 w-4 text-primary focus:ring-primary border-border rounded dark:text-primary dark:focus:ring-primary dark:border-border"
                          />
                          <span className="ml-2 text-sm text-muted-foreground dark:text-muted-foreground">
                            {subject}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Tags (Enter tags separated by commas)
                    </label>
                    <input
                      type="text"
                      ref={tagInputRef}
                      value={tagInput}
                      onChange={handleTagInputChange}
                      onKeyDown={handleTagKeyDown}
                      onBlur={handleTagBlur}
                      placeholder="80+ Classes, Weekly Exam, Model Test"
                      className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                    />
                    <div className="mt-2 flex flex-wrap gap-2">
                      {(formData.tags || []).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground flex items-center dark:bg-muted dark:text-muted-foreground"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => {
                              const updatedTags = formData.tags.filter(
                                (t) => t !== tag
                              );
                              handleTagsChange(updatedTags);
                            }}
                            className="ml-2 text-myred hover:text-myred-dark dark:text-myred dark:hover:text-myred-dark"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Instructors */}
                  <div>
                    <div className="flex justify-between items-center">
                      <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                        Instructors
                      </label>
                      <button
                        type="button"
                        onClick={addInstructor}
                        className="text-sm text-myred hover:text-myred-dark transition-colors duration-200 dark:text-myred dark:hover:text-myred-dark text-shine"
                      >
                        + Add Instructor
                      </button>
                    </div>
                    {(formData.instructors || []).map((instructor, index) => (
                      <div
                        key={index}
                        className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-2 items-end"
                      >
                        {/* Instructor Image */}
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                            Image (Optional)
                          </label>
                          <input
                            type="file"
                            ref={(el) => {
                              instructorFileInputRefs.current[index] = el;
                            }}
                            onChange={(e) =>
                              handleInstructorFileChange(index, e)
                            }
                            accept="image/*"
                            className="hidden"
                          />
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-16 rounded-md overflow-hidden border border-border dark:border-border">
                              {instructorImagePreviews[index] ? (
                                <Image
                                  src={instructorImagePreviews[index]!}
                                  alt={`Instructor ${index + 1} preview`}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover glow"
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-xs dark:bg-muted dark:text-muted-foreground">
                                  No image
                                </div>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => triggerInstructorFileInput(index)}
                              className="px-2 py-1 border border-border rounded-md text-xs font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 dark:text-foreground dark:hover:bg-muted dark:focus:ring-primary"
                            >
                              {instructorImagePreviews[index]
                                ? "Change"
                                : "Upload"}
                            </button>
                            {instructorImagePreviews[index] && (
                              <button
                                type="button"
                                onClick={() => removeInstructorImage(index)}
                                className="text-xs text-myred hover:text-myred-dark transition-colors duration-200 dark:text-myred dark:hover:text-myred-dark"
                              >
                                Remove
                              </button>
                            )}
                          </div>
                        </div>
                        {/* Instructor Name */}
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                            Name
                          </label>
                          <input
                            type="text"
                            value={instructor.name || ""}
                            onChange={(e) =>
                              handleInstructorChange(
                                index,
                                "name",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                            required
                          />
                        </div>
                        {/* Instructor Bio */}
                        <div>
                          <label className="block text-xs font-medium text-muted-foreground dark:text-muted-foreground">
                            Subject
                          </label>
                          <input
                            type="text"
                            value={instructor.bio || ""}
                            onChange={(e) =>
                              handleInstructorChange(
                                index,
                                "bio",
                                e.target.value
                              )
                            }
                            className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                            required
                          />
                        </div>
                        {/* Remove Instructor Button */}
                        <button
                          type="button"
                          onClick={() => removeInstructor(index)}
                          className="text-myred hover:text-myred-dark text-sm transition-colors duration-200 dark:text-myred dark:hover:text-myred-dark"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Form Actions */}
                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="inline-flex justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:hover:bg-muted dark:focus:ring-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-myred-dark focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 dark:bg-primary dark:text-primary-foreground dark:hover:bg-myred-dark dark:focus:ring-primary"
                      disabled={isCreating}
                    >
                      {currentCourse
                        ? "Update Course"
                        : isCreating
                        ? "Creating ..."
                        : "Create Course"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
