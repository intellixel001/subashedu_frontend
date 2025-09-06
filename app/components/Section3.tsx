
import Link from "next/link";
import { FaBookReader, FaBriefcase, FaGraduationCap } from "react-icons/fa";

export default function Section3() {
  const prepareCards = [
    {
      id: 1,
      icon: <FaBookReader className="text-3xl" />,
      title: "Academic 9th - 12th",
      description: "Comprehensive curriculum for excellence",
      link: "/courses/class%209-12",
    },
    {
      id: 2,
      icon: <FaGraduationCap className="text-3xl" />,
      title: "Admission 12+",
      description: "Guidance for top university placements",
      link: "/courses/admission",
    },
    {
      id: 3,
      icon: <FaBriefcase className="text-3xl" />,
      title: "Job Preparation",
      description: "Career-focused training and interview prep",
      link: "/courses/job%20preparation",
    },
  ];

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-100 uppercase tracking-tight">
            Prepare with the{" "}
            <span className="text-myred-secondary">Best Mentors</span>
          </h2>
          <p className="mt-4 text-lg text-gray-400 max-w-3xl mx-auto normal-case">
            Suvash Edu brings you industry-leading educators to guide your
            journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {prepareCards.map((card) => (
            <div
              key={card.id}
              className="group relative bg-gray-800 rounded-xl shadow-lg hover:shadow-myred/50 transition-all duration-300 overflow-hidden border border-myred/50"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="mb-6 w-20 h-20 rounded-full bg-myred/10 text-myred-secondary flex items-center justify-center group-hover:bg-myred-secondary group-hover:text-white transition-colors duration-300">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  {card.title}
                </h3>
                <p className="text-gray-400 normal-case">{card.description}</p>
                <div className="mt-6 w-12 h-1 bg-myred-secondary group-hover:bg-myred group-hover:w-20 transition-all duration-300"></div>
              </div>
              <div className="px-8 pb-8 text-center">
                <Link href={card.link}>
                  <button className="px-6 py-2 bg-myred-dark text-white rounded-lg bg-myred hover:bg-myred-secondary hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-all duration-300">
                    View Courses
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
