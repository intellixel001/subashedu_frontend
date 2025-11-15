/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { submitMaterialPayment } from "@/actions/submitMaterialPayment";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { FaArrowRight, FaMobileAlt, FaSpinner } from "react-icons/fa";
import { MdPayment, MdVerified } from "react-icons/md";
import { RiLoader4Fill } from "react-icons/ri";

interface MaterialPurchaseFormProps {
  materialId: string;
}

export default function MaterialPurchaseForm({
  materialId,
}: MaterialPurchaseFormProps) {
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
        // Fetch material
        const materialRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-material-for-purchase/${materialId}`,
          { cache: "no-store", credentials: "include" }
        );
        if (!materialRes.ok) throw new Error("Material পাওয়া যায়নি");
        const materialResult = await materialRes.json();
        setMaterial(materialResult.data);

        // Fetch student
        const studentRes = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/current-student`,
          { credentials: "include" }
        );
        if (!studentRes.ok) {
          if (studentRes.status === 401) {
            setNeedsLogin(true);
            return;
          }
          throw new Error("Student তথ্য পাওয়া যায়নি");
        }
        const studentResult = await studentRes.json();
        if (!studentResult?.data?.student) setNeedsLogin(true);
        else setStudent(studentResult.data.student);

        // Payment status
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
      <main className="w-full flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
          <div className="flex justify-center mb-6">
            <RiLoader4Fill className="text-red-500 text-5xl animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            ম্যাটেরিয়াল লোড হচ্ছে
          </h2>
          <p className="text-gray-500 mb-6">আপনার পারচেজ প্রস্তুত করা হচ্ছে</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-red-500 h-2.5 rounded-full animate-pulse w-3/4"></div>
          </div>
        </div>
      </main>
    );
  }

  if (needsLogin || !student) {
    return (
      <main className="w-full flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-red-500"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            লগইন প্রয়োজন
          </h2>
          <p className="text-gray-500 mb-6">
            ম্যাটেরিয়াল ক্রয়ের জন্য লগইন করুন
          </p>
          <Link href="/login">
            <button className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
              লগইন করুন <FaArrowRight />
            </button>
          </Link>
          <p className="text-sm text-gray-400 mt-4">
            অ্যাকাউন্ট না থাকলে লগইন করে নিবন্ধন করুন
          </p>
        </div>
      </main>
    );
  }

  if (isPaymentPending || submissionSuccess) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
          <div className="flex justify-center mb-6">
            <RiLoader4Fill className="text-red-500 text-5xl animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            পেমেন্ট যাচাই প্রক্রিয়াধীন
          </h2>
          <p className="text-gray-500 mb-4">
            আপনার পেমেন্ট যাচাই করা হচ্ছে। এটি কয়েক ঘণ্টা সময় নিতে পারে।
          </p>
          <div className="bg-red-100 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-red-500 font-medium">
              <MdVerified className="text-xl" /> পেমেন্ট যাচাই করা হচ্ছে
            </div>
          </div>
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          >
            ড্যাশবোর্ডে যান <FaArrowRight />
          </button>
          <p className="text-sm text-gray-400 mt-4">
            কিছু সময় পরে পুনরায় চেক করুন
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
          <div className="flex justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-red-500"
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
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            দুঃখিত! সমস্যা হয়েছে
          </h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-red-500 text-white py-3 px-6 rounded-lg font-medium hover:shadow-lg transition-all duration-200"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      </main>
    );
  }

  const errorMap = state.errors.reduce((acc: any, err: any) => {
    acc[err.path[0]] = err.message;
    return acc;
  }, {});

  return (
    <main className="w-full min-h-screen bg-gray-50 py-12">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          {/* Material Info */}
          <div className="relative p-4 bg-gray-100 flex flex-col items-center">
            <img
              src={material?.image || "/default-material.png"}
              alt={material?.title || "Material"}
              className="object-contain w-full h-64 rounded-lg shadow-lg mb-4"
            />
            <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
              {material?.title || "ম্যাটেরিয়াল ক্রয়"}
            </h1>
            <p className="text-gray-500 text-center mb-4">
              নিচের পেমেন্ট মাধ্যমে আপনার পারচেজ সম্পন্ন করুন
            </p>
            <div className="bg-red-500 text-white px-6 py-3 rounded-full text-xl font-semibold shadow-md mb-6">
              ৳{material?.price || "0"}
            </div>
          </div>

          {/* Payment Form */}
          <div className="p-8 md:p-12">
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

              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  পেমেন্ট নির্দেশনা
                </h3>
                <p className="text-gray-500 mb-2">
                  ৳{material?.price} পাঠান নিচের নম্বরে (bKash/Nagad):
                </p>
                <div className="flex items-center gap-2 text-red-500 font-medium">
                  <FaMobileAlt /> +880 1724-304107
                </div>
                <p className="text-gray-500 mt-2">
                  পেমেন্টের পর মোবাইল নম্বর ও ট্রানজেকশন আইডি প্রদান করুন।
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  পেমেন্ট পদ্ধতি <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {["bkash", "nagad"].map((method) => (
                    <div key={method}>
                      <input
                        type="radio"
                        id={method}
                        name="paymentMethod"
                        value={method}
                        className="sr-only peer"
                        required
                      />
                      <label
                        htmlFor={method}
                        className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-red-500 peer-checked:border-red-500 peer-checked:bg-red-50 transition-all duration-200"
                      >
                        <div className="relative w-20 h-8 mb-2">
                          <Image
                            src={`/${
                              method.charAt(0)?.toUpperCase() ||
                              "" + method.slice(1)
                            }.PNG`}
                            alt={`${method} Logo`}
                            width={80}
                            height={32}
                            className="object-contain"
                          />
                        </div>
                        <span className="text-sm text-gray-700 capitalize">
                          {method}
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                {errorMap.paymentMethod && (
                  <p className="mt-2 text-sm text-red-500">
                    {errorMap.paymentMethod}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaMobileAlt />
                    </div>
                    <input
                      type="tel"
                      name="mobileNumber"
                      placeholder="01XXXXXXXXX"
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      required
                    />
                  </div>
                  {errorMap.mobileNumber && (
                    <p className="mt-2 text-sm text-red-500">
                      {errorMap.mobileNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ট্রানজেকশন আইডি <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <MdPayment />
                    </div>
                    <input
                      type="text"
                      name="transactionId"
                      placeholder="Ex: 8A7D6F5G4H3J"
                      className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                      required
                    />
                  </div>
                  {errorMap.transactionId && (
                    <p className="mt-2 text-sm text-red-500">
                      {errorMap.transactionId}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  পরিশোধিত অর্থ (BDT)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="amount"
                    value={material?.price || ""}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-700"
                  />
                  <span className="absolute right-3 top-3 text-gray-400">
                    ৳
                  </span>
                </div>
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-5 w-5 text-red-500 focus:ring-red-500 border-gray-300 rounded mt-0.5"
                  required
                />
                <label
                  htmlFor="terms"
                  className="ml-3 block text-sm text-gray-700"
                >
                  আমি নিশ্চিত যে আমি পেমেন্ট করেছি এবং তথ্য সঠিক
                </label>
              </div>

              <button
                type="submit"
                disabled={pending}
                className={`w-full bg-red-500 text-white py-4 rounded-lg font-medium hover:bg-red-600 transition-all duration-200 flex items-center justify-center gap-2 ${
                  pending ? "opacity-80 cursor-not-allowed" : ""
                }`}
              >
                {pending ? (
                  <>
                    <FaSpinner className="animate-spin" /> প্রসেসিং...
                  </>
                ) : (
                  <>
                    ক্রয় সম্পন্ন করুন <FaArrowRight />
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
