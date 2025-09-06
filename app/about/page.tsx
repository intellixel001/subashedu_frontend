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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold text-myred mb-8 text-center">
          About Suvash Edu
        </h1>
        <div className="w-full flex flex-col lg:flex-row gap-8 items-center">
          <div className="flex-1">
            <p className="text-lg text-gray-700 mb-4">
              {` ২০২৩ সাল থেকে বাংলাদেশের আধুনিক শিক্ষা প্রতিষ্ঠান "Suvash Edu." সবার
              জন্য শিক্ষা নিশ্চত এই প্রত্যাশা নিয়ে "Suvash Edu." এর অগ্রযাত্রা।`}
            </p>
            <p className="text-lg text-gray-700 mb-4">
              আমরা বিশ্বাস করি যে শিক্ষা হল সবচেয়ে শক্তিশালী হাতিয়ার যা দিয়ে
              আপনি পৃথিবী বদলে দিতে পারেন। আমাদের লক্ষ্য হল মানসম্মত শিক্ষা সবার
              কাছে সহজলভ্য করা।
            </p>
            <button className="bg-myred text-white px-6 py-3 rounded-md hover:bg-myred/90 transition-colors duration-200">
              আমাদের কোর্সগুলো দেখুন
            </button>
          </div>
          <div className="flex-1 w-full h-96 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/about-hero.jpg"
              alt="Suvash Edu students"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold text-myred mb-8 text-center">
          Our Mission
        </h1>
        <div className="w-full flex flex-col lg:flex-row-reverse gap-8 items-center">
          <div className="flex-1">
            <p className="text-lg text-gray-700 mb-4">
              Suvash Edu-এর মূল লক্ষ্য হল বাংলাদেশের প্রত্যন্ত অঞ্চল পর্যন্ত
              মানসম্মত শিক্ষা পৌঁছে দেওয়া। আমরা চাই প্রতিটি শিক্ষার্থী তাদের
              পূর্ণ সম্ভাবনা বিকাশ করতে সক্ষম হোক।
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FaGraduationCap className="text-myred text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">গুণগত শিক্ষা</h3>
                  <p className="text-gray-600">
                    আমাদের বিশেষজ্ঞ শিক্ষকদের দ্বারা উন্নত মানের শিক্ষা প্রদান
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MdOutlineScience className="text-myred text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">আধুনিক পদ্ধতি</h3>
                  <p className="text-gray-600">
                    ডিজিটাল প্ল্যাটফর্মের মাধ্যমে ইন্টারেক্টিভ শিখন পদ্ধতি
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MdOutlineSchool className="text-myred text-2xl mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">
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
              src="/mission.jpg"
              alt="Suvash Edu mission"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-20  py-12 rounded-xl">
        <h1 className="text-4xl font-bold text-myred mb-12 text-center">
          Our Achievements
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 bg-gray-50 shadow-md">
            <FaUsers className="text-5xl text-myred mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">1500+</h3>
            <p className="text-gray-600">সন্তুষ্ট শিক্ষার্থী</p>
          </div>
          <div className="p-6 bg-gray-50 shadow-md">
            <FaChalkboardTeacher className="text-5xl text-myred mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">50+</h3>
            <p className="text-gray-600">অভিজ্ঞ শিক্ষক</p>
          </div>
          <div className="p-6 bg-gray-50 shadow-md">
            <FaBookOpen className="text-5xl text-myred mx-auto mb-4" />
            <h3 className="text-3xl font-bold mb-2">30+</h3>
            <p className="text-gray-600">কোর্স সমূহ</p>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold text-myred mb-8 text-center">
          Our Gallery
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 row-span-2 h-96 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/gallery-1.jpg"
              alt="Classroom session"
              fill
              className="object-cover"
            />
          </div>
          <div className="h-48 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/gallery-2.jpg"
              alt="Students studying"
              fill
              className="object-cover"
            />
          </div>
          <div className="h-48 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/gallery-3.jpg"
              alt="Teacher explaining"
              fill
              className="object-cover"
            />
          </div>
          <div className="h-48 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/gallery-4.jpg"
              alt="Group discussion"
              fill
              className="object-cover"
            />
          </div>
          <div className="h-48 relative rounded-lg overflow-hidden shadow-lg">
            <Image
              src="/gallery-5.jpg"
              alt="Award ceremony"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* CEO Section */}
      <section className="bg-myred/10 p-8 rounded-xl">
        <h1 className="text-4xl font-bold text-myred mb-8 text-center">
          From Our CEO
        </h1>
        <div className="flex flex-col lg:flex-row gap-8 items-center">
          <div className="w-64 h-64 relative rounded-full overflow-hidden border-4 border-myred shadow-lg mx-auto lg:mx-0">
            <Image
              src="/ceo.jpg"
              alt="CEO of Suvash Edu"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <div className="relative">
              <FaQuoteLeft className="text-myred text-4xl opacity-20 absolute -top-4 -left-2" />
              <p className="text-lg text-gray-700 mb-4 pl-8">
                Suvash Edu প্রতিষ্ঠার পিছনে আমার মূল উদ্দেশ্য ছিল বাংলাদেশের
                প্রতিটি শিক্ষার্থীর কাছে মানসম্মত শিক্ষা পৌঁছে দেওয়া। আমরা
                বিশ্বাস করি প্রতিটি শিশুরই সমান শিক্ষার অধিকার রয়েছে। আমাদের
                টিম প্রতিদিন এই লক্ষ্য নিয়ে কাজ করে যাচ্ছে।
              </p>
            </div>
            <div className="text-right">
              <h3 className="font-bold text-xl">Mr XYZ</h3>
              <p className="text-gray-600">প্রতিষ্ঠাতা ও সিইও, Suvash Edu</p>
              <div className="flex gap-2 justify-end mt-2">
                <FaAward className="text-myred" />
                <span className="text-sm">
                  শিক্ষা ক্ষেত্রে রাষ্ট্রীয় পুরস্কার প্রাপ্ত
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
