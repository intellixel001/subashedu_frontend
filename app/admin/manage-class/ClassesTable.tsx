"use client";
import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

interface ClassItem {
  _id: string;
  title: string;
  subject?: string;
  instructor?: string;
  course?: { title: string; courseFor?: string }; // optional
  classFor?: string; // for free classes
  isLive?: boolean; // for live classes
}

interface ClassesTableProps {
  title: string;
  classes?: ClassItem[]; // can be undefined
  loading: boolean;
  onEdit: (cls: ClassItem) => void;
  onDelete: (id: string) => void;
  onStopLive?: (id: string) => void; // only for live classes
}

const ClassesTable: React.FC<ClassesTableProps> = ({
  title,
  classes = [],
  loading,
  onEdit,
  onDelete,
  onStopLive,
}) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">{title}</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  onClick={onStopLive}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Instructor
                </th>
                {title !== "Free Classes" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                )}
                {title === "Free Classes" && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Class For
                  </th>
                )}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading...
                  </td>
                </tr>
              ) : classes.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No {title.toLowerCase()} available
                  </td>
                </tr>
              ) : (
                classes.map((cls) => (
                  <tr key={cls._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {cls.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {cls.subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {cls.instructor || "Unknown"}
                    </td>
                    {title !== "Free Classes" && (
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {cls.course?.title || "-"}
                      </td>
                    )}
                    {title === "Free Classes" && (
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                        {cls.classFor?.toUpperCase() || "-"}
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                      {/* Go button for live classes */}
                      {cls.type === "live" && (
                        <button
                          onClick={() =>
                            window.open(
                              `/admin/manage-class/${cls._id}`,
                              "_blank"
                            )
                          }
                          className="text-blue-600 bg-yellow-800 px-4 cursor-pointer rounded-4xl mr-3 hover:text-blue-900 text-[20px]"
                          title="Go to Class"
                        >
                          Go Live
                        </button>
                      )}

                      {/* Edit button */}
                      <button
                        onClick={() => onEdit(cls)}
                        className="text-myred hover:text-myred-dark text-[20px]"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      {/* Delete button */}
                      <button
                        onClick={() => onDelete(cls._id)}
                        className="text-red-600 hover:text-red-900 text-[20px]"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClassesTable;
