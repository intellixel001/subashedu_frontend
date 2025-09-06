"use client";

import React, { createContext, useEffect } from "react";

interface RoundedChartData {
  studentCount: number;
  staffCount: number;
  courseCount: number;
  classCount: number;
  teacherCount: number
}

interface AdminContextValue {
  hasAdminNotification: boolean;
  setHasAdminNotification: React.Dispatch<React.SetStateAction<boolean>>;
  hasStudentNotification: boolean;
  setHasStudentNotification: React.Dispatch<React.SetStateAction<boolean>>;
  roundedChartData: RoundedChartData;
  loading: boolean;
  error?: string | null;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [hasAdminNotification, setHasAdminNotification] = React.useState(false);
  const [hasStudentNotification, setHasStudentNotification] =
    React.useState(false);
  const [roundedChartData, setRoundedChartData] = React.useState<RoundedChartData>({
    studentCount: 0,
    staffCount: 0,
    courseCount: 0,
    classCount: 0,
    teacherCount : 0
  });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);



  useEffect(() => {
    async function getData() {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-rounded-chart-data`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const result = await res.json();

        if (!result.success) {
          throw new Error(result.message || "Failed to fetch chart data");
        }
        // Validate the data structure
        const data = result.data || {
          studentCount: 0,
          staffCount: 0,
          courseCount: 0,
          classCount: 0,
          teacherCount: 0
        };
        setRoundedChartData(data);
      } catch (err) {
        console.error("Error fetching chart data:", err);
        setError(err.message || "Could not fetch rounded chart data");
        // Fallback to default state
        setRoundedChartData({
          studentCount: 0,
          staffCount: 0,
          courseCount: 0,
          classCount: 0,
          teacherCount:0
        });
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  const value: AdminContextValue = {
    hasAdminNotification,
    setHasAdminNotification,
    hasStudentNotification,
    setHasStudentNotification,
    roundedChartData,
    loading,
    error,
  };

  return (
    <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = React.useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}