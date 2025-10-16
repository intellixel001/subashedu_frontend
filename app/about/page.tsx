import Image from "next/image";
import {
  FaAward,
  FaBookOpen,
  FaChalkboardTeacher,
  FaGraduationCap,
  FaQuoteLeft,
  FaUsers,
} from "react-icons/fa";
import { MdOutlineSchool, MdOutlineScience } from "react-icons/md";

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-[#F2F4F7]">
      {/* Hero Section */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold text-[#F4A700] mb-8 text-center">
          সুভাস এডু সম্পর্কে জানুন
        </h1>
        <div className="w-full flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1">
            <p className="text-lg text-gray-700 mb-4">
              {`২০২৪ সাল থেকে "Suvash Edu" এডটেক হিসেবে যাত্রা শুরু করে। 
              আমরা একটি অনলাইন শিক্ষা প্ল্যাটফর্ম যা বাংলাদেশের শিক্ষার্থীদের জন্য মানসম্মত
               এবং সাশ্রয়ী মূল্যের শিক্ষা প্রদান করে আসছি। আমাদের লক্ষ্য হল প্রতিটি শিক্ষার্থীর 
               কাছে উন্নতমানের শিক্ষা পৌঁছে দেওয়া, বিশেষ করে যারা অর্থনৈতিকভাবে পিছিয়ে পড়েছে।
      `}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              আমরা বিশ্বাস করি যে শিক্ষা হল সবচেয়ে শক্তিশালী হাতিয়ার যা দিয়ে
              আপনি পৃথিবী বদলে দিতে পারেন। আমাদের লক্ষ্য হল মানসম্মত শিক্ষা সবার
              কাছে সহজলভ্য করা।
            </p>
            <button className="bg-[#F4A700] text-black px-6 py-3 rounded-md hover:bg-[#F4A700]/70 transition-colors duration-200">
              আমাদের কোর্সগুলো দেখুন
            </button>
          </div>
          <div className="flex-1 w-full h-96 relative rounded-lg overflow-hidden shadow-lg">
            <div className=" lg:w-full">
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
                    background:
                      "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45))",
                    zIndex: 1,
                  }}
                />
                <div className="relative z-10 overflow-hidden rounded-3xl bg-gradient-to-br from-white/5 to-white/2 border border-white/10 backdrop-blur-sm p-1 transition-transform transform hover:-translate-y-1">
                  <div className="rounded-2xl overflow-hidden bg-black/80">
                    <div
                      className="relative w-full"
                      style={{ paddingTop: "56.25%" }}
                    >
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
                          জানুন সুভাস এডু সম্পর্কে । আপনার মননের শিক্ষাকে জাগ্রত
                          করাই আমাদের উদ্দেশ্য ।
                        </h3>
                        <p className="mt-1 text-sm text-white/70">
                          SS Animation Studio • 2D / 3D
                        </p>
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
                            background:
                              "linear-gradient(90deg,#7c3aed,#ec4899)",
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
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold text-[#F4A700] mb-8 text-center">
          আমাদের লক্ষ্য ও উদ্দেশ্য
        </h1>
        <div className="w-full flex flex-col lg:flex-row-reverse gap-8 items-center">
          <div className="flex-1">
            <p className="text-lg text-gray-700 mb-4">
              Suvash Edu-এর মূল লক্ষ্য হল বাংলাদেশের প্রত্যন্ত অঞ্চল থেকে শুরু
              করে শহুরে আধুনিক অঞ্চল পর্যন্ত প্রতিটি শিক্ষার্থীর কাছে মানসম্মত
              শিক্ষা পৌঁছে দেওয়া। আমরা চাই প্রতিটি শিক্ষার্থী তাঁদের পূর্ণ
              সম্ভাবনা বিকাশ করতে সক্ষম হোক।
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FaGraduationCap className="text-[#F4A700] text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-[#F4A700] text-lg">
                    গুণগত শিক্ষা
                  </h3>
                  <p className="text-gray-600">
                    আমাদের বিশেষজ্ঞ শিক্ষকদের দ্বারা উন্নত মানের শিক্ষা প্রদান
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MdOutlineScience className="text-[#F4A700] text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-[#F4A700] text-lg">
                    আধুনিক পদ্ধতি
                  </h3>
                  <p className="text-gray-600">
                    ডিজিটাল প্ল্যাটফর্মের মাধ্যমে ইন্টারেক্টিভ শিক্ষা পদ্ধতি
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MdOutlineSchool className="text-[#F4A700] text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-[#F4A700] text-lg">
                    সুবিধাবঞ্চিতদের জন্য
                  </h3>
                  <p className="text-gray-600">
                    অর্থনৈতিকভাবে পিছিয়ে পড়া শিক্ষার্থীদের জন্য বিশেষ সুবিধা
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex-1 w-full h-96 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/one solution.jpg"
              alt="Suvash Edu students"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-20  py-12 rounded-xl">
        <h1 className="text-4xl font-bold text-[#F4A700] mb-12 text-center">
          আমাদের সাফল্যের গল্প
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-50 shadow-md">
            <FaUsers className="text-5xl text-[#F4A700] mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">1500+</h3>
            <p className="text-gray-600">সন্তুষ্ট শিক্ষার্থী</p>
          </div>
          <div className="p-6 bg-gray-50 shadow-md">
            <FaChalkboardTeacher className="text-5xl text-[#F4A700] mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">50+</h3>
            <p className="text-gray-600">অভিজ্ঞ শিক্ষক</p>
          </div>
          <div className="p-6 bg-gray-50 shadow-md">
            <FaBookOpen className="text-5xl text-[#F4A700] mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">30+</h3>
            <p className="text-gray-600">কোর্স সমূহ</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold text-[#F4A700] mb-8 text-center">
          আমাদের কিছু মুহূর্ত
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 row-span-2 h-96 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/one solution2.jpg"
              alt="Classroom session"
              fill
              className="object-cover"
            />
          </div>
          <div className="h-48 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/one solution3.png"
              alt="Students studying"
              fill
              className="object-cover"
            />
          </div>
          <div className="h-48 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/one solution4.png"
              alt="Teacher explaining"
              fill
              className="object-cover"
            />
          </div>
          <div className="h-48 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/one solution5.jpg"
              alt="Group discussion"
              fill
              className="object-cover"
            />
          </div>
          <div className="h-48 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/assets/one solution.jpg"
              alt="Award ceremony"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="bg-white p-8 rounded-xl">
        <h1 className="text-4xl font-bold text-[#F4A700] mb-8 text-center">
          আমাদের প্রতিষ্ঠাতা ও সিইও
        </h1>
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-64 h-64 relative rounded-full overflow-hidden border-4 border-myred shadow-lg mx-auto lg:mx-0">
            <Image
              src="/assets/image2.png"
              alt="CEO of Suvash Edu"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="relative">
              <FaQuoteLeft className="text-[#F4A700] text-4xl opacity-20 absolute -top-4 -left-2" />
              <p className="text-lg text-gray-700 mb-4 pl-8">
                Suvash Edu প্রতিষ্ঠার পিছনে আমার মূল উদ্দেশ্য ছিল বাংলাদেশের
                প্রতিটি শিক্ষার্থীর কাছে মানসম্মত শিক্ষা পৌঁছে দেওয়া। আমরা
                বিশ্বাস করি প্রতিটি শিশুরই সমান শিক্ষার অধিকার রয়েছে। আমাদের
                টিম প্রতিদিন এই লক্ষ্য নিয়ে কাজ করে যাচ্ছে।
              </p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-[#F4A700] text-xl">
                মোঃ আব্দুস শামীম সবুজ
              </h3>
              <p className="text-gray-600">প্রতিষ্ঠাতা ও সিইও, Suvash Edu</p>
              <div className="flex gap-2 justify-end mt-2">
                <FaAward className="text-[#F4A700]" />
                <span className="text-sm">
                  শিক্ষা ক্ষেত্রে ৭ বছরের ও বেশি অভিজ্ঞতা রয়েছে
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
