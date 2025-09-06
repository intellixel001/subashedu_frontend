"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaUserGraduate,
} from "react-icons/fa";

// Define the Invoice type based on the backend response
interface Invoice {
  _id: string;
  studentId: {
    _id: string;
    fullName: string;
    email: string;
    registrationNumber: string;
  };
  courseId: {
    _id: string;
    title: string;
    price: number;
    thumbnailUrl?: string | null;
    courseFor: string;
  };
  paymentMethod: string;
  mobileNumber: string;
  transactionId: string;
  amount: number;
  status: string;
  createdAt: string;
}

const Invoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [noInvoices, setNoInvoices] = useState(false); // New state for empty collection
  const [searchTerm, setSearchTerm] = useState("");

  // Ensure environment variable is defined
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Fetch invoices
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await fetch(`${serverUrl}/api/admin/get-invoices`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          if (response.status === 404) {
            // Handle empty collection case
            setNoInvoices(true);
            setLoading(false);
            return;
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.success || !data.data) {
          throw new Error(data.message || "No invoice data received");
        }
        setInvoices(data.data);
        setLoading(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err.message || "Error fetching invoices");
        setLoading(false);
      }
    };
    fetchInvoices();
  }, [serverUrl]);

  // Filter invoices based on search term with safe checks
  const filteredInvoices = invoices.filter((invoice) => {
    try {
      const studentName = invoice.studentId?.fullName || "";
      const registrationNumber = invoice.studentId?.registrationNumber || "";
      const courseTitle = invoice.courseId?.title || "";
      const transactionId = invoice.transactionId || "";

      return (
        studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    } catch (err) {
      console.warn("Invalid invoice data:", invoice, err);
      return false; // Exclude problematic invoices from display
    }
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-[#f7374f] mb-4" />
        <p className="text-lg text-gray-600">Loading invoices...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <FaExclamationTriangle className="text-4xl mb-4" />
        <p className="text-lg font-medium mb-2">Error loading invoices</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-questrial">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="bg-[#f7374f] p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <FaMoneyBillWave className="text-3xl" />
            Invoices Portal
          </h1>
          <p className="mt-2 opacity-90">
            View all payment invoices for Suvash Edu courses
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by student, registration, course, or transaction..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#f7374f] focus:border-[#f7374f] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="bg-[#f7374f]/10 text-[#f7374f] px-4 py-2 rounded-lg border border-[#f7374f]/20">
              Total Invoices: <span className="font-bold">{invoices.length}</span>
            </div>
          </div>

          {noInvoices || filteredInvoices.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaExclamationTriangle className="mx-auto text-5xl text-yellow-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                {searchTerm ? "No matching invoices found" : "No invoices found"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try a different search term"
                  : "No payment invoices have been recorded yet"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-700">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Student</th>
                    <th scope="col" className="px-6 py-3">Course</th>
                    <th scope="col" className="px-6 py-3">Payment Method</th>
                    <th scope="col" className="px-6 py-3">Transaction ID</th>
                    <th scope="col" className="px-6 py-3">Amount</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-[#f7374f]/10 p-2 rounded-full text-[#f7374f]">
                            <FaUserGraduate />
                          </div>
                          <div>
                            <p className="font-medium">
                              {invoice.studentId?.fullName || "Unknown Student"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {invoice.studentId?.registrationNumber || "N/A"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {invoice.studentId?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={
                              invoice.courseId?.thumbnailUrl ||
                              "/course-placeholder.jpg"
                            }
                            alt={invoice.courseId?.title || "Unknown Course"}
                            width={40}
                            height={40}
                            className="object-cover rounded-lg"
                          />
                          <div>
                            <p className="font-medium">
                              {invoice.courseId?.title || "Unknown Course"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {invoice.courseId?.courseFor || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {invoice.paymentMethod === "nagad" ? (
                            <Image
                              src="/Nagad.PNG"
                              alt="Nagad"
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : invoice.paymentMethod === "bkash" ? (
                            <Image
                              src="/Bkash.PNG"
                              alt="Bkash"
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          ) : (
                            <span>{invoice.paymentMethod || "N/A"}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {invoice.transactionId || "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        ৳{invoice.amount || 0}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            invoice.status === "verified"
                              ? "bg-green-100 text-green-800"
                              : invoice.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {invoice.status || "Unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {invoice.createdAt
                          ? new Date(invoice.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;