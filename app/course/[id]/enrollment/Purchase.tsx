"use client";

import { BillingInfo, enrolCourse } from "@/app/dashboard/api/postapi";
import { useState } from "react";

interface Instructor {
  _id: string;
  name: string;
  bio: string;
  image: string;
}

interface Course {
  _id: string;
  id?: string;
  title: string;
  short_description?: string;
  subjects: string[];
  thumbnailUrl: string;
  tags: string[];
  price: number;
  offer_price: number;
  instructors: Instructor[];
  type?: string;
  studentsEnrolled: number;
  courseFor: string;
}

interface PurchaseProps {
  course: Course;
  studentObject: unknown;
}

// ---------------- Billing Form ----------------
const BillingForm = ({
  data,
  setData,
  submit,
  loading,
}: {
  data: BillingInfo;
  setData: (data: BillingInfo) => void;
  submit: () => void;
  loading: boolean;
}) => {
  const paymentDetails: Record<string, string> = {
    bkash: "Send money to: 01724304107 (Bkash Personal)",
    nagad: "Send money to: 01724304107 (Nagad Personal)",
    rocket: "Send money to: 01724304107 (Rocket Personal)",
    bank: "Send money to: 01724304107 ",
  };

  const isValid = data.paymentMethod.trim() && data.transactionId.trim();

  return (
    <div className="space-y-6">
      {/* Payment Method */}
      <div>
        <label className="block mb-2 font-semibold text-gray-700">
          Select Payment Method
        </label>
        <select
          value={data.paymentMethod}
          onChange={(e) => setData({ ...data, paymentMethod: e.target.value })}
          className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">-- Choose Method --</option>
          <option value="bkash">Bkash</option>
          <option value="nagad">Nagad</option>
        </select>
      </div>

      {/* Show payment details */}
      {data.paymentMethod && (
        <div className="p-4 bg-blue-50 border rounded text-gray-800">
          <p className="text-sm">{paymentDetails[data.paymentMethod]}</p>
        </div>
      )}

      {/* Transaction ID */}
      {data.paymentMethod && (
        <div>
          <label className="block mb-2 font-semibold text-gray-700">
            Transaction ID
          </label>
          <input
            type="text"
            placeholder="Enter Transaction ID"
            value={data.transactionId}
            onChange={(e) =>
              setData({ ...data, transactionId: e.target.value })
            }
            className="border p-3 rounded w-full focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
      )}

      {/* Submit */}
      <button
        onClick={submit}
        disabled={!isValid || loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg shadow disabled:opacity-50 transition"
      >
        {loading ? "Processing..." : "Confirm Purchase"}
      </button>
    </div>
  );
};

// ---------------- Purchase Page ----------------
export default function Purchase({ course }: PurchaseProps) {
  const [billingInfo, setBillingInfo] = useState<BillingInfo>({
    paymentMethod: "",
    transactionId: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await enrolCourse(course._id, billingInfo);
      window.location.href = "/dashboard";

      setSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Failed to purchase course. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left: Course Details */}
      <div className="p-6 border rounded-lg shadow bg-gray-50">
        <img
          src={course.thumbnailUrl}
          alt={course.title}
          className="w-full h-60 object-cover rounded mb-4"
        />
        <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
        <p className="text-gray-700 mb-4">{course.short_description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {course.subjects.map((sub, i) => (
            <span
              key={i}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              {sub}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <p className="text-lg line-through text-gray-400">৳{course.price}</p>
          <p className="text-2xl font-bold text-green-600">
            ৳{course.offer_price}
          </p>
        </div>

        <div className="flex items-center mt-4">
          <img
            src={course.instructors[0].image}
            alt={course.instructors[0].name}
            className="w-12 h-12 rounded-full mr-3"
          />
          <div>
            <p className="font-semibold">{course.instructors[0].name}</p>
            <p className="text-gray-600 text-sm">{course.instructors[0].bio}</p>
          </div>
        </div>
      </div>

      {/* Right: Billing Form */}
      <div className="p-6 border rounded-lg shadow bg-white">
        <h3 className="text-xl font-bold mb-4">Complete Your Payment</h3>

        {/* Error Box */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded">
            ❌ {error}
          </div>
        )}

        {/* Success Box */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 border border-green-300 rounded">
            ✅ Purchase request submitted successfully!
          </div>
        )}

        <BillingForm
          data={billingInfo}
          setData={setBillingInfo}
          submit={handleSubmit}
          loading={loading}
        />
      </div>
    </div>
  );
}
