import { BsJournalBookmarkFill } from "react-icons/bs";
import { GiTeacher } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";

async function getData() {
  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/get-homepage-data`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data || null;
  } catch (err) {
    console.error("Failed to fetch homepage data:", err.message);
    return null;
  }
}

export default async function Section2() {
  const data = await getData();

  if (!data) {
    return (
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="text-center text-gray-400">
          Unable to load statistics at this time. Please try again later.
        </div>
      </section>
    );
  }

  const statsCards = [
    {
      id: 1,
      icon: <IoIosPeople className="text-4xl" />,
      text: `${data.studentCount}+ students`,
      description: "Join our growing community of learners",
    },
    {
      id: 2,
      icon: <GiTeacher className="text-4xl" />,
      text: `${data.staffCount} teachers and moderators`,
      description: "Learn from certified experts",
    },
    {
      id: 3,
      icon: <BsJournalBookmarkFill className="text-4xl" />,
      text: `${data.materialCount}+ learning materials`,
      description: "Comprehensive educational resources",
    },
  ];

  return (
    <section className="py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsCards.map((card) => (
            <div
              key={card.id}
              className="group relative bg-gray-800 rounded-xl shadow-lg hover:shadow-myred/50 transition-all duration-300 overflow-hidden border border-myred/50"
            >
              <div className="p-8 flex flex-col items-center text-center">
                <div className="mb-6 w-20 h-20 rounded-full bg-myred/10 text-myred-secondary flex items-center justify-center group-hover:bg-myred-secondary group-hover:text-white transition-colors duration-300">
                  {card.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-100 mb-2">
                  {card.text}
                </h3>
                <p className="text-gray-400 normal-case">{card.description}</p>
                <div className="mt-6 w-12 h-1 bg-myred-secondary group-hover:bg-myred group-hover:w-20 transition-all duration-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}