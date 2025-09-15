"use client";
import { useState } from "react";
import CourseTable, { Course } from "./CourseTable";

const tabConfig = [
  {
    key: "classCourses",
    label: "Class Courses (9-12)",
  },
  {
    key: "admissionCourses",
    label: "Admission Courses",
  },
  {
    key: "jobCourses",
    label: "Job Preparation Courses",
  },
];

interface CoursesTabsProps {
  loading: boolean;
  noCoursesAvailable: boolean;
  classCourses: Course[];
  admissionCourses: Course[];
  jobCourses: Course[];
  filteredClassCourses: Course[];
  filteredAdmissionCourses: Course[];
  filteredJobCourses: Course[];
  subjectFilter: Record<string, string>;
  setSubjectFilter: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  openEditModal: (course: Course) => void;
  setCourseToDelete: (courseId: string) => void;
  setIsDeleteDialogOpen: (isOpen: boolean) => void;
}

export default function CoursesTabs({
  loading,
  noCoursesAvailable,
  classCourses,
  admissionCourses,
  jobCourses,
  subjectFilter,
  setSubjectFilter,
  filteredClassCourses,
  filteredAdmissionCourses,
  filteredJobCourses,
  openEditModal,
  setCourseToDelete,
  setIsDeleteDialogOpen,
}: CoursesTabsProps) {
  const [activeTab, setActiveTab] = useState("classCourses");

  const courseMap = {
    classCourses,
    admissionCourses,
    jobCourses,
  };

  const filteredMap = {
    classCourses: filteredClassCourses,
    admissionCourses: filteredAdmissionCourses,
    jobCourses: filteredJobCourses,
  };

  if (noCoursesAvailable) return null;

  return (
    <div className="mb-8">
      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b border-gray-200">
        {tabConfig.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-300 ${
              activeTab === tab.key
                ? "border-myred text-myred"
                : "border-transparent text-gray-600 hover:text-myred"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Content */}
      <CourseTable
        title={tabConfig.find((t) => t.key === activeTab)?.label || ""}
        courses={courseMap[activeTab]}
        filteredCourses={filteredMap[activeTab]}
        subjectFilter={subjectFilter}
        setSubjectFilter={setSubjectFilter}
        loading={loading}
        tabKey={activeTab}
        openEditModal={openEditModal}
        setCourseToDelete={setCourseToDelete}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
      />
    </div>
  );
}
