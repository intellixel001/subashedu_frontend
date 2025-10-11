import { BsJournalBookmarkFill } from "react-icons/bs";
import { GiTeacher } from "react-icons/gi";
import { IoIosPeople } from "react-icons/io";
import Section2Client from "./Section2Client";

type StatsData = {
  studentCount: number;
  staffCount: number;
  materialCount: number;
};

async function getData(): Promise<StatsData | null> {
  try {
    const res = await fetch(`${process.env.SERVER_URL}/api/get-homepage-data`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    return result.data || null;
  } catch (err) {
    console.error("Failed to fetch homepage data:", (err as Error).message);
    return null;
  }
}

export default async function Section2Server() {
  const data = await getData();

  if (!data) {
    return (
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-white to-blue-50">
        <div className="text-center text-gray-500">
          তথ্য লোড করতে ব্যর্থ হয়েছে। অনুগ্রহ করে পরে চেষ্টা করুন।
        </div>
      </section>
    );
  }

  const statsCards = [
    {
      id: 1,
      icon: <IoIosPeople className="text-4xl text-white" />,
      value: data.studentCount,
      label: "ছাত্রছাত্রী",
      description: "আমাদের শিক্ষার্থীদের সাথে যোগ দিন",
      gradient: "bg-gradient-to-r from-blue-400 to-purple-400",
    },
    {
      id: 2,
      icon: <GiTeacher className="text-4xl text-white" />,
      value: data.staffCount,
      label: "শিক্ষক ও মডারেটর",
      description: "সার্টিফাইড এক্সপার্টদের থেকে শিখুন",
      gradient: "bg-gradient-to-r from-green-400 to-teal-400",
    },
    {
      id: 3,
      icon: <BsJournalBookmarkFill className="text-4xl text-white" />,
      value: data.materialCount,
      label: "সিক্ষার উপকরণ",
      description: "সবধরনের শিক্ষামূলক উপকরণ",
      gradient: "bg-gradient-to-r from-pink-400 to-red-400",
    },
  ];

  return <Section2Client statsCards={statsCards} />;
}
