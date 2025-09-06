
import { FaBook, FaChalkboardTeacher, FaClipboardCheck, FaLaptopCode, FaLightbulb, FaQuestionCircle } from "react-icons/fa";

export default function Section11() {
  const services = [
    {
      id: 1,
      icon: <FaLaptopCode className="text-2xl" />,
      title: "Online Program",
      description: "Interactive live and recorded classes"
    },
    {
      id: 2,
      icon: <FaChalkboardTeacher className="text-2xl" />,
      title: "Experienced Teacher",
      description: "Learn from industry experts"
    },
    {
      id: 3,
      icon: <FaBook className="text-2xl" />,
      title: "Study Materials",
      description: "Comprehensive learning resources"
    },
    {
      id: 4,
      icon: <FaLightbulb className="text-2xl" />,
      title: "Concept Based Class",
      description: "Focus on fundamental understanding"
    },
    {
      id: 5,
      icon: <FaClipboardCheck className="text-2xl" />,
      title: "Unique Exam System",
      description: "Regular assessments for progress"
    },
    {
      id: 6,
      icon: <FaQuestionCircle className="text-2xl" />,
      title: "Q&A Service",
      description: "Get your doubts resolved instantly"
    },
  ];

  return (
    <section className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
            <span className="text-myred-secondary">Overview</span> of All Services
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Comprehensive educational solutions tailored for your success
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className="bg-gray-800 rounded-xl shadow-md hover:shadow-myred/50 transition-shadow duration-300 border border-myred/50 overflow-hidden group"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-myred/10 text-myred-secondary rounded-full flex items-center justify-center mb-6 group-hover:bg-myred-secondary group-hover:text-white transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">{service.title}</h3>
                <p className="text-gray-400 text-sm">{service.description}</p>
                <div className="mt-4 w-8 h-1 bg-myred-secondary group-hover:bg-myred group-hover:w-16 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
