import { FooterWrapper } from "@/app/components/FooterWrapper";
import type { Metadata } from "next";
import { Anek_Bangla, Poppins, Roboto } from "next/font/google"; // Google Fonts
import { HeaderWrapper } from "./components/HeaderWrapper";
import { StudentSidebarWrapper } from "./components/StudentSidebarWrapper";
import { Studentprovider } from "./dashboard/context/StudentContext";
import "./globals.css";
import WhatsApp from "./components/WhatsApp";

// Roboto for general text
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
});

// Eric Bangla equivalent: Noto Sans Bengali
const ericBangla = Anek_Bangla({
  subsets: ["bengali"],
  weight: ["400", "700"],
  variable: "--font-eric-bangla",
});

// Philips-like font: using Poppins from Google
const philips = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-philips",
});

export const metadata: Metadata = {
  title: "Suvash Edu",
  description: "Suvash edu. Students choice.",
  icons: {
    icon: "/assets/logo-removebg-preview.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body
        style={{
          fontFamily: `${roboto.style.fontFamily}, ${ericBangla.style.fontFamily}, ${philips.style.fontFamily}`,
        }}
        className="font-[var(--font-roboto)]"
      >
        <Studentprovider>
          <WhatsApp />
          <HeaderWrapper />
          <StudentSidebarWrapper />
          <div className="bg-[#f2f4f7]">{children}</div>
          <FooterWrapper />
        </Studentprovider>
      </body>
    </html>
  );
}
