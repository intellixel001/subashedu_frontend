
import {
  FaBookReader,
  FaGlobe,
  FaGraduationCap,
  FaUniversity,
  FaUsers,
} from "react-icons/fa";

export default function Section10() {
  const universities = [
    {
      id: 1,
      icon: <FaUniversity className="text-3xl" />,
      name: "DU",
      students: "1000+",
      description: "University of Dhaka",
    },
    {
      id: 2,
      icon: <FaGraduationCap className="text-3xl" />,
      name: "BUP",
      students: "5000+",
      description: "Bangladesh University of Professionals",
    },
    {
      id: 3,
      icon: <FaBookReader className="text-3xl" />,
      name: "JU",
      students: "2000+",
      description: "Jahangirnagar University",
    },
    {
      id: 4,
      icon: <FaGlobe className="text-3xl" />,
      name: "OTHER UNIVERSITIES",
      students: "3000+",
      description: "Nationwide institutions",
    },
  ];

  return (
    <section className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 mb-4">
            Discover the <span className="text-myred-secondary">Journey</span> Behind
            Our Success
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            Join thousands of students from top universities who have
            transformed their academic journey with us
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {universities.map((uni) => (
            <div
              key={uni.id}
              className="group relative bg-gray-800 rounded-xl shadow-lg hover:shadow-myred/50 transition-all duration-300 overflow-hidden border border-myred/50"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-myred/10 text-myred-secondary flex items-center justify-center mb-6 group-hover:bg-myred-secondary group-hover:text-white transition-colors duration-300">
                  {uni.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-100 mb-1">
                  {uni.name}
                </h3>
                <p className="text-gray-400 mb-4 text-sm">{uni.description}</p>
                <div className="flex items-center justify-center gap-2">
                  <FaUsers className="text-myred-secondary" />
                  <span className="text-3xl font-bold text-myred-secondary">
                    {uni.students}
                  </span>
                </div>
                <p className="text-gray-400 uppercase text-xs font-medium mt-1 tracking-wider">
                  Successful Students
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <button className="relative overflow-hidden bg-myred-dark text-gray-100 px-8 py-4 rounded-full font-bold text-lg hover:bg-myred hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-all duration-300 shadow-lg group">
            <span className="relative z-10 flex items-center justify-center gap-2">
              <FaUsers /> Join Our Community
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-myred-dark to-myred opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
        </div>
      </div>
    </section>
  );
}
