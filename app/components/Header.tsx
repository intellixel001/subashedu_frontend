/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import Logo from "@/public/assets/logo-removebg-preview.png";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CiVideoOn } from "react-icons/ci";
import {
  FaBars,
  FaBookOpen,
  FaChevronDown,
  FaGraduationCap,
  FaInfoCircle,
  FaPhoneAlt,
  FaSearch,
  FaTimes,
  FaUserPlus,
} from "react-icons/fa";
import { AnnouncementBar } from "./AnnouncementBar";
import { SearchModal } from "./SearchModal";

export function QuickNavigation() {
  const [activeTab, setActiveTab] = useState<string | null>(null);

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

  return (
    <div className="lg:hidden w-full bg-white border-t border-gray-200">
      {navigationGroups.map((group) => (
        <div key={group.name} className="relative border-b border-gray-100">
          <button
            className={`w-full py-3 text-sm font-medium flex items-center justify-between px-4
              ${activeTab === group.name ? "text-[#F4A700]" : "text-gray-700"}
              hover:text-[#a67303]`}
            onClick={() => toggleTab(group.name)}
          >
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
            className={`overflow-hidden transition-all duration-300
              ${activeTab === group.name ? "max-h-60" : "max-h-0"}`}
          >
            {group.links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-6 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-myred"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Header({ pathname }) {
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [showNotice, setShowNotice] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const dontShow =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/management") ||
    pathname.startsWith("/dashboard");

  const ckkk = pathname.includes("dashboard/enrolled-courses/view/");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationGroups = useMemo(
    () => [
      {
        name: "শেখার পথ",
        icon: <FaGraduationCap className="w-4 h-4" />,
        links: [
          { name: "ভর্তি পরীক্ষার প্রস্তুতি", href: "/courses/admission" },
          { name: "৯ম-১২তম শ্রেনী", href: "/courses/class%209-12" },
          { name: "টার্গেট এইচ এস সি", href: "/courses/class%209-12" },
          { name: "চাকরির প্রস্তুতি", href: "/courses/class%209-12" },
        ],
      },
      {
        name: "রিসোর্স",
        icon: <CiVideoOn className="w-4 h-4" />,
        links: [
          { name: "সকল কোর্স সমূহ", href: "/courses" },
          { name: "ফ্রী ক্লাস সমূহ", href: "/dashboard/free-classes" },
          { name: "চাকরির প্রস্তুতি", href: "/courses/job%20preparation" },
        ],
      },
      {
        name: "অন্যান্য",
        icon: <FaInfoCircle className="w-4 h-4" />,
        links: [
          { name: "সুভাস বইমেলা", href: "/materials" },
          { name: "ব্লুগ গুলো পড়ুন", href: "/blog" },
          { name: "আনাদের সম্পর্কে জানুন", href: "/about" },
        ],
      },
    ],
    []
  );

  if (dontShow || ckkk) {
    return null;
  }

  return (
    <>
      <header
        className={`w-full top-0 transition-all duration-300
        ${
          scrolled ? "fixed bg-[#f2f4f7] shadow-lg z-50" : "static bg-[#f2f4f7]"
        }`}
      >
        <nav className="w-full py-3">
          <div className="container mx-auto flex px-4 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="mr-auto flex items-center gap-2">
              <Image src={Logo} alt="Suvash Edu logo" className="h-10 w-auto" />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                href="/courses"
                className="flex items-center text-sm px-3 py-2 text-gray-700 hover:text-[#ac7705] transition-colors"
              >
                <FaBookOpen className="mr-2 text-[#F4A700]" />
                <span>কোর্স সমূহ</span>
              </Link>

              {navigationGroups.map((group) => (
                <div
                  key={group.name}
                  className="relative"
                  onMouseEnter={() => setActiveTab(group.name)}
                  onMouseLeave={() => setActiveTab(null)}
                >
                  <button className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-[#b37b04] font-medium">
                    {group.icon}
                    {group.name}
                    <FaChevronDown
                      className={`w-3 h-3 transition-transform ${
                        activeTab === group.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`absolute left-0 bg-white rounded-lg shadow-lg z-10 overflow-hidden transition-all duration-200 min-w-[200px]
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
                        className="block px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-[#a67201] text-sm"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              <Link
                href="/contact"
                className="flex items-center text-sm px-3 py-2 text-gray-700 hover:text-[#9b6b02] transition-colors"
              >
                <FaPhoneAlt className="mr-2 text-[#F4A700]" />
                <span>যোগাযোগ</span>
              </Link>

              {/* Search icon */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-700 hover:text-[#9b6b02]"
              >
                <FaSearch size={16} />
              </button>

              <Link
                href="/dashboard"
                className="flex items-center justify-center text-sm brand-button py-2 px-4 rounded-full transition-colors"
              >
                <FaUserPlus className="mr-2 text-sm" />
                <span>যুক্ত হোন</span>
              </Link>
            </div>

            {/* Mobile menu toggle */}
            <div className="lg:hidden flex items-center space-x-4">
              {/* Search on mobile */}
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-700 hover:text-[#9b6b02]"
              >
                <FaSearch size={18} />
              </button>

              <button
                onClick={() => setMobileMenu(!mobileMenu)}
                className="text-gray-700"
              >
                {mobileMenu ? <FaTimes size={20} /> : <FaBars size={20} />}
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenu && <QuickNavigation />}

        {!scrolled && (
          <AnnouncementBar
            showNotice={showNotice}
            setShowNotice={setShowNotice}
          />
        )}
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} />
    </>
  );
}
