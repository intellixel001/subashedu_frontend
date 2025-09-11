import { FooterWrapper } from "@/app/components/FooterWrapper";
import type { Metadata } from "next";
import { Questrial } from "next/font/google";
import { HeaderWrapper } from "./components/HeaderWrapper";
// import { DisableDevTools } from "@/components/DisableDevTools";
import { StudentSidebarWrapper } from "./components/StudentSidebarWrapper";
import { Studentprovider } from "./dashboard/context/StudentContext";
import "./globals.css";

const questrial = Questrial({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Suvash Edu",
  description: "Suvash edu. Students choice.",
  icons: {
    icon: "/assets/logo-removebg-preview.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${questrial.className} antialiased`}>
      <body>
        <Studentprovider>
          <HeaderWrapper />
          <StudentSidebarWrapper />
          {children}
          <FooterWrapper />
          {/* <DisableDevTools />  */}
        </Studentprovider>
      </body>
    </html>
  );
}
