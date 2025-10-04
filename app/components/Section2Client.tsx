"use client";
import { ReactNode, useEffect, useState } from "react";

type StatCard = {
  id: number;
  icon: ReactNode;
  value: number;
  label: string;
  description: string;
  gradient: string;
};

type Props = {
  statsCards: StatCard[];
};

// Counter animation hook
function useCountUp(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = end / (duration / 30);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 30);
    return () => clearInterval(timer);
  }, [end, duration]);

  return count;
}

// Individual StatCard component
function StatCardComponent({ card }: { card: StatCard }) {
  const count = useCountUp(card.value); // ✅ Hook used at top level of component

  return (
    <div
      className="relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 cursor-pointer"
      onClick={() => console.log(`Clicked on ${card.label}`)}
    >
      <div className="p-8 flex flex-col items-center text-center">
        <div
          className={`mb-6 w-20 h-20 rounded-full flex items-center justify-center ${card.gradient}`}
        >
          {card.icon}
        </div>
        <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {count}+
        </h3>
        <h4 className="text-xl font-semibold text-gray-700 mb-2">
          {card.label}
        </h4>
        <p className="text-gray-500 text-sm">{card.description}</p>
        <div
          className={`mt-6 w-16 h-1 rounded-full ${card.gradient} transition-all duration-300`}
        ></div>
      </div>
    </div>
  );
}

export default function Section2Client({ statsCards }: Props) {
  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl sm:text-4xl font-extrabold text-gray-900 mb-12">
          আমাদের শিক্ষার পরিসংখ্যান
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {statsCards.map((card) => (
            <StatCardComponent key={card.id} card={card} />
          ))}
        </div>
      </div>
    </section>
  );
}
