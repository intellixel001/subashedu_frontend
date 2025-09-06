"use client";
import Link from "next/link";
import { BsBullseye } from "react-icons/bs";
import { CiVideoOn } from "react-icons/ci";
import {
  FaBlog,
  FaGraduationCap,
  FaHome,
  FaInfoCircle,
  FaSchool,
  FaShoppingBag,
  FaSquare,
} from "react-icons/fa";
import { MdPersonSearch } from "react-icons/md";
import SearchBar from "./SearchBar";

export default function Section1() {
  return (
    <section
      className="flex flex-col items-center justify-center pt-32 lg:pt-30 pb-8 px-4 sm:px-6 lg:px-8 bg-transparent relative overflow-hidden "
      style={{ maxHeight: "100vh" }}
    >
      {/* Sign Up/Login Button - Moved to top */}
      <div className="w-full flex justify-center mb-4 relative z-10">
        <Link href="/login">
          <button className="text-lg sm:text-xl font-semibold rounded-full bg-gradient-to-r from-myred-dark to-myred text-white px-12 py-3 shadow-lg hover:shadow-myred/50 focus:outline-none relative overflow-hidden group">
            <span className="relative z-10">Sign Up / Login</span>
            <span className="absolute inset-0 bg-gradient-to-r from-myred to-myred-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </Link>
      </div>

      {/* Search Bar - Made wider */}
      <div
        className="w-full px-4 relative z-20 flex justify-center mb-8"
        style={{ maxWidth: "800px" }}
      >
        <div className="w-full z-10">
          <SearchBar />
        </div>
      </div>

      {/* Navigation Menu - Made more compact */}
      <div className="w-full max-w-5xl bg-gray-800/70 backdrop-blur-md rounded-xl shadow-lg border border-myred/30 px-4 py-3 mb-8 overflow-hidden relative z-10 hover:border-myred/50 transition-all duration-300 min-h-[80px]">
        <ul className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs sm:text-sm md:text-base font-medium text-gray-100 whitespace-nowrap">
          {[
            { href: "/courses", icon: <FaSquare />, text: "All Courses" },
            { href: "/", icon: <FaHome />, text: "Home" },
            {
              href: "/courses/admission",
              icon: <FaGraduationCap />,
              text: "Admission",
            },
            {
              href: "/courses/class%209-12",
              icon: <FaSchool />,
              text: "9-12 Academic",
            },
            {
              href: "/courses/job%20preparation",
              icon: <MdPersonSearch />,
              text: "Job preparation",
            },
            {
              href: "/dashboard/free-classes",
              icon: <CiVideoOn />,
              text: "Free Classes",
            },
            {
              href: "/courses/class%209-12",
              icon: <BsBullseye />,
              text: "Target SSC 25",
            },
            {
              href: "/courses/class%209-12",
              icon: <BsBullseye />,
              text: "Target HSC 25",
            },
            {
              href: "/materials",
              icon: <FaShoppingBag />,
              text: "Suvash Shop",
            },
            { href: "/blog", icon: <FaBlog />, text: "Blog" },
            { href: "/about", icon: <FaInfoCircle />, text: "About Us" },
          ].map((item, index) => (
            <Link href={item.href} key={index}>
              <li className="flex items-center gap-1 border-r border-myred/30 pr-2 hover:text-myred-secondary active:text-myred transition-colors duration-200 group">
                <span className="text-gray-400 group-hover:text-myred-secondary transition-colors duration-200 text-sm">
                  {item.icon}
                </span>
                {item.text}
              </li>
            </Link>
          ))}
        </ul>
      </div>

      {/* Hero Text - Made more compact */}
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-100 mb-8 px-4 max-w-4xl leading-tight relative z-10">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-myred to-myred-secondary font-extrabold">
          {`"From academics to admission"`}
        </span>{" "}
        <br />
        <span className="text-gray-300">Journey with Suvash Edu</span>
      </h1>

      {/* Buttons - Made more compact */}
      <div className="flex flex-col sm:flex-row gap-4 relative z-10">
        <Link href="/courses">
          <button className="relative w-full uppercase px-8 py-3 bg-gradient-to-r from-myred-dark to-myred text-white text-base sm:text-lg font-bold rounded-full shadow-lg hover:shadow-myred/50 focus:outline-none group overflow-hidden">
            <span className="relative z-10">Check all courses</span>
            <span className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-myred-secondary to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="absolute inset-0 bg-gradient-to-r from-myred to-myred-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </Link>
        <Link href="https://www.youtube.com/@Suvash.Edu.B/videos">
          <button className="uppercase px-8 py-3 bg-gradient-to-r from-myred to-myred-secondary text-white text-base sm:text-lg font-bold rounded-full shadow-lg hover:shadow-myred/50 focus:outline-none flex items-center gap-2 relative overflow-hidden group">
            <span className="relative z-10 flex items-center gap-2">
              <FaGraduationCap className="text-sm" /> Watch Free Classes
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-myred-dark to-myred opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </Link>
      </div>
    </section>
  );
}
