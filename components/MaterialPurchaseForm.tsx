/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FaArrowRight, FaBook, FaCheckCircle, FaMobileAlt, FaSpinner } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { MdPayment, MdVerified } from "react-icons/md";
import { RiLoader4Fill } from "react-icons/ri";
import { submitMaterialPayment } from "@/actions/submitMaterialPayment";
import Image from "next/image";

interface MaterialPurchaseFormProps {
  materialId: string;
}

export default function MaterialPurchaseForm({ materialId }: MaterialPurchaseFormProps) {
  const router = useRouter();
  const [material, setMaterial] = useState<any>(null);
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const initialState = { success: false, message: "", errors: [] };
  const [state, formAction, pending] = useActionState(
    async (prevState: any, formData: FormData) => {
      const result = await submitMaterialPayment(prevState, formData);
      if (result.success) {
        setSubmissionSuccess(true);
        setIsPaymentPending(true);
      }
      return result;
    },
    initialState
  );

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch material details
        const materialRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-material-for-purchase/${materialId}`,
          { cache: "no-store", credentials: "include" }
        );
        if (!materialRes.ok) {
          throw new Error("Failed to fetch material details");
        }
        const materialResult = await materialRes.json();
        if (!materialResult?.data) {
          throw new Error("Material data not found");
        }
        setMaterial(materialResult.data);

        // Fetch student details
        const studentRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/current-student`,
          { credentials: "include" }
        );
        if (!studentRes.ok) {
          if (studentRes.status === 401) {
            setNeedsLogin(true);
            return;
          }
          throw new Error("Failed to fetch student details");
        }
        const studentResult = await studentRes.json();
        if (!studentResult?.data?.student) {
          setNeedsLogin(true);
          return;
        }
        setStudent(studentResult.data.student);

        // Check for pending payment
        const paymentRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/material-payment-status/${materialId}`,
          { credentials: "include" }
        );
        if (paymentRes.ok) {
          const paymentResult = await paymentRes.json();
          setIsPaymentPending(paymentResult.data?.status === "pending");
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [materialId]);

  if (loading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 animate-pulse">
              <div className="absolute inset-0 bg-myred-dark rounded-full"></div>
              <RiLoader4Fill className="absolute inset-0 m-auto text-myred-secondary text-3xl animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-2">
            Loading Material Details
          </h2>
          <p className="text-gray-400 mb-6">Preparing your purchase experience</p>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-myred h-2.5 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </main>
    );
  }

  if (needsLogin || !student) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 bg-gradient-to-br from-myred-dark to-myred-secondary rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">
            Login Required
          </h2>
          <p className="text-gray-400 mb-6">
            You need to login to purchase this material
          </p>
          <Link href="/login">
            <button className="w-full bg-gradient-to-r from-myred-dark to-myred text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-myred/50">
              Continue to Login <FaArrowRight />
            </button>
          </Link>
          <p className="text-sm text-gray-500 mt-4">
            {`Don't have an account? You can register after clicking login`}
          </p>
        </div>
      </main>
    );
  }

  if (isPaymentPending || submissionSuccess) {
    return (
      <main className="pt-24 w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 bg-myred-dark/20 rounded-full flex items-center justify-center">
              <RiLoader4Fill className="text-myred-secondary text-4xl animate-spin" />
              <div className="absolute inset-0 border-4 border-myred-dark/30 border-t-myred-secondary rounded-full animate-spin"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">
            Payment Verification in Progress
          </h2>
          <p className="text-gray-400 mb-4">
            {`We're verifying your payment details. This usually takes a few hours.`}
          </p>
          <div className="bg-myred-dark/10 border border-myred-dark/30 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-myred-secondary">
              <MdVerified className="text-xl" />
              <span className="font-medium">Payment Under Review</span>
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-gradient-to-r from-myred-dark to-myred text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 hover:shadow-myred/50"
          >
            Go to Dashboard <FaArrowRight />
          </button>
          <p className="text-sm text-gray-500 mt-4">
            {`Please check back here or in your dashboard within a few hours.`}
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center p-8 bg-gray-800 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-gray-700">
          <div className="flex justify-center mb-6">
            <div className="relative w-24 h-24 bg-myred-dark/20 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-myred-secondary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-100 mb-3">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-gradient-to-r from-myred-dark to-myred text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 hover:shadow-myred/50"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Map errors to fields
  const errorMap = state.errors.reduce((acc: any, err: any) => {
    acc[err.path[0]] = err.message;
    return acc;
  }, {});

  return (
    <main className="w-full min-h-screen pb-12 pt-30 bg-gradient-to-br from-gray-900 to-gray-800">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          {/* Material Info Header */}
          <div className="flex flex-col md:flex-row border-b border-gray-700">
            <div className="relative w-full md:w-2/5 aspect-video bg-gray-900 flex items-center justify-center">
              <FaBook className="text-myred-secondary text-6xl" />
              <div className="absolute bottom-4 left-4">
                <span className="bg-myred text-white px-3 py-1 rounded-full text-sm font-medium">
                  Purchase Now
                </span>
              </div>
            </div>
            <div className="p-6 md:w-3/5">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold text-gray-100 mb-2">
                    {material?.title || "Material Purchase"}
                  </h1>
                  <p className="text-gray-400 mb-4">
                    Complete your purchase by making the payment
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="bg-gradient-to-r from-myred-dark to-myred text-white px-4 py-2 rounded-lg shadow-md">
                  <span className="font-bold text-lg">
                    ৳{material?.price || "0"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="p-6 md:p-8">
            {state.message && !state.success && (
              <div className="mb-6 p-4 bg-red-900/20 border border-red-700/50 text-red-400 rounded-lg">
                {state.message}
              </div>
            )}
            {state.success && (
              <div className="mb-6 p-4 bg-green-900/20 border border-green-700/50 text-green-400 rounded-lg flex items-center gap-2">
                <FaCheckCircle className="text-green-400" />
                {state.message}
              </div>
            )}

            <form action={formAction} className="space-y-6">
              <input
                type="hidden"
                name="studentId"
                value={student?._id || ""}
              />
              <input
                type="hidden"
                name="materialId"
                value={material?._id || ""}
              />

              {/* Payment Instructions */}
              <div className="mb-6 p-4 bg-myred-dark/10 border border-myred-dark/30 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">
                  Payment Instructions
                </h3>
                <p className="text-gray-400 mb-2">
                  Please send the payment of ৳{material?.price} to the following
                  number using bKash or Nagad:
                </p>
                <div className="flex items-center gap-2 text-myred-secondary font-medium">
                  <FaMobileAlt className="text-xl" />
                  <span>+880 1724-304107</span>
                </div>
                <p className="text-gray-400 mt-2">
                  After making the payment, enter your mobile number and the
                  Transaction ID in the form below.
                </p>
              </div>

              {/* Payment Method Section */}
              <div>
                <label
                  htmlFor="paymentMethod"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Payment Method <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="radio"
                      id="bkash"
                      name="paymentMethod"
                      value="bkash"
                      className="sr-only peer"
                      required
                    />
                    <label
                      htmlFor="bkash"
                      className="flex flex-col items-center p-4 border-2 border-gray-700 rounded-xl cursor-pointer hover:border-myred-secondary peer-checked:border-myred-secondary peer-checked:bg-myred-dark/20 transition-all duration-200"
                    >
                      <div className="relative w-20 h-8 mb-2">
                        <Image
                          src="/Bkash.PNG"
                          alt="Bkash Logo"
                          width={80}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm text-gray-400">Bkash</span>
                    </label>
                  </div>
                  <div>
                    <input
                      type="radio"
                      id="nagad"
                      name="paymentMethod"
                      value="nagad"
                      className="sr-only peer"
                      required
                    />
                    <label
                      htmlFor="nagad"
                      className="flex flex-col items-center p-4 border-2 border-gray-700 rounded-xl cursor-pointer hover:border-myred-secondary peer-checked:border-myred-secondary peer-checked:bg-myred-dark/20 transition-all duration-200"
                    >
                      <div className="relative w-20 h-8 mb-2">
                        <Image
                          src="/Nagad.PNG"
                          alt="Nagad Logo"
                          width={80}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <span className="text-sm text-gray-400">Nagad</span>
                    </label>
                  </div>
                </div>
                {errorMap.paymentMethod && (
                  <p className="mt-2 text-sm text-red-400">
                    {errorMap.paymentMethod}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="mobileNumber"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Your Mobile Number <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <FaMobileAlt />
                    </div>
                    <input
                      type="tel"
                      id="mobileNumber"
                      name="mobileNumber"
                      placeholder="01XXXXXXXXX"
                      className="pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-myred-secondary focus:border-myred-secondary transition-all duration-200 text-gray-100"
                      required
                    />
                  </div>
                  {errorMap.mobileNumber && (
                    <p className="mt-2 text-sm text-red-400">
                      {errorMap.mobileNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="transactionId"
                    className="block text-sm font-medium text-gray-300 mb-2"
                  >
                    Transaction ID <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <MdPayment />
                    </div>
                    <input
                      type="text"
                      id="transactionId"
                      name="transactionId"
                      placeholder="Ex: 8A7D6F5G4H3J"
                      className="pl-10 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-myred-secondary focus:border-myred-secondary transition-all duration-200 text-gray-100"
                      required
                    />
                  </div>
                  {errorMap.transactionId && (
                    <p className="mt-2 text-sm text-red-400">
                      {errorMap.transactionId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Amount Paid (BDT) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={material?.price || ""}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg cursor-not-allowed pr-12 text-gray-100"
                    readOnly
                    required
                  />
                  <span className="absolute right-3 top-3 text-gray-400">
                    ৳
                  </span>
                </div>
                {errorMap.amount && (
                  <p className="mt-2 text-sm text-red-400">{errorMap.amount}</p>
                )}
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-5 w-5 text-myred-secondary focus:ring-myred-secondary bg-gray-700 border-gray-600 rounded mt-0.5"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-3 block text-sm text-gray-400"
                >
                  I confirm that I have made the payment and the information
                  provided is correct
                </label>
              </div>
              {errorMap.terms && (
                <p className="mt-2 text-sm text-red-400">{errorMap.terms}</p>
              )}

              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-myred-dark to-myred text-white py-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${
                  pending
                    ? "opacity-80 cursor-not-allowed"
                    : "hover:from-myred hover:to-myred-secondary hover:shadow-myred/50"
                }`}
                disabled={pending}
              >
                {pending ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing Purchase...
                  </>
                ) : (
                  <>
                    Complete Purchase
                    <FaArrowRight className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}



