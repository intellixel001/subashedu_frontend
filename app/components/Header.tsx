/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Logo from "@/public/assets/logo-removebg-preview.png";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CiVideoOn } from "react-icons/ci";
import {
  FaBookOpen,
  FaChevronDown,
  FaGraduationCap,
  FaInfoCircle,
  FaPhoneAlt,
  FaUserPlus,
} from "react-icons/fa";
import { AnnouncementBar } from "./AnnouncementBar";

export function QuickNavigation() {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  const navigationGroups = useMemo(
    () => [
      {
        name: "Learning Paths",
        icon: <FaGraduationCap className="w-4 h-4" />,
        links: [
          { name: "Admission", href: "/courses/admission" },
          { name: "9-12 Academic", href: "/courses/class%209-12" },
          { name: "Target SSC", href: "/courses/class%209-12" },
          { name: "Target HSC", href: "/courses/class%209-12" },
        ],
      },
      {
        name: "Resources",
        icon: <CiVideoOn className="w-4 h-4" />,
        links: [
          { name: "All Courses", href: "/courses" },
          { name: "Free Classes", href: "/dashboard/free-classes" },
          { name: "Job Prep", href: "/courses/job%20preparation" },
        ],
      },
      {
        name: "Others",
        icon: <FaInfoCircle className="w-4 h-4" />,
        links: [
          { name: "Home", href: "/" },
          { name: "Shop", href: "/materials" },
          { name: "Blog", href: "/blog" },
          { name: "About", href: "/about" },
        ],
      },
    ],
    []
  );

  const toggleTab = useCallback((tab: string) => {
    setActiveTab((prev) => (prev === tab ? null : tab));
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className=" w-full bg-gray-800 z-1000">
      <div className="lg:hidden flex divide-x divide-myred/50 border-b border-myred/50">
        {navigationGroups.map((group) => (
          <div key={group.name} className="relative flex-1">
            <button
              className={`w-full py-2 text-xs font-medium ${
                activeTab === group.name
                  ? "text-myred-secondary"
                  : "text-gray-100"
              } hover:text-myred-secondary focus:ring-2 focus:ring-myred focus:ring-offset-2`}
              onClick={() => toggleTab(group.name)}
            >
              <div className="flex items-center justify-center gap-1">
                {group.icon}
                <span>{group.name}</span>
              </div>
            </button>

            <div
              className={`absolute left-0 right-0 bg-gray-800 shadow-sm z-10 transition-all duration-200
                ${
                  activeTab === group.name
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0 pointer-events-none"
                }`}
            >
              <div className="py-1 space-y-0">
                {group.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="block px-3 py-2 text-xs text-gray-100 hover:text-myred-secondary hover:bg-myred-dark active:bg-myred focus:ring-2 focus:ring-myred focus:ring-offset-2"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Header({ pathname }) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [showNotice, setShowNotice] = useState<boolean>(true);
  const dontShow =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/management") ||
    pathname.startsWith("/dashboard");

  const ckkk = pathname.includes("dashboard/enrolled-courses/view/");

  const navigationGroups = useMemo(
    () => [
      {
        name: "Learning Paths",
        icon: <FaGraduationCap className="w-4 h-4" />,
        links: [
          { name: "Admission", href: "/courses/admission" },
          { name: "9-12 Academic", href: "/courses/class%209-12" },
          { name: "Target SSC", href: "/courses/class%209-12" },
          { name: "Target HSC", href: "/courses/class%209-12" },
        ],
      },
      {
        name: "Resources",
        icon: <CiVideoOn className="w-4 h-4" />,
        links: [
          { name: "All Courses", href: "/courses" },
          { name: "Free Classes", href: "/dashboard/free-classes" },
          { name: "Job Prep", href: "/courses/job%20preparation" },
        ],
      },
      {
        name: "Others",
        icon: <FaInfoCircle className="w-4 h-4" />,
        links: [
          { name: "Home", href: "/" },
          { name: "Shop", href: "/materials" },
          { name: "Blog", href: "/blog" },
          { name: "About", href: "/about" },
        ],
      },
    ],
    []
  );

  if (dontShow || ckkk) {
    return null;
  }

  return (
    <header className="fixed w-full  top-0 z-50 bg-gray-800 shadow-sm">
      <nav className="w-full h-14 sm:h-16 border-b border-myred/50">
        <div className="container mx-auto flex px-2 lg:px-4 items-center justify-between">
          <Link href="/" className="mr-auto ">
            <Image
              className="h-10 w-auto sm:h-12"
              src={Logo}
              alt="Suvash Edu logo"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-2">
            <Link
              href="/courses"
              className="flex items-center justify-center text-sm px-3 py-1 text-gray-100 hover:text-myred-secondary active:text-myred focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-colors"
            >
              <FaBookOpen className="mr-2 text-myred-secondary hover:text-myred active:text-myred text-sm" />
              <span>Courses</span>
            </Link>

            {navigationGroups.map((group) => (
              <div
                key={group.name}
                className="relative"
                onMouseEnter={() => setActiveTab(group.name)}
                onMouseLeave={() => setActiveTab(null)}
              >
                <button className="flex items-center justify-between gap-2 px-4 py-2 text-gray-100 hover:text-myred-secondary active:text-myred font-medium transition-colors focus:ring-2 focus:ring-myred focus:ring-offset-2">
                  <div className="flex items-center gap-2">
                    {group.icon}
                    {group.name}
                  </div>
                  <FaChevronDown
                    className={`w-3 h-3 transition-transform ${
                      activeTab === group.name ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`absolute left-0 mt-1 bg-gray-800 rounded-lg shadow-lg z-10 overflow-hidden transition-all duration-200 min-w-[200px]
                  ${
                    activeTab === group.name
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 pointer-events-none"
                  }`}
                >
                  {group.links.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="flex items-center gap-2 px-4 py-3 text-gray-100 hover:bg-myred-dark hover:text-myred-secondary active:bg-myred active:text-white transition-colors text-sm focus:ring-2 focus:ring-myred focus:ring-offset-2"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            <Link
              href="/contact"
              className="flex items-center justify-center text-sm px-3 py-1 text-gray-100 hover:text-myred-secondary active:text-myred focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-colors"
            >
              <FaPhoneAlt className="mr-2 text-myred-secondary hover:text-myred active:text-myred text-sm" />
              <span>Contact</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center justify-center text-sm bg-myred py-2 px-4 rounded-full text-white hover:bg-myred-secondary hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-colors"
            >
              <FaUserPlus className="mr-2 text-sm" />
              <span>Join now</span>
            </Link>
          </div>

          <div className="flex lg:hidden items-center space-x-2 md:space-x-4 ml-2 md:ml-4">
            <Link
              href="/courses"
              className="flex items-center justify-center text-[10px] md:text-sm px-2 sm:px-3 py-1 text-gray-100 hover:text-myred-secondary active:text-myred focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-colors"
            >
              <FaBookOpen className="mr-1 sm:mr-2 text-myred-secondary hover:text-myred active:text-myred text-[10px] md:text-sm" />
              <span>Courses</span>
            </Link>

            <Link
              href="/contact"
              className="flex items-center justify-center text-[10px] md:text-sm px-2 sm:px-3 py-1 text-gray-100 hover:text-myred-secondary active:text-myred focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-colors"
            >
              <FaPhoneAlt className="mr-1 sm:mr-2 text-myred-secondary hover:text-myred active:text-myred text-[10px] md:text-sm" />
              <span>Contact</span>
            </Link>

            <Link
              href="/dashboard"
              className="flex items-center justify-center text-[10px] md:text-sm bg-myred bg-myred-dark py-1 px-3 sm:py-2 sm:px-4 rounded-full text-white hover:bg-myred-secondary hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-colors"
            >
              <FaUserPlus className="mr-1 sm:mr-2 text-[10px] md:text-sm " />
              <span>Join now</span>
            </Link>
          </div>
        </div>
      </nav>

      <QuickNavigation />
      <AnnouncementBar showNotice={showNotice} setShowNotice={setShowNotice} />
    </header>
  );
}
