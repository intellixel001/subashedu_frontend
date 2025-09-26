"use client";
import { useMemo, useState } from "react";
import ClassesTable from "./ClassesTable";
import { Class } from "./page";

interface Props {
  classes: Class[];
  freeClasses?: Class[];
  loading: boolean;
  openEditModal: (cls: Class) => void;
  onDelete: (id: string) => void;
  onStopLive?: (id: string) => void;
}

const tabs = [
  "Ongoing Live Classes",
  "Class Courses (9-12)",
  "Admission Courses",
  "Job Preparation Courses",
  "Free Classes",
];

const ClassManagementPage = ({
  classes,
  freeClasses = [],
  loading,
  openEditModal,
  onDelete,
  onStopLive,
}: Props) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  // ---------------- Filtering ----------------
  const liveClasses = useMemo(
    () => classes.filter((cls) => cls.type === "live"),
    [classes]
  );

  const classCourses = useMemo(
    () => classes.filter((cls) => cls.courseType === "class"),
    [classes]
  );

  const admissionCourses = useMemo(
    () => classes.filter((cls) => cls.courseType === "admission"),
    [classes]
  );

  const jobCourses = useMemo(
    () => classes.filter((cls) => cls.courseType === "job"),
    [classes]
  );

  const renderActiveTable = () => {
    switch (activeTab) {
      case "Ongoing Live Classes":
        return (
          <ClassesTable
            title="Ongoing Live Classes"
            classes={liveClasses}
            loading={loading}
            onEdit={openEditModal}
            onDelete={onDelete}
            onStopLive={onStopLive}
          />
        );
      case "Class Courses (9-12)":
        return (
          <ClassesTable
            title="Class Courses (9-12)"
            classes={classCourses}
            loading={loading}
            onEdit={openEditModal}
            onDelete={onDelete}
          />
        );
      case "Admission Courses":
        return (
          <ClassesTable
            title="Admission Courses"
            classes={admissionCourses}
            loading={loading}
            onEdit={openEditModal}
            onDelete={onDelete}
          />
        );
      case "Job Preparation Courses":
        return (
          <ClassesTable
            title="Job Preparation Courses"
            classes={jobCourses}
            loading={loading}
            onEdit={openEditModal}
            onDelete={onDelete}
          />
        );
      case "Free Classes":
        return (
          <ClassesTable
            title="Free Classes"
            classes={freeClasses}
            loading={loading}
            onEdit={openEditModal}
            onDelete={onDelete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      {/* Tabs */}
      <div className="mb-6 flex space-x-4 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 -mb-px font-medium border-b-2 ${
              activeTab === tab
                ? "border-myred text-myred"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Table */}
      {renderActiveTable()}
    </div>
  );
};

export default ClassManagementPage;
