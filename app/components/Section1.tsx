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
    <section className="relative flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-900 py-20 px-4 lg:px-0">
      {/* Hero Title */}
      <h1 className="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 max-w-4xl leading-tight">
        <span className="text-myred">আপনার শিক্ষার যাত্রা</span>
        <br />
        <span className="text-gray-700 font-semibold">
          সুবাশ এডুর সঙ্গে সফলতার পথে
        </span>
      </h1>

      {/* Hero Description */}
      <p className="text-center text-gray-600 text-sm sm:text-base mb-8 max-w-3xl">
        ভর্তি প্রস্তুতি থেকে চাকরি প্রস্তুতি পর্যন্ত সকল শিক্ষামূলক কোর্স, ফ্রি
        ক্লাস এবং প্রয়োজনীয় শিক্ষাসংক্রান্ত সম্পদগুলো এক জায়গায়। শিক্ষার্থীদের
        জন্য সহজ, দ্রুত এবং কার্যকরী।
      </p>

      {/* Navigation Pills */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        {navigationItems.map((item, idx) => (
          <Link
            href={item.href}
            key={idx}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-myred/10 transition-colors text-sm sm:text-base shadow-sm"
          >
            {item.icon}
            <span>{item.text}</span>
          </Link>
        ))}
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 z-10">
        <Link href="/courses">
          <button className="px-8 py-3 bg-gradient-to-r from-myred to-myred-secondary text-white font-bold rounded-full shadow-md hover:shadow-myred/50 transition-all">
            সমস্ত কোর্স দেখুন
          </button>
        </Link>
        <Link href="https://www.youtube.com/@Suvash.Edu.B/videos">
          <button className="px-8 py-3 bg-gradient-to-r from-myred-dark to-myred text-white font-bold rounded-full shadow-md hover:shadow-myred/50 transition-all flex items-center gap-2">
            <CiVideoOn /> ফ্রি ক্লাস দেখুন
          </button>
        </Link>
      </div>

      {/* Extra Info Section */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl w-full text-gray-700">
        <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold mb-2">ফ্রি ক্লাস</h3>
          <p>
            নির্দিষ্ট বিষয়গুলোতে ফ্রি ভিডিও ক্লাসের মাধ্যমে শিক্ষার্থীদের
            সহায়তা।
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold mb-2">ভর্তি প্রস্তুতি</h3>
          <p>প্রতিটি শিক্ষার্থীর জন্য ভর্তির প্রস্তুতির সমন্বিত কোর্স।</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl shadow hover:shadow-lg transition">
          <h3 className="font-bold mb-2">চাকরি প্রস্তুতি</h3>
          <p>প্রফেশনাল পরীক্ষার জন্য সম্পূর্ণ কোর্স ও প্র্যাকটিস সেট।</p>
        </div>
      </div>
    </section>
  );
}
