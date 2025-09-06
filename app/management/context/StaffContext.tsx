"use client";

import React, { createContext, useEffect } from "react";

const StaffContext = createContext(undefined);

export function StaffProvider({ children }: { children: React.ReactNode }) {
  const [hasAdminNotification, setHasAdminNotification] = React.useState(false);
  const [hasStudentNotification, setHasStudentNotification] =
    React.useState(false);
  const [roundedChartData, setRoundedChartData] = React.useState({
    studentCount: 0,
    staffCount: 0,
    courseCount: 0,
    classCount: 0,
    teacherCount: 0
  });
  const [role, setRole] = React.useState(undefined);
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/staff/get-rounded-chart-data`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const res2 = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/staff/get-staff`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!res.ok || !res2.ok) {
        throw new Error("Could not fetch staff/teacher data");
      }

      const result = await res.json();
      const result2 = await res2.json();
      setRoundedChartData(result.data);
      setRole(result2.data.role);
      setLoading(false);
    }
    getData();
  }, []);

  const value = {
    hasAdminNotification,
    setHasAdminNotification,
    hasStudentNotification,
    setHasStudentNotification,
    loading,
    roundedChartData,
    role,
  };

  return (
    <StaffContext.Provider value={value}>{children}</StaffContext.Provider>
  );
}

export function useStaffContext() {
  const context = React.useContext(StaffContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
}
