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
    <section className="relative py-16 px-4 sm:px-6 lg:px-20 bg-gradient-to-b from-blue-50 via-white to-blue-50 text-gray-900">
      <div className="container mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500">
            আমাদের সঙ্গে উন্নতি করুন
          </h2>
          <p className="text-gray-600 sm:text-lg md:text-xl max-w-2xl mx-auto">
            আপনার শিক্ষার যাত্রা এখানে শুরু হয়, শিখুন, চর্চা করুন, পরীক্ষা দিন
            এবং সফল হোন।
          </p>
        </div>

        {/* Feature Circles */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 justify-items-center items-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center group"
            >
              <div className="rounded-full w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center bg-gradient-to-tr from-blue-500 to-teal-400 text-white text-3xl sm:text-4xl md:text-5xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                {feature.icon}
              </div>
              <h3 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="mt-2 text-gray-600 text-sm sm:text-base max-w-xs">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
