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

// Individual StatCard section inside the big card
function StatCardSection({
  card,
  isLast,
}: {
  card: StatCard;
  isLast: boolean;
}) {
  const count = useCountUp(card.value);

  return (
    <div
      className={`flex-1 p-8 flex items-center text-left ${
        !isLast ? "border-b md:border-b-0 md:border-r border-gray-200" : ""
      }`}
    >
      <div
        className={`mr-4 w-16 h-16 rounded-full flex items-center justify-center ${card.gradient}`}
      >
        {card.icon}
      </div>
      <div>
        <div className="flex items-center">
          <h3 className="text-3xl mr-2 sm:text-4xl font-bold text-gray-900">
            {count}+
          </h3>
          <h4 className="text-xl font-semibold text-gray-700">{card.label}</h4>
        </div>
        <div>
          <p className="text-gray-500 text-sm">{card.description}</p>
          <div
            className={`mt-2 w-16 h-1 rounded-full ${card.gradient} transition-all duration-300`}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default function Section2Client({ statsCards }: Props) {
  return (
    <section className="mt-[-70px] flex justify-center">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl flex flex-col md:flex-row overflow-hidden border border-gray-200">
        {statsCards.map((card, idx) => (
          <StatCardSection
            key={card.id}
            card={card}
            isLast={idx === statsCards.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
