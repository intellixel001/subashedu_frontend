"use client";
import Image from "next/image";
import Link from "next/link"; // Import Link for navigation
import { useEffect, useState } from "react";
import {
  FaBook,
  FaCheckCircle,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaSearch,
  FaSpinner,
  FaTimes,
  FaTrash,
  FaUserGraduate,
} from "react-icons/fa";

// Define the Payment type for TypeScript
interface Payment {
  _id: string;
  student: {
    fullName: string;
    email: string;
    registrationNumber: string;
  };
  course: {
    title: string;
    price: number;
    courseFor: string;
    thumbnailUrl?: string;
    offer_price?: string;
  };
  paymentMethod: string;
  mobileNumber: string;
  transactionId: string;
  amount: number;
  status: string;
  studentId: string;
  courseId: string;
}

const PaymentVerification = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);

  // Ensure environment variable is defined
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

  // Fetch pending payments
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(
          `${serverUrl}/api/admin/get-pending-payments`,
          {
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
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
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching payments");
        setLoading(false);
      }
    };
    fetchPayments();
  }, [serverUrl]);

  // Handle payment verification
  const handleVerifyPayment = async () => {
    if (!currentPayment) return;

    try {
      const response = await fetch(`${serverUrl}/api/admin/verify-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          paymentId: currentPayment._id,
          studentId: currentPayment.studentId,
          courseId: currentPayment.courseId,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error verifying payment");
      }
      setPayments(
        payments.filter((payment) => payment._id !== currentPayment._id)
      );
      setSuccessMessage("Payment verified successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowConfirmation(false);
      setCurrentPayment(null);
    } catch (err) {
      setErrorMessage(err.message || "Error verifying payment");
      setTimeout(() => setErrorMessage(""), 5000);
      setShowConfirmation(false);
      setCurrentPayment(null);
    }
  };

  // Handle payment deletion
  const handleDeletePayment = async () => {
    if (!currentPayment) return;

    try {
      const response = await fetch(`${serverUrl}/api/admin/delete-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          paymentId: currentPayment._id,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error deleting payment");
      }
      setPayments(
        payments.filter((payment) => payment._id !== currentPayment._id)
      );
      setSuccessMessage("Payment request deleted successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
      setShowDeleteConfirmation(false);
      setCurrentPayment(null);
    } catch (err) {
      setErrorMessage(err.message || "Error deleting payment");
      setTimeout(() => setErrorMessage(""), 5000);
      setShowDeleteConfirmation(false);
      setCurrentPayment(null);
    }
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter(
    (payment) =>
      payment.student.fullName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.student.registrationNumber
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      payment.course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <FaSpinner className="animate-spin text-4xl text-[#f7374f] mb-4" />
        <p className="text-lg text-gray-600">Loading payment requests...</p>
      </div>
    );
  }

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
      {/* Verification Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Verification
            </h3>
            <p className="mb-6">
              Are you sure you want to verify this payment?
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setCurrentPayment(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleVerifyPayment}
                className="px-4 py-2 bg-[#f7374f] text-white rounded-lg hover:bg-[#e12d42] transition-colors"
              >
                Verify Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl animate-fade-in">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Confirm Deletion
            </h3>
            <p className="mb-6">
              Are you sure you want to delete this payment request? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirmation(false);
                  setCurrentPayment(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePayment}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {successMessage && (
        <div
          className={`fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50 ${
            successMessage.includes("verified")
              ? "bg-green-500 text-white"
              : "bg-red-600 text-white"
          }`}
        >
          <FaCheckCircle className="text-xl" />
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage("")}
            className="ml-auto text-white hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Error Toast */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in z-50">
          <FaExclamationTriangle className="text-xl" />
          <span>{errorMessage}</span>
          <button
            onClick={() => setErrorMessage("")}
            className="ml-auto text-white hover:text-gray-200"
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="bg-[#f7374f] p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <FaMoneyBillWave className="text-3xl" />
            Payment Verification Portal
          </h1>
          <p className="mt-2 opacity-90">
            Verify or delete student payment requests for Suvash Edu courses
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
                placeholder="Search by student, registration, or course..."
                className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-[#f7374f] focus:border-[#f7374f] transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="bg-[#f7374f]/10 text-[#f7374f] px-4 py-2 rounded-lg border border-[#f7374f]/20">
                Pending: <span className="font-bold">{payments.length}</span>{" "}
                payments
              </div>
              <Link href="/admin/payment-verification/invoices">
                <button className="px-4 py-2 bg-[#f7374f] text-white rounded-lg hover:bg-[#e12d42] transition-colors">
                  See Invoices
                </button>
              </Link>
              <Link href="/admin/payment-verification/material-payment-requests">
                <button className="px-4 py-2 bg-[#f7374f] text-white rounded-lg hover:bg-[#e12d42] transition-colors">
                  Material Payment Requests
                </button>
              </Link>
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaCheckCircle className="mx-auto text-5xl text-green-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                {searchTerm
                  ? "No matching payments found"
                  : "No pending payment requests"}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Try a different search term"
                  : "All payments are verified or deleted"}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPayments.map((payment) => (
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
                          {payment.student.fullName}
                        </p>
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {payment.student.email}
                        </p>
                        <p>
                          <span className="font-medium">Registration:</span>{" "}
                          {payment.student.registrationNumber}
                        </p>
                      </div>
                    </div>

                    {/* Course Info */}
                    <div className="p-5 border-b lg:border-b-0 lg:border-r border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="bg-[#f7374f]/10 p-3 rounded-full text-[#f7374f]">
                          <FaBook />
                        </div>
                        <h3 className="font-bold text-lg">Course Details</h3>
                      </div>
                      <div className="flex gap-4">
                        <Image
                          src={
                            payment.course.thumbnailUrl ||
                            "/course-placeholder.jpg"
                          }
                          alt={payment.course.title}
                          width={64}
                          height={64}
                          className="object-cover rounded-lg"
                        />
                        <div className="space-y-2">
                          <p>
                            <span className="font-medium">Title:</span>{" "}
                            {payment.course.title}
                          </p>
                          <p>
                            <span className="font-medium">Price:</span> ৳
                            {payment.course.offer_price}
                          </p>
                          <p>
                            <span className="font-medium">Category:</span>{" "}
                            {payment.course.courseFor}
                          </p>
                        </div>
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
                        <div className="flex items-center">
                          <span className="font-medium">Status:</span>
                          <span className="ml-2 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            {payment.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setCurrentPayment(payment);
                            setShowDeleteConfirmation(true);
                          }}
                          className="w-1/2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <FaTrash /> Delete Request
                        </button>
                        <button
                          onClick={() => {
                            setCurrentPayment(payment);
                            setShowConfirmation(true);
                          }}
                          className="w-1/2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] hover:shadow-lg transition-all flex items-center justify-center gap-2"
                        >
                          <FaCheckCircle /> Verify Payment
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;