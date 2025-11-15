"use client";

import { useEffect, useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import PurchaseDetailModal from "./PurchaseDetailModal";

const STATUS_OPTIONS = [
  "all",
  "pending",
  "verified",
  "active",
  "expired",
  "cancelled",
];

export default function PackagePurchasesPage() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  console.log(errorMsg);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [purchaseFrom] = useState("");
  const [purchaseTo] = useState("");
  const [expiryFrom] = useState("");
  const [expiryTo] = useState("");

  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);

  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [actionLoading, setActionLoading] = useState({});

  // ---------- Fetch purchases ----------
  const fetchPurchases = async (opts: { page?: number } = {}) => {
    try {
      setLoading(true);
      setErrorMsg("");

      const params = new URLSearchParams();
      params.append("page", String(opts.page ?? page));
      params.append("limit", String(limit));

      if (statusFilter && statusFilter !== "all")
        params.append("status", statusFilter);
      if (search) params.append("q", search);
      if (purchaseFrom) params.append("purchaseFrom", purchaseFrom);
      if (purchaseTo) params.append("purchaseTo", purchaseTo);
      if (expiryFrom) params.append("expiryFrom", expiryFrom);
      if (expiryTo) params.append("expiryTo", expiryTo);

      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_URL
        }/api/admin/exam/package/purchases?${params.toString()}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setPurchases(data.data || []);
      setTotal(data.total || (data.data ? data.data.length : 0));
    } catch (err) {
      console.error("fetchPurchases error:", err);
      setErrorMsg("Failed to load purchases");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    fetchPurchases({ page: 1 });
  }, [statusFilter, search, purchaseFrom, purchaseTo, expiryFrom, expiryTo]);

  useEffect(() => {
    fetchPurchases({ page });
  }, [page]);

  const filtered = useMemo(() => {
    if (!search) return purchases;
    const q = search.toLowerCase();
    return purchases.filter((p) => {
      const studentName = p.studentId?.name || "";
      const pkgName = p.packageSnapshot?.name || p.packageId?.name || "";
      return (
        studentName.toLowerCase().includes(q) ||
        pkgName.toLowerCase().includes(q) ||
        (p.transactionId || "").toLowerCase().includes(q)
      );
    });
  }, [purchases, search]);

  const setActionBusy = (id, val) =>
    setActionLoading((s) => ({ ...s, [id]: val }));

  // ---------- Actions ----------
  // const handleVerify = async (id) => {
  //   if (!confirm("Are you sure you want to approve this purchase?")) return;

  //   try {
  //     setActionBusy(id, true);
  //     await fetch(
  //       `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/package/purchase/verify/${id}`,
  //       { method: "PUT", credentials: "include" }
  //     );
  //     setPurchases((prev) =>
  //       prev.map((p) =>
  //         p._id === id ? { ...p, purchaseStatus: "verified" } : p
  //       )
  //     );
  //     if (selected?._id === id)
  //       setSelected((s) => ({ ...s, purchaseStatus: "verified" }));
  //   } catch (err) {
  //     alert("Failed to verify purchase");
  //   } finally {
  //     setActionBusy(id, false);
  //   }
  // };

  const handleActivate = async (id) => {
    try {
      setActionBusy(id, true);
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/package/purchase/activate/${id}`,
        { method: "PUT", credentials: "include" }
      );
      const result = await res.json();
      if (!result.success) throw new Error(result.message);

      setPurchases((prev) =>
        prev.map((p) => (p._id === id ? { ...p, purchaseStatus: "active" } : p))
      );
      if (selected?._id === id)
        setSelected((s) => ({ ...s, purchaseStatus: "active" }));
    } catch (err) {
      console.error("Activate error:", err);
      alert(err.message || "Failed to activate purchase");
    } finally {
      setActionBusy(id, false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm("Are you sure you want to cancel this purchase?")) return;
    try {
      setActionBusy(id, true);
      await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/exam/package/purchase/cancel/${id}`,
        { method: "PUT", credentials: "include" }
      );
      setPurchases((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, purchaseStatus: "cancelled", isActive: false }
            : p
        )
      );
      if (selected?._id === id)
        setSelected((s) => ({
          ...s,
          purchaseStatus: "cancelled",
          isActive: false,
        }));
    } catch (err) {
      console.log(err);
      alert("Failed to cancel purchase");
    } finally {
      setActionBusy(id, false);
    }
  };

  const openModal = (item) => {
    setSelected(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelected(null);
    setModalOpen(false);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-semibold">Package Purchases</h1>
        <div className="flex gap-2 items-center">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by student, package, trx..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border rounded-md px-3 py-2 w-72"
            />
            <FaSearch className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-md px-3 py-2"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "all"
                  ? "All Statuses"
                  : s.charAt(0)?.toUpperCase() || "" + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Student</th>
              <th className="px-4 py-2">Package</th>
              <th className="px-4 py-2">TRX ID</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Purchase Date</th>
              <th className="px-4 py-2">Expiry Date</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : filtered.length ? (
              filtered.map((p, idx) => (
                <tr key={p._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{(page - 1) * limit + idx + 1}</td>
                  <td className="px-4 py-2">{p.studentId?.name || "—"}</td>
                  <td className="px-4 py-2">
                    {p.packageSnapshot?.name || p.packageId?.name}
                  </td>
                  <td className="px-4 py-2">{p.transactionId}</td>
                  <td className="px-4 py-2">৳{p.price}</td>
                  <td className="px-4 py-2">
                    {new Date(p.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {new Date(p.expiryDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    <StatusPill status={p.purchaseStatus} />
                  </td>
                  <td className="px-4 py-2 text-center space-x-1">
                    <button
                      onClick={() => openModal(p)}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      View
                    </button>

                    {p.purchaseStatus === "verified" && (
                      <button
                        disabled={actionLoading[p._id]}
                        onClick={() => handleActivate(p._id)}
                        className="px-2 py-1 border rounded text-blue-600 hover:bg-blue-50 text-sm"
                      >
                        {actionLoading[p._id] ? "..." : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="text-center py-6 text-gray-500">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">Total: {total}</div>
        <div className="flex gap-2 items-center">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded"
          >
            Prev
          </button>
          <span className="px-3 py-1 border rounded">
            {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded"
          >
            Next
          </button>
        </div>
      </div>

      {modalOpen && selected && (
        <PurchaseDetailModal
          purchase={selected}
          closeModal={closeModal}
          onApprove={(id) => handleActivate(id)}
          onCancel={(id) => handleCancel(id)}
        />
      )}
    </div>
  );
}

// ---------- Status Pill ----------
function StatusPill({ status }) {
  const map = {
    pending: { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-800" },
    verified: { label: "Verified", bg: "bg-blue-100", text: "text-blue-800" },
    active: { label: "Active", bg: "bg-green-100", text: "text-green-800" },
    expired: { label: "Expired", bg: "bg-gray-100", text: "text-gray-700" },
    cancelled: { label: "Cancelled", bg: "bg-red-100", text: "text-red-800" },
  };
  const s = map[status] || {
    label: status,
    bg: "bg-gray-100",
    text: "text-gray-700",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}
