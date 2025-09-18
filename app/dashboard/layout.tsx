"use client";
// import { StudentSidebarWrapper } from "@/app/components/StudentSidebarWrapper";

import { usePathname } from "next/navigation";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const ckkk = pathname.includes("dashboard/enrolled-courses/view/");

  return (
    <div className="min-h-screen w-full flex relative">
      {/* Sidebar */}
      {/* <StudentSidebarWrapper /> */}
      {/* <UserPreferenceModal isOpen={true} /> */}
      {/* Main content */}
      <main
        className={`flex-1 p-0 bg-gray-100 min-h-screen overflow-y-auto 
          ${ckkk ? "ml-0" : "lg:ml-[40vh] ml-0"}`}
      >
        {children}
      </main>
    </div>
  );
}
