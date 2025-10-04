import {
  FaBook,
  FaChalkboardTeacher,
  FaClipboardCheck,
  FaLaptopCode,
  FaLightbulb,
  FaQuestionCircle,
} from "react-icons/fa";

export default function Section11() {
  const services = [
    {
      id: 1,
      icon: <FaLaptopCode className="text-2xl" />,
      title: "অনলাইন প্রোগ্রাম",
      description: "ইন্টারেক্টিভ লাইভ ও রেকর্ডেড ক্লাস",
    },
    {
      id: 2,
      icon: <FaChalkboardTeacher className="text-2xl" />,
      title: "অভিজ্ঞ শিক্ষক",
      description: "শিল্প বিশেষজ্ঞদের কাছ থেকে শিখুন",
    },
    {
      id: 3,
      icon: <FaBook className="text-2xl" />,
      title: "শিক্ষণ উপকরণ",
      description: "সম্পূর্ণ শিক্ষামূলক রিসোর্স",
    },
    {
      id: 4,
      icon: <FaLightbulb className="text-2xl" />,
      title: "ধারণা ভিত্তিক ক্লাস",
      description: "মূল ধারণার উপর জোর",
    },
    {
      id: 5,
      icon: <FaClipboardCheck className="text-2xl" />,
      title: "একক পরীক্ষা পদ্ধতি",
      description: "নিয়মিত মূল্যায়ন এবং অগ্রগতি ট্র্যাকিং",
    },
    {
      id: 6,
      icon: <FaQuestionCircle className="text-2xl" />,
      title: "প্রশ্ন ও উত্তর সেবা",
      description: "আপনার প্রশ্নের জন্য সঙ্গে সঙ্গে সমাধান",
    },
  ];

  return (
    <section className="w-full py-16 px-6 sm:px-12 lg:px-20 bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-500 mb-4">
            আমাদের <span className="text-myred-secondary">সেবাসমূহ</span>
          </h2>
          <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto">
            আপনার সাফল্যের জন্য আমাদের সম্পূর্ণ শিক্ষামূলক সমাধান
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden group"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-teal-400 text-white rounded-full flex items-center justify-center mb-6 text-2xl">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-500 text-sm">{service.description}</p>
                <div className="mt-4 w-8 h-1 bg-myred-secondary group-hover:bg-myred group-hover:w-16 transition-all duration-300 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
