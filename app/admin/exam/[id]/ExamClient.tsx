"use client";

import { useEffect, useState } from "react";
import ManageNotice from "../examComponents/ManageNotice";
import ManageQuestions from "../examComponents/ManageQuestions";
import ManageSyllabus from "../examComponents/ManageSyllabus";
import { examSections } from "../examDb/examSubject";

export default function ExamClient({ id }: { id: string }) {
  const [examObj, setExamObj] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [questions, setQuestions] = useState(null);
  const [selectTab, setSelectTab] = useState("Questions");
  const fetchExam = async (examId: string) => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/get/${examId}`;
      const res = await fetch(endpoint, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData?.message || "Failed to fetch exam data");
      }

      const data = await res.json();
      setExamObj(data?.data || null);
      setQuestions(data?.questions || []);
    } catch (error) {
      console.error("❌ Exam fetch failed:", error);
      setErrorMsg(error.message || "Something went wrong while loading exam");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchExam(id);
  }, [id]);

  //   if (!id) {
  //     router.push("/admin/exam");
  //   }

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md mx-auto mt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-gray-800">
          {examObj
            ? `${examObj.name} > ${
                examSections.find((c) => +c.id === +examObj.class)?.name
              } > ${
                examSections
                  .find((c) => +c.id === +examObj.class)
                  ?.items?.find((s) => +s.id === +examObj.subject)?.title ||
                examObj.subject
              } > ${examObj.type}`
            : "Exam Details"}
        </h1>

        <button
          onClick={() => fetchExam(id)}
          disabled={loading}
          className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Status/Error */}
      {loading && (
        <div className="text-gray-500 animate-pulse">Loading exam data...</div>
      )}

      {errorMsg && (
        <div className="p-3 mb-3 rounded-md bg-red-50 text-red-600 border border-red-200">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Main Buttons */}
      {!loading && !errorMsg && examObj && (
        <>
          <div className="flex flex-wrap gap-2 mb-6">
            {["Questions", "Enrolled Users", "Syllabus", "Notice"].map(
              (label) => (
                <button
                  onClick={() => setSelectTab(label)}
                  key={label}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200
              ${
                selectTab === label
                  ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                  : "text-gray-700 border-gray-200 hover:bg-gray-100 active:bg-gray-200"
              }`}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {selectTab === "Questions" && (
            <ManageQuestions questions={questions} examObj={examObj} />
          )}

          {selectTab === "Syllabus" && <ManageSyllabus examObj={examObj} />}

          {selectTab === "Notice" && <ManageNotice examObj={examObj} />}
        </>
      )}
    </div>
  );
}
