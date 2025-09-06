/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  FaBook,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaSearch,
  FaSpinner,
  FaTrash,
  FaUserGraduate,
} from "react-icons/fa";

// Define the MaterialPayment type for TypeScript
interface MaterialPayment {
  _id: string;
  studentId: {
    fullName: string;
    email: string;
    registrationNumber: string;
  };
  materialId: {
    _id: string;
    title: string;
    price: number;
  };
  paymentMethod: "bkash" | "nagad";
  mobileNumber: string;
  transactionId: string;
  amount: number;
  status: "pending" | "verified" | "failed";
  createdAt: string;
}

interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalRequests: number;
  limit: number;
}

// Custom debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

const MaterialPaymentRequests = () => {
  const [payments, setPayments] = useState<MaterialPayment[]>([]);
  const [verificationSuccess, setVerificationSuccess] = useState<
    boolean | null
  >(null);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalRequests: 0,
    limit: 10,
  });
  const [initialLoading, setInitialLoading] = useState(true);
  const [tableLoading, setTableLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  // Ensure environment variable is defined
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Fetch material payment requests
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setTableLoading(true);
        const response = await fetch(
          `${serverUrl}/api/staff/get-material-payment-requests?page=${
            pagination.currentPage
          }&limit=${pagination.limit}&search=${encodeURIComponent(
            debouncedSearchTerm
          )}`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-cache",
            },
            cache: "no-store",
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (!data.data) {
          throw new Error("No payment data received");
        }
        setPayments(data.data);
        setPagination(data.pagination);
      } catch (err) {
        setError(err.message || "Error fetching payments");
      } finally {
        setInitialLoading(false);
        setTableLoading(false);
      }
    };
    fetchPayments();
  }, [pagination.currentPage, pagination.limit, debouncedSearchTerm, deleteSuccess]);

  const paginate = (pageNumber: number) => {
    setPagination((prev) => ({ ...prev, currentPage: pageNumber }));
  };

  // Verify payment function
  const verifyPayment = async (materialId: string, paymentId: string) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/staff/verify-material-payment/${materialId}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ paymentId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok)
        throw new Error(`Error verifying payment: ${res.statusText}`);
      const result = await res.json();
      if (result.success) {
        // Update the specific payment's status in the state
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment._id === paymentId
              ? { ...payment, status: "verified" }
              : payment
          )
        );
        setVerificationSuccess(true);
        setTimeout(() => setVerificationSuccess(null), 3000);
      } else {
        throw new Error(result.message || "Verification failed");
      }
    } catch (error) {
      console.error(error);
      setVerificationSuccess(false);
      setTimeout(() => setVerificationSuccess(null), 3000);
    }
  };

  const deletePayment = async (materialId: string, paymentId: string) => {
    try {
      const res = await fetch(
        `${serverUrl}/api/staff/delete-material-payment/${materialId}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ paymentId }),
          headers: { "Content-Type": "application/json" },
        }
      );
      if (!res.ok) throw new Error(`Error deleting payment: ${res.statusText}`);
      const result = await res.json();
      if (result.success) {
        setDeleteSuccess(true);
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
        setTimeout(() => setDeleteSuccess(null), 3000);
      } else {
        throw new Error(result.message || "Deletion failed");
      }
    } catch (error) {
      console.error(error);
      setDeleteSuccess(false);
      setTimeout(() => setDeleteSuccess(null), 3000);
    }
  };

  // Initial loading state for the entire page
  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-[#f7374f] mb-4" />
        <p className="text-lg text-gray-600">Loading payment requests...</p>
      </div>
    );
  }

  // Error state for the entire page
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <FaExclamationTriangle className="text-4xl mb-4" />
        <p className="text-lg font-medium mb-2">Error loading payments</p>
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
            Material Payment Requests
          </h1>
          <p className="mt-2 opacity-90">
            Manage payment requests for Suvash Edu materials
          </p>
        </div>

        <div className="p-6">
          {/* Success Messages */}
          {verificationSuccess === true && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
              <FaCheckCircle />
              Payment verified successfully!
            </div>
          )}
          {verificationSuccess === false && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-2">
              <FaExclamationTriangle />
              Failed to verify payment. Please try again.
            </div>
          )}
          {deleteSuccess === true && (
            <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
              <FaCheckCircle />
              Payment request deleted successfully!
            </div>
          )}
          {deleteSuccess === false && (
            <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-2">
              <FaExclamationTriangle />
              Failed to delete payment request. Please try again.
            </div>
          )}

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by student, registration, or material..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#f7374f] focus:border-[#f7374f] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Link href="/management/payment-verification">
                <button className="px-4 py-2 bg-[#f7374f] text-white rounded-lg hover:bg-[#e12d42] transition-colors">
                  Go Back
                </button>
              </Link>
              <div className="bg-[#f7374f]/10 text-[#f7374f] px-4 py-2 rounded-lg border border-[#f7374f]/20">
                Total:{" "}
                <span className="font-bold">{pagination.totalRequests}</span>{" "}
                requests
              </div>
            </div>
          </div>

          {tableLoading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-gray-50 rounded-lg">
              <FaSpinner className="animate-spin text-4xl text-[#f7374f] mb-4" />
              <p className="text-lg text-gray-600">
                Loading payment requests...
              </p>
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                {searchTerm
                  ? "No matching payment requests found"
                  : "No payment requests"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try a different search term"
                  : "No requests available"}
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {payments.map((payment) => (
                  <div
                    key={payment._id}
                    className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow text-sm"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">
                      {/* Student Info */}
                      <div className="bg-gray-50 p-5 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-[#f7374f]/10 p-3 rounded-full text-[#f7374f]">
                            <FaUserGraduate />
                          </div>
                          <h3 className="font-bold text-lg">
                            Student Information
                          </h3>
                        </div>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Name:</span>{" "}
                            {payment.studentId.fullName}
                          </p>
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {payment.studentId.email}
                          </p>
                          <p>
                            <span className="font-medium">Registration:</span>{" "}
                            {payment.studentId.registrationNumber}
                          </p>
                        </div>
                      </div>

                      {/* Material Info */}
                      <div className="p-5 border-b lg:border-b-0 lg:border-r border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-[#f7374f]/10 p-3 rounded-full text-[#f7374f]">
                            <FaBook />
                          </div>
                          <h3 className="font-bold text-lg">
                            Material Details
                          </h3>
                        </div>
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Title:</span>{" "}
                            {payment.materialId.title}
                          </p>
                          <p>
                            <span className="font-medium">Price:</span> ৳
                            {payment.materialId.price}
                          </p>
                        </div>
                      </div>

                      {/* Payment Info */}
                      <div className="p-5">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="bg-[#f7374f]/10 p-3 rounded-full text-[#f7374f]">
                            <FaMoneyBillWave />
                          </div>
                          <h3 className="font-bold text-lg">Payment Details</h3>
                        </div>
                        <div className="space-y-2 mb-4">
                          <p className="flex items-center gap-2">
                            <span className="font-medium">Method:</span>
                            {payment.paymentMethod === "nagad" ? (
                              <Image
                                src="/Nagad.PNG"
                                alt="Nagad"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            ) : payment.paymentMethod === "bkash" ? (
                              <Image
                                src="/Bkash.PNG"
                                alt="Bkash"
                                width={40}
                                height={40}
                                className="object-contain"
                              />
                            ) : (
                              payment.paymentMethod
                            )}
                          </p>
                          <p>
                            <span className="font-medium">Mobile:</span>{" "}
                            {payment.mobileNumber}
                          </p>
                          <p>
                            <span className="font-medium">Transaction ID:</span>{" "}
                            {payment.transactionId}
                          </p>
                          <p>
                            <span className="font-medium">Amount:</span> ৳
                            {payment.amount}
                          </p>
                          <p>
                            <span className="font-medium">Created At:</span>{" "}
                            {new Date(payment.createdAt).toLocaleString()}
                          </p>
                          <div className="flex items-center">
                            <span className="font-medium">Status:</span>
                            <span
                              className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                payment.status === "verified"
                                  ? "bg-green-100 text-green-800"
                                  : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              deletePayment(payment.materialId._id, payment._id)
                            }
                            className="w-1/2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <FaTrash /> Delete Request
                          </button>
                          <button
                            onClick={() =>
                              verifyPayment(payment.materialId._id, payment._id)
                            }
                            className={`w-1/2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 hover:shadow-lg transition-all flex items-center justify-center gap-2 ${
                              payment.status === "verified"
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            disabled={payment.status === "verified"}
                          >
                            <FaCheckCircle />{" "}
                            {payment.status === "verified"
                              ? "Verified"
                              : "Verify Payment"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex justify-center mt-4 gap-2">
                    <button
                      onClick={() => paginate(pagination.currentPage - 1)}
                      disabled={pagination.currentPage === 1}
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <span className="px-4 py-2">
                      {pagination.currentPage} / {pagination.totalPages}
                    </span>
                    <button
                      onClick={() => paginate(pagination.currentPage + 1)}
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MaterialPaymentRequests;