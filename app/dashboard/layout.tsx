import { StudentSidebarWrapper } from "@/app/components/StudentSidebarWrapper";
import { Studentprovider } from "@/app/dashboard/context/StudentContext";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Studentprovider>
      <div className="min-h-screen w-full flex relative">
        {/* Sidebar */}
        <StudentSidebarWrapper />
        {/* <UserPreferenceModal isOpen={true} /> */}
        {/* Main content */}
        <main className="flex-1 p-0 md:p-2 lg:p-4 bg-gray-100 min-h-screen overflow-y-auto lg:ml-64">
          {children}
        </main>
      </div>
    </Studentprovider>
  );
}
