"use client";
import { createContext, ReactNode, useContext, useState } from "react";

// ---- Types ----
interface Course {
  _id: string;
  title: string;
  description?: string;
}

interface Material {
  _id: string;
  title: string;
  pdfs: string[];
}

interface Staff {
  _id: string;
  role: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  photoUrl: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface DashboardState {
  notice: string;
  courses: Course[];
  materials: Material[];
  staff: Staff[];
}

interface DashboardContextType extends DashboardState {
  setNotice: (notice: string) => void;

  // Courses
  addCourse: (course: Course) => void;
  updateCourse: (id: string, updated: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Materials
  addMaterial: (material: Material) => void;
  updateMaterial: (id: string, updated: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;

  // Staff ✅
  addStaff: (staff: Staff) => void;
  updateStaff: (id: string, updated: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
}

// ---- Context ----
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

// ---- Provider ----
export function AdminDashboardProvider({ children }: { children: ReactNode }) {
  const [notice, setNotice] = useState<string>("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);

  // ---- CRUD functions ----
  const addCourse = (course: Course) => setCourses((prev) => [...prev, course]);
  const updateCourse = (id: string, updated: Partial<Course>) =>
    setCourses((prev) =>
      prev.map((c) => (c._id === id ? { ...c, ...updated } : c))
    );
  const deleteCourse = (id: string) =>
    setCourses((prev) => prev.filter((c) => c._id !== id));

  const addMaterial = (material: Material) =>
    setMaterials((prev) => [...prev, material]);
  const updateMaterial = (id: string, updated: Partial<Material>) =>
    setMaterials((prev) =>
      prev.map((m) => (m._id === id ? { ...m, ...updated } : m))
    );
  const deleteMaterial = (id: string) =>
    setMaterials((prev) => prev.filter((m) => m._id !== id));

  // ---- Staff CRUD ----
  // ---- Staff CRUD ----
  const addStaff = (newStaff: Staff) => setStaff((prev) => [...prev, newStaff]);

  const updateStaff = (id: string, updated: Partial<Staff>) =>
    setStaff((prev) =>
      prev.map((s) => (s._id === id ? { ...s, ...updated } : s))
    );

  const deleteStaff = (id: string) =>
    setStaff((prev) => prev.filter((s) => s._id !== id));

  return (
    <DashboardContext.Provider
      value={{
        notice,
        courses,
        materials,
        staff,
        setNotice,
        addCourse,
        updateCourse,
        deleteCourse,
        addMaterial,
        updateMaterial,
        deleteMaterial,
        addStaff,
        updateStaff,
        deleteStaff,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

// ---- Hook for usage ----
export function useAdminDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error(
      "useAdminDashboard must be used inside AdminDashboardProvider"
    );
  }
  return context;
}
