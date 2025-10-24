"use client";

import { useState } from "react";
import CreateUpdateExam from "./...examComponents/CreateUpdateExam";
import ExamTable from "./...examComponents/ExamTable";

export default function Page() {
  const [createExamModal, setCreateExamModal] = useState<boolean>(false);
  const [currentExam, setCurrentExam] = useState(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // const [examData, setExamData] = useState({
  //   finishedExam: [],
  //   activeExam: [],
  // });

  const createExamHandler = async (payload) => {
    try {
      const endpoint = currentExam
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/update/${currentExam?._id}`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/create`;

      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setErrorMsg(errorData?.message);
        throw new Error(`Failed to ${currentExam ? "update" : "create"} exam`);
      }

      await res.json();

      // Close modal and reset current exam
      setCreateExamModal(false);
      setCurrentExam(null);
    } catch (error) {
      console.error("❌ Exam save failed:", error);
    }
  };

  return (
    <>
      <ExamTable
        // setExamData={setExamData}
        // exams={examData.activeExam.concat(examData.finishedExam)}
        onCreate={() => {
          setCurrentExam(null);
          setCreateExamModal(true);
        }}
        onEdit={(exam) => {
          setCurrentExam(exam);
          setCreateExamModal(true);
        }}
        onDelete={async (id) => {
          if (confirm("Are you sure you want to delete this exam?")) {
            await fetch(
              `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/delete-exam/${id}`,
              {
                method: "DELETE",
                credentials: "include",
              }
            );
          }
        }}
      />

      <CreateUpdateExam
        isOpen={createExamModal}
        onClose={() => {
          setCreateExamModal(false);
          setCurrentExam(null);
        }}
        onSubmit={createExamHandler}
        initialData={currentExam}
        errorMsg={errorMsg}
      />
    </>
  );
}
