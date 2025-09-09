"use client";
import { useAdminDashboard } from "@/context/adminDashboardContext";
import { motion, Variants } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaBook,
  FaChalkboard,
  FaChalkboardTeacher,
  FaSpinner,
  FaUsers,
} from "react-icons/fa";
import { FiBarChart2, FiPieChart } from "react-icons/fi";
import { useAdminContext } from "./context/AdminContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

const cardHover = {
  scale: 1.05,
  boxShadow: "0 15px 30px rgba(0, 0, 0, 0.15)",
};

export default function DashboardPage() {
  const { loading, roundedChartData } = useAdminContext();
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeContent, setNoticeContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { notice, setNotice } = useAdminDashboard();

  const handleCreateNotice = async () => {
    if (!noticeContent.trim()) {
      setError("Notice content cannot be empty");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/create-notice`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: noticeContent }),
        }
      );

      const data = await response.json();
      if (!data.success)
        throw new Error(data.message || "Failed to create notice");

      setNotice(noticeContent); // ✅ update context
      setNoticeContent("");
      setIsNoticeModalOpen(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while deleting the notice");
      }
    }
  };

  const handleDeleteNotice = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/delete-notice`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result = await res.json();
      if (!result.success)
        throw new Error(result.message || "Failed to delete notice");

      setNotice(""); // ✅ clear context
    } catch (err: unknown) {
      setError(err.message || "An error occurred while deleting the notice");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Fetch current notice on mount ---
  const getNotice = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-notice`,
        { credentials: "include" }
      );
      const data = await res.json();
      console.log(data);
      if (data.success && data.data) {
        setNotice(data.data[0].content);
      } else {
        setNotice("");
      }
    } catch (err) {
      console.error("Failed to fetch notice:", err);
      setError("Could not load current notice");
    }
  };

  useEffect(() => {
    if (!notice) {
      getNotice();
    }
  }, [notice]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-blue-100"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <FaSpinner className="text-4xl text-indigo-600 mb-4" />
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full min-h-screen px-0 py-4 md:px-4 md:py-6 lg:p-6 bg-gradient-to-br from-gray-50 to-blue-100"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-2"
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-3">
            Suvash Edu Dashboard
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Your advanced education management hub
          </p>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => setIsNoticeModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              Create Notice
            </button>
            <button
              onClick={handleDeleteNotice}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50"
              disabled={isSubmitting}
            >
              Delete Current Notice
            </button>
          </div>
        </motion.div>

        {/* Current Notice Display */}
        <div className="bg-white/70 backdrop-blur-lg p-4 rounded-xl shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            📢 Current Notice
          </h2>
          {notice ? (
            <p className="text-gray-700">{notice}</p>
          ) : (
            <p className="text-gray-400 italic">No active notice</p>
          )}
        </div>

        {/* Notice Creation Modal */}
        {isNoticeModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl p-6 w-full max-w-md"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Create New Notice
              </h2>
              <textarea
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                placeholder="Enter notice content..."
                className="w-full h-32 p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
              {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsNoticeModalOpen(false);
                    setNoticeContent("");
                    setError(null);
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNotice}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-2 mb-12"
        >
          {roundedChartData && (
            <>
              <DataCard
                title="Students"
                count={roundedChartData.studentCount}
                color="bg-gradient-to-br from-blue-500 to-indigo-600"
                icon={<FaUsers className="text-3xl" />}
                delay={0.1}
              />
              <DataCard
                title="Staffs"
                count={roundedChartData.staffCount}
                color="bg-gradient-to-br from-emerald-500 to-teal-600"
                icon={<FaChalkboardTeacher className="text-3xl" />}
                delay={0.2}
              />
              <DataCard
                title="Teachers"
                count={roundedChartData.teacherCount}
                color="bg-gradient-to-br from-emerald-500 to-teal-600"
                icon={<FaChalkboardTeacher className="text-3xl" />}
                delay={0.2}
              />
              <DataCard
                title="Courses"
                count={roundedChartData.courseCount}
                color="bg-gradient-to-br from-purple-500 to-pink-600"
                icon={<FaBook className="text-3xl" />}
                delay={0.3}
              />
              <DataCard
                title="Classes"
                count={roundedChartData.classCount}
                color="bg-gradient-to-br from-orange-500 to-rose-600"
                icon={<FaChalkboard className="text-3xl" />}
                delay={0.4}
              />
            </>
          )}
        </motion.div>

        {roundedChartData && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-2 md:gap-4 lg:gap-6"
          >
            <SummaryChart data={roundedChartData} />
            <RadialProgressChart data={roundedChartData} />
          </motion.div>
        )}
      </div>
    </motion.main>
  );
}

function DataCard({
  title,
  count,
  color,
  icon,
  delay = 0,
}: {
  title: string;
  count: number;
  color: string;
  icon: React.ReactNode;
  delay?: number;
}) {
  const [animatedCount, setAnimatedCount] = React.useState(0);

  useEffect(() => {
    let current = 0;
    const target = count;
    const increment = target / 30;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setAnimatedCount(target);
        clearInterval(timer);
      } else {
        setAnimatedCount(Math.floor(current));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [count]);

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay }}
      whileHover={cardHover}
      className="rounded-3xl overflow-hidden bg-white/30 backdrop-blur-lg border border-white/20 shadow-xl relative"
    >
      <div className={`absolute inset-0 ${color} opacity-10`}></div>
      <div className="absolute top-0 right-0 -mt-6 -mr-6 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"></div>
      <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm"></div>

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm font-semibold text-gray-800 uppercase tracking-wide">
              {title}
            </p>
            <motion.h3
              key={animatedCount}
              initial={{ scale: 1.1, opacity: 0.7 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="text-5xl font-extrabold text-gray-900 mt-2"
            >
              {animatedCount}
            </motion.h3>
          </div>
          <div
            className={`w-16 h-16 ${color} rounded-2xl flex items-center justify-center shadow-inner`}
          >
            <div className="text-white">{icon}</div>
          </div>
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, (animatedCount / 100) * 100)}%` }}
          transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
          className="mt-6 h-2 bg-gray-200/50 rounded-full overflow-hidden"
        >
          <div className={`${color} h-full rounded-full`}></div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SummaryChart({ data }) {
  const stats = [
    {
      name: "Students",
      value: data.studentCount,
      color: "bg-blue-500",
      icon: <FaUsers />,
    },
    {
      name: "Staff",
      value: data.staffCount,
      color: "bg-emerald-500",
      icon: <FaChalkboardTeacher />,
    },
    {
      name: "Courses",
      value: data.courseCount,
      color: "bg-purple-500",
      icon: <FaBook />,
    },
    {
      name: "Classes",
      value: data.classCount,
      color: "bg-orange-500",
      icon: <FaChalkboard />,
    },
  ];

  const maxValue = Math.max(...stats.map((stat) => stat.value));

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/50 backdrop-blur-lg rounded-3xl shadow-lg p-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiBarChart2 className="mr-2 text-indigo-600" />
          Overview Statistics
        </h2>
        <span className="text-sm text-gray-500 font-medium">Updated today</span>
      </div>

      <div className="space-y-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="space-y-2"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.color} flex items-center justify-center text-white mr-3 shadow-md`}
                >
                  {stat.icon}
                </div>
                <span className="text-gray-700 font-medium">{stat.name}</span>
              </div>
              <span className="font-semibold text-gray-900">{stat.value}</span>
            </div>

            <div className="h-3 bg-gray-100/50 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(stat.value / maxValue) * 100}%` }}
                transition={{
                  delay: 0.2 * index,
                  duration: 1,
                  ease: "easeOut",
                }}
                className={`h-full ${stat.color} rounded-full`}
              ></motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function RadialProgressChart({ data }) {
  const stats = [
    {
      name: "Students",
      value: data.studentCount,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      name: "Staff",
      value: data.staffCount,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      name: "Courses",
      value: data.courseCount,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      name: "Classes",
      value: data.classCount,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  const maxValue = Math.max(...stats.map((stat) => stat.value));

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white/50 backdrop-blur-lg rounded-3xl shadow-lg px-2 md:px-4 py-6 border border-white/20"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <FiPieChart className="mr-2 text-purple-600" />
          Distribution Analysis
        </h2>
        <span className="text-sm text-gray-500 font-medium">
          Relative percentages
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 md:gap-4">
        {stats.map((stat, index) => {
          const percentage = Math.round((stat.value / maxValue) * 100);

          return (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 * index }}
              className="flex flex-col items-center"
            >
              <div className={`${stat.bg} p-4 rounded-2xl mb-4 shadow-inner`}>
                <div className="relative w-24 h-24">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="3"
                    />
                    <motion.path
                      initial={{ strokeDasharray: "0, 100" }}
                      animate={{ strokeDasharray: `${percentage}, 100` }}
                      transition={{
                        duration: 1.2,
                        delay: 0.2 * index,
                        ease: "easeOut",
                      }}
                      d="M18 2.0845
                        a 15.9155 15.9155 0 0 1 0 31.831
                        a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      className={stat.color}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 * index + 0.5 }}
                      className={`text-xl font-bold ${stat.color}`}
                    >
                      {percentage}%
                    </motion.span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-700">{stat.name}</p>
              <p className="text-xs text-gray-500">{stat.value} total</p>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
