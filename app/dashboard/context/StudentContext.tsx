"use client";

import React, { createContext } from "react";

type StudentContextType = {
  hasNotification: boolean;
  setHasNotification: React.Dispatch<React.SetStateAction<boolean>>;
};

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export function Studentprovider({ children }: { children: React.ReactNode }) {
  const [hasNotification, setHasNotification] = React.useState(false);

  return (
    <StudentContext.Provider
      value={{
        hasNotification,
        setHasNotification,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
}

export function useStudentContext() {
  const context = React.useContext(StudentContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an Studentprovider");
  }
  return context;
}
