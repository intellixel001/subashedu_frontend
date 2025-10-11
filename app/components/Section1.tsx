"use client";
import Link from "next/link";
import { CiVideoOn } from "react-icons/ci";
import {
  FaBlog,
  FaGraduationCap,
  FaHome,
  FaInfoCircle,
  FaShoppingBag,
} from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";

export default function Section1() {
  const navigationItems = [
    { href: "/courses", text: " সকল কোর্স", icon: <FaGraduationCap /> },
    { href: "/", text: "হোম", icon: <FaHome /> },
    {
      href: "/courses/admission",
      text: "ভর্তি প্রস্তুতি",
      icon: <FaGraduationCap />,
    },
    {
      href: "/courses/class%209-12",
      text: "৯-১২ ক্লাস",
      icon: <FaGraduationCap />,
    },
    {
      href: "/courses/job%20preparation",
      text: "চাকরি প্রস্তুতি",
      icon: <MdPersonSearch />,
    },
    {
      href: "/dashboard/free-classes",
      text: "ফ্রি ক্লাস",
      icon: <CiVideoOn />,
    },
    { href: "/materials", text: "সুভাস শপ", icon: <FaShoppingBag /> },
    { href: "/blog", text: "ব্লগ পড়ুন", icon: <FaBlog /> },
    { href: "/about", text: "আমাদের সম্পর্কে জানুন", icon: <FaInfoCircle /> },
  ];

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between bg-gradient-to-br from-[#001F3F] via-[#18314a] to-[#001F3F] text-white py-20 px-6 lg:px-20">
      {/* Left Text Column */}
      <div className="lg:w-1/2 flex flex-col justify-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
          <span className="text-white">আপনার শিক্ষার শুরু</span>
          <br />
          <span className="brand-text-color font-semibold">
            হোক সুভাস এডুর সাথে
          </span>
        </h1>

        <p className="text-white text-base sm:text-[14px] font-[700]">
          ভর্তি প্রস্তুতি থেকে শুরু করে চাকরি প্রস্তুতি সকল শিক্ষামূলক কোর্স,
          ফ্রি ক্লাস এবং প্রয়োজনীয় শিক্ষাসংক্রান্ত বিষয়গুলো আপনি পাবেন এক জায়গায়।
          সুভাস এডু শিক্ষার্থীদের জন্য সহজ, দ্রুত এবং কার্যকরী একটি প্ল্যাটফর্ম।
        </p>

        {/* Navigation Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {navigationItems.slice(0, 5).map((item, idx) => (
            <Link
              href={item.href}
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-full brand-button text-sm sm:text-base shadow-sm"
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mt-6">
          <Link href="/courses">
            <button className="px-10 py-4 brabrand-hover-button sm:py-5 brand2-bg-color text-white font-extrabold text-lg sm:text-xl rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              সকল কোর্স দেখুন
            </button>
          </Link>

          <Link href="https://www.youtube.com/@Suvash.Edu.B/videos">
            <button className="px-10 py-4 brabrand-hover-button sm:py-5 brand2-bg-color text-white font-extrabold text-lg sm:text-xl rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
              <CiVideoOn className="text-2xl sm:text-3xl" /> ফ্রি ক্লাস গুলো দেখুন
            </button>
          </Link>
        </div>
      </div>

      {/* Right Image Column */}
      <div className=" lg:w-1/2 flex flex-col justify-center p-4">
        <div className="relative w-full">
          <div
            aria-hidden
            className="absolute -inset-1 rounded-3xl"
            style={{
              background:
                "linear-gradient(90deg, rgba(99,102,241,0.85), rgba(236,72,153,0.75), rgba(34,197,94,0.6))",
              filter: "blur(18px)",
              zIndex: 0,
              opacity: 0.9,
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 rounded-3xl"
            style={{
              background: "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45))",
              zIndex: 1,
            }}
          />
          <div className="relative z-10 overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 backdrop-blur-sm p-1 transition-transform transform hover:-translate-y-1">
            <div className="rounded-2xl overflow-hidden bg-black/80">
              <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
                <iframe
                  className="absolute inset-0 w-full h-full border-0"
                  src="https://www.youtube.com/embed/atLDxczwl8Y"
                  title="জানুন সুভাস এডু সম্পর্কে । আপনার মননের শিক্ষাকে জাগ্রত করাই আমাদের উদ্দেশ্য ।"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
              <div className="px-5 py-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-white text-base md:text-lg font-semibold leading-tight">
                    জানুন সুভাস এডু সম্পর্কে । আপনার মননের শিক্ষাকে জাগ্রত করাই আমাদের উদ্দেশ্য ।
                  </h3>
                  <p className="mt-1 text-sm text-white/70">SS Animation Studio • 2D / 3D</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/6 border border-white/8 text-sm">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M14.752 11.168l-5.197-3.03A1 1 0 008 9.03v5.94a1 1 0 001.555.83l5.197-3.03a1 1 0 000-1.664z"
                      />
                    </svg>
                    <span className="text-white/90">Watch</span>
                  </div>
                  <div
                    className="rounded-full p-0.5"
                    style={{
                      background: "linear-gradient(90deg,#7c3aed,#ec4899)",
                    }}
                  >
                    <div className="bg-black/85 rounded-full px-3 py-2 text-white text-xs font-medium">
                      Live
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            aria-hidden
            className="absolute left-4 top-4 w-12 h-12 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.35), rgba(255,255,255,0.02))",
              filter: "blur(6px)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />
        </div>
      </div>

    </section>
  );
}
