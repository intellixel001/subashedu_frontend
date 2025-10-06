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
    { href: "/courses", text: "সমস্ত কোর্স", icon: <FaGraduationCap /> },
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
    { href: "/materials", text: "শপ", icon: <FaShoppingBag /> },
    { href: "/blog", text: "ব্লগ", icon: <FaBlog /> },
    { href: "/about", text: "আমাদের সম্পর্কে", icon: <FaInfoCircle /> },
  ];

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between bg-gradient-to-l from-gray-400 via-gray-300 to-gray-100 text-gray-900 py-20 px-6 lg:px-20">
      {/* Left Text Column */}
      <div className="lg:w-1/2 flex flex-col justify-center space-y-6">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
          <span className="text-myred">আপনার শিক্ষার যাত্রা</span>
          <br />
          <span className="text-gray-700 font-semibold">
            সুবাশ এডুর সঙ্গে সফলতার পথে
          </span>
        </h1>

        <p className="text-gray-600 text-base sm:text-lg max-w-md">
          ভর্তি প্রস্তুতি থেকে চাকরি প্রস্তুতি পর্যন্ত সকল শিক্ষামূলক কোর্স,
          ফ্রি ক্লাস এবং প্রয়োজনীয় শিক্ষাসংক্রান্ত সম্পদগুলো এক জায়গায়।
          শিক্ষার্থীদের জন্য সহজ, দ্রুত এবং কার্যকরী।
        </p>

        {/* Navigation Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {navigationItems.slice(0, 5).map((item, idx) => (
            <Link
              href={item.href}
              key={idx}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-200 hover:bg-myred/10 transition-colors text-sm sm:text-base shadow-sm"
            >
              {item.icon}
              <span>{item.text}</span>
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 mt-6">
          <Link href="/courses">
            <button className="px-10 py-4 sm:py-5 bg-gradient-to-r from-myred to-myred-secondary text-white font-extrabold text-lg sm:text-xl rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300">
              সমস্ত কোর্স দেখুন
            </button>
          </Link>

          <Link href="https://www.youtube.com/@Suvash.Edu.B/videos">
            <button className="px-10 py-4 sm:py-5 bg-gradient-to-r from-myred-dark to-myred text-white font-extrabold text-lg sm:text-xl rounded-full shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-3">
              <CiVideoOn className="text-2xl sm:text-3xl" /> ফ্রি ক্লাস দেখুন
            </button>
          </Link>
        </div>
      </div>

      {/* Right Image Column */}
      <div className="lg:w-1/2 mt-10 lg:mt-0 flex justify-center">
        <img
          src="/assets/hero.png"
          alt="Education Hero"
          className="w-full max-full rounded-xl"
        />
      </div>
    </section>
  );
}
