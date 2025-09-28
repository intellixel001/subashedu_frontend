"use client";
import { StudentModal } from "@/app/components/StudentModal";
import { StudentTableSkeleton } from "@/app/components/StudentSkeleton";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { FaEdit, FaSearch, FaTrash, FaUserPlus, FaUsers } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

interface Student {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  registrationNumber: string;
  educationLevel: string;
  institution: string;
  photoUrl?: string;
  createdAt: string;
  updatedAt: string;
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  sscYear: string;
  hscYear: string;
}

export default function ManageStudentPage() {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStudent, setCurrentStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState({
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    educationLevel: "",
    institution: "",
    fatherName: "",
    motherName: "",
    guardianPhone: "",
    sscYear: "na",
    hscYear: "na",
  });
  const [submittingLoading, setSubmittingLoading] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const isModalClosed = isModalOpen === false;
  const [allcourses, setAllCourses] = useState<any[]>([]);
  const [allclasses, setAllClasses] = useState<any[]>([]);

  useEffect(() => {
    async function getStudents() {
      try {
        setLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-students`,
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // Check if response is OK
        if (!response.ok) {
          throw new Error(
            `Student fetch failed: ${response.status} ${response.statusText}`
          );
        }

        // Parse JSON response
        let result;
        try {
          result = await response.json();
        } catch (error) {
          throw new Error(
            "Received non-JSON response from student API: ",
            error
          );
        }

        // Validate response structure
        if (
          !result ||
          typeof result !== "object" ||
          !Array.isArray(result.data)
        ) {
          throw new Error("Invalid response structure from student API");
        }

        console.log(result.data);

        setStudents(result.data);
        setAllCourses(result.courses);
        setAllClasses(result.classess);
      } catch (error) {
        console.error("Error fetching students:", error);
        setStudents([]); // Ensure students is an array on error
      } finally {
        setLoading(false);
      }
    }
    getStudents();
  }, [isModalClosed]);

  const filteredStudents = (Array.isArray(students) ? students : []).filter(
    (student) => {
      // Search filter
      const matchesSearch =
        student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.registrationNumber
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      // Course filter
      const matchesCourse =
        !selectedCourse || student.enrolledCourses?.includes(selectedCourse);

      // Class filter
      const matchesClass =
        !selectedClass || student.classes?.includes(selectedClass);

      // Type filter
      const matchesType =
        !selectedType || student.educationLevel.toLowerCase() === selectedType;

      return matchesSearch && matchesCourse && matchesClass && matchesType;
    }
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent, photoFile?: File) => {
    e.preventDefault();
    setSubmittingLoading(true);

    try {
      const endpoint = currentStudent
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/update-student`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/create-student`;

      const formDataToSend = new FormData();

      // Append all fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      // For updates, password is optional
      if (currentStudent && !formData.password) {
        formDataToSend.delete("password");
        formDataToSend.delete("confirmPassword");
      }

      // Only append the file if it exists
      if (photoFile) {
        formDataToSend.append("avatar", photoFile);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result = await response.json();

      if (result.success) {
        setStudents((prev) =>
          currentStudent
            ? prev.map((student) =>
                student._id === currentStudent._id ? result.data : student
              )
            : [...prev, result.data]
        );
        setIsModalOpen(false);
        setFormData({
          _id: "",
          fullName: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
          educationLevel: "",
          institution: "",
          fatherName: "",
          motherName: "",
          guardianPhone: "",
          sscYear: "na",
          hscYear: "na",
        });
      } else {
        console.error("Error submitting form:", result.message);
        alert(result.message || "An error occurred");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form");
    } finally {
      setSubmittingLoading(false);
    }
  };

  const openEditModal = (student: Student) => {
    setCurrentStudent(student);
    setFormData({
      _id: student._id,
      fullName: student.fullName,
      email: student.email,
      phone: student.phone,
      password: "",
      confirmPassword: "",
      educationLevel: student.educationLevel,
      institution: student.institution,
      fatherName: student.fatherName,
      motherName: student.motherName,
      guardianPhone: student.guardianPhone,
      sscYear: student.sscYear === "na" ? "na" : student.sscYear,
      hscYear: student.hscYear === "na" ? "na" : student.hscYear,
    });
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setCurrentStudent(null);
    setFormData({
      _id: "",
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      educationLevel: "",
      institution: "",
      fatherName: "",
      motherName: "",
      guardianPhone: "",
      sscYear: "na",
      hscYear: "na",
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    setIsDeleting(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/delete-student`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ _id: id }),
        }
      );
      const result = await response.json();
      if (result.success) {
        setStudents(students.filter((student) => student._id !== id));
      } else {
        console.error("Error deleting student:", result.message);
        alert(result.message || "Failed to delete student");
      }
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("An error occurred while deleting the student");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="p-6">
      {/* Page header and controls */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaUsers className="mr-2" /> Student Management
        </h1>
        <button
          onClick={openCreateModal}
          className="bg-[#f7374f] hover:bg-[#d62e44] text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 cursor-pointer"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </span>
          ) : (
            <>
              <FaUserPlus className="mr-2" /> Add New Student
            </>
          )}
        </button>
      </div>

      {/* Search input */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search students by name, email or registration number..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-0 focus:ring-1 focus:ring-[#f7374f] focus:border-[#f7374f] disabled:opacity-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="mb-6 flex text-black flex-wrap gap-4 items-center">
        {/* Course Filter */}
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f7374f]"
        >
          <option value="">All Courses</option>
          {allcourses?.map((course: any) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>

        {/* Class Filter */}
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f7374f]"
        >
          <option value="">All Classes</option>
          {allclasses?.map((cls: any) => (
            <option key={cls._id} value={cls._id}>
              {cls.title}
            </option>
          ))}
        </select>

        {/* Type Filter (Education Level / Custom) */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-[#f7374f]"
        >
          <option value="">All Types</option>
          <option value="ssc">SSC</option>
          <option value="hsc">HSC</option>
          {/* Add more options if needed */}
        </select>
      </div>

      {/* Student table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            {/* Table headers */}
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Registration No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Education Level
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Institution
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table body */}
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <StudentTableSkeleton />
              ) : filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                          {student.photoUrl && student.photoUrl !== "" ? (
                            <Image
                              src={student.photoUrl}
                              alt={student.fullName}
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                              <FaUser className="text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {student.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {student.registrationNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-4 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-[#f7374f] bg-opacity-10 text-white">
                        {student.educationLevel.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 max-w-[100px] overflow-hidden text-ellipsis">
                      {student.institution}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(student)}
                        className="text-[#f7374f] hover:text-[#d62e44] mr-4 cursor-pointer"
                        disabled={loading}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setStudentToDelete(student._id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-900 cursor-pointer"
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {loading ? "Loading students..." : "No students found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Modal */}
      {isModalOpen && (
        <StudentModal
          currentStudent={currentStudent}
          setIsModalOpen={setIsModalOpen}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          submittingLoading={submittingLoading}
          years={years}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => !isDeleting && setIsDeleteDialogOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black opacity-[0.2]" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Confirm Student Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Are you sure you want to delete this student record? This
                      action cannot be undone and all associated data will be
                      permanently removed.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f7374f] focus:ring-offset-2"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isDeleting}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-[#f7374f] px-4 py-2 text-sm font-medium text-white hover:bg-[#d62e44] focus:outline-none focus:ring-2 focus:ring-[#f7374f] focus:ring-offset-2"
                      onClick={() => {
                        if (studentToDelete) {
                          handleDelete(studentToDelete);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentWatson, CharlieColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        "Delete Student"
                      )}
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
