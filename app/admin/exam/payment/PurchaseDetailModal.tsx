"use client";

import { useState } from "react";

export default function PurchaseDetailModal({
  purchase,
  closeModal,
  onApprove,
  onCancel,
}) {
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    if (!confirm("Approve this purchase?")) return;
    try {
      setLoading(true);
      await onApprove(purchase._id);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to approve purchase");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Cancel this purchase?")) return;
    try {
      setLoading(true);
      await onCancel(purchase._id);
      closeModal();
    } catch (err) {
      console.error(err);
      alert("Failed to cancel purchase");
    } finally {
      setLoading(false);
    }
  };

  const snapshot = purchase.packageSnapshot || {};
  const student = purchase.student || {};

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-11/12 md:w-3/4 lg:w-1/2 p-5 overflow-auto max-h-[80vh]">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Purchase Details</h3>
          <button onClick={closeModal} className="text-gray-600">
            Close
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Student */}
          <div className="border p-3 rounded">
            <h4 className="font-semibold mb-2">Student</h4>
            <p className="text-sm">
              <strong>Name:</strong> {student.name || purchase.studentId}
            </p>
            <p className="text-sm">
              <strong>Email:</strong> {student.email || "-"}
            </p>
            <p className="text-sm">
              <strong>ID:</strong> {purchase.studentId}
            </p>
          </div>

          {/* Package snapshot */}
          <div className="border p-3 rounded">
            <h4 className="font-semibold mb-2">Package (snapshot)</h4>
            <p className="text-sm">
              <strong>Name:</strong> {snapshot.name || purchase.packageId?.name}
            </p>
            <p className="text-sm">
              <strong>Position:</strong>{" "}
              {snapshot.position || purchase.packageId?.position}
            </p>
            <p className="text-sm">
              <strong>Duration:</strong> {snapshot.duration} days
            </p>
            <p className="text-sm">
              <strong>Price:</strong> ৳{snapshot.price}
            </p>
          </div>

          {/* Payment */}
          <div className="border p-3 rounded">
            <h4 className="font-semibold mb-2">Payment</h4>
            <p className="text-sm">
              <strong>Method:</strong> {purchase.paymentMethod}
            </p>
            <p className="text-sm">
              <strong>TRX ID:</strong> {purchase.transactionId}
            </p>
            <p className="text-sm">
              <strong>Amount:</strong> ৳{purchase.price}
            </p>
            {purchase.paymentProof && (
              <div className="mt-2">
                <strong className="text-sm block">Proof</strong>
                <img
                  src={purchase.paymentProof}
                  alt="proof"
                  className="mt-2 w-48 h-32 object-cover border rounded"
                />
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          {purchase.purchaseStatus === "pending" && (
            <>
              <button
                disabled={loading}
                onClick={handleApprove}
                className="px-3 py-2 rounded bg-blue-600 text-white"
              >
                Approve
              </button>
              <button
                disabled={loading}
                onClick={handleCancel}
                className="px-3 py-2 rounded bg-red-600 text-white"
              >
                Cancel
              </button>
            </>
          )}

          {["approved", "cancelled", "active", "expired"].includes(
            purchase.purchaseStatus
          ) && (
            <div className="text-sm text-gray-600">No actions available</div>
          )}
        </div>
      </div>
    </div>
  );
}
