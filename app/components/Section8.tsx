"use client";
import { FaBookOpen, FaFileAlt, FaPencilRuler, FaTrophy } from "react-icons/fa";

export default function Section8() {
  const features = [
    {
      icon: <FaBookOpen />,
      title: "শিখুন",
      description: "আন্তরিক শিক্ষার মাধ্যমে দক্ষতা অর্জন করুন",
    },
    {
      icon: <FaPencilRuler />,
      title: "চর্চা করুন",
      description: "প্র্যাকটিসের মাধ্যমে নিজেকে শক্তিশালী করুন",
    },
    {
      icon: <FaFileAlt />,
      title: "পরীক্ষা",
      description: "পরীক্ষার মাধ্যমে মূল্যায়ন করুন আপনার উন্নতি",
    },
    {
      icon: <FaTrophy />,
      title: "সাফল্য",
      description: "সফলতার শিখরে পৌঁছান আমাদের সাহায্যে",
    },
  ];

  return (
    <section className="relative text-gray-900 px-4 sm:px-6 pb-10 lg:px-20">
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-gradient-to-br from-[#001F3F] via-[#18314a] to-[#001F3F] text-white rounded-[40px] p-10">
        {/* Left Column - Features */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex bg-white rounded-3xl shadow-2xl p-4 items-center space-x-4 group hover:shadow-3xl transition-shadow duration-300"
            >
              <div className="rounded-full text-blue-900 text-2xl sm:text-3xl md:text-4xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 group-hover:text-blue-500 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base md:text-lg">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column - Illustration */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <img
            src="/images/learning-illustration.png" // replace with your illustration
            alt="Learning Illustration"
            className="w-full max-w-md lg:max-w-lg rounded-3xl shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
