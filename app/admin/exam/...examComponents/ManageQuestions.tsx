"use client";

import { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { QuestionModal } from "./QuestionModal";

export default function ManageQuestions({ examObj, questions: questionsData }) {
  const [questions, setQuestions] = useState(questionsData);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading] = useState(false);

  // 🕒 Current time checks
  const now = new Date();
  const examStart = new Date(examObj.startDate);
  const examEnd = new Date(examStart.getTime() + 24 * 60 * 60 * 1000); // start + 24 hours

  const examNotStarted = examStart > now; // before start
  const showUpdateResultBtn = now > examEnd; // after +24h
  const [updayeAnswer, setUpdayeAnswer] = useState(null);

  // 🟢 Save (create or update)
  const handleSave = async (data) => {
    try {
      const isEdit = !!editData;
      const endpoint = isEdit
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/question/update/${data?.id}`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/question/create`;

      const payload = isEdit
        ? { ...data, type: data?.body?.toString() }
        : { ...data, examid: examObj._id };

      const res = await fetch(endpoint, {
        method: isEdit ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const resData = await res.json();
      if (!res.ok)
        throw new Error(resData?.message || "Failed to save question");

      if (isEdit) {
        setQuestions((prev) =>
          prev.map((q) => (q._id === resData.data._id ? resData.data : q))
        );
      } else {
        setQuestions((prev) => [...prev, resData.data]);
      }

      setEditData(null);
      setShowModal(false);
    } catch (error) {
      console.error("❌ Save Question Error:", error);
    }
  };

  // 🟢 Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this question?")) return;
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/question/delete/${id}`;
      const res = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to delete question");

      setQuestions((prev) => prev.filter((q) => q._id !== id));
    } catch (error) {
      console.error("❌ Delete Question Error:", error);
    }
  };

  const filteredQuestions = questions.filter((q) =>
    q.body.toLowerCase().includes(search.toLowerCase())
  );

  // 🧩 Update Result (custom action)
  const handleUpdateResult = () => {
    setUpdayeAnswer(questions);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      {/* {updayeAnswer && (
        <UpdateAnswerCom
          setUpdayeAnswer={setUpdayeAnswer}
          updayeAnswer={updayeAnswer}
        />
      )} */}
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          Total Questions: {questions.length}
        </h1>

        <div className="flex gap-2 items-center">
          <input
            type="text"
            placeholder="Search question..."
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {examNotStarted && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <FaPlus /> Add New
            </button>
          )}

          {/* {showUpdateResultBtn && (
            <button
              onClick={handleUpdateResult}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Update Result
            </button>
          )} */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-100 rounded-lg overflow-hidden">
          <thead className="bg-gray-100 text-gray-700 text-sm">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">Type</th>
              <th className="py-3 px-4 text-left">Question</th>
              <th className="py-3 px-4 text-left">Fields</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredQuestions.length ? (
              filteredQuestions.map((q, i) => (
                <tr
                  key={q._id}
                  className="border-t hover:bg-gray-50 transition text-sm"
                >
                  <td className="py-3 px-4">{i + 1}</td>
                  <td className="py-3 px-4">{q.type}</td>
                  <td className="py-3 px-4">{q.body}</td>
                  <td className="py-3 px-4">
                    {q.fields.map((f, idx) => (
                      <span
                        key={idx}
                        style={{
                          backgroundColor:
                            idx + 1 === +q?.answer ? "gray" : "transparent",
                          color: idx + 1 === +q?.answer ? "white" : "black",
                        }}
                        className="px-2 py-1 rounded-md text-xs mr-1 bg-gray-100 text-gray-700"
                      >
                        {f}
                      </span>
                    ))}
                  </td>
                  <td className="py-3 px-4 text-center flex gap-3 justify-center">
                    {examNotStarted && (
                      <>
                        <button
                          onClick={() => {
                            setEditData(q);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="py-6 text-center text-gray-500 text-sm"
                >
                  No questions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <QuestionModal
          onClose={() => {
            setShowModal(false);
            setEditData(null);
          }}
          onSave={handleSave}
          initialData={editData}
        />
      )}
    </div>
  );
}
