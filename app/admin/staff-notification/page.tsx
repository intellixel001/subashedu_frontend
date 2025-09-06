"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import {
  FaBell,
  FaEnvelope,
  FaPaperPlane,
  FaReply,
  FaSearch,
  FaTrash,
} from "react-icons/fa";

interface Notification {
  _id: string;
  message: string;
  sentBy: StaffOption | string | null;
  sentTo: string;
  createdAt: string;
  readReceipt: boolean;
  sentByModel?: string;
}

interface StaffOption {
  _id: string;
  fullName: string;
  email: string;
  photoUrl?: string;
}

export default function StaffNoti() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [staffOptions, setStaffOptions] = useState<StaffOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffOption | null>(null);
  const [formData, setFormData] = useState({
    message: "",
    sentTo: "",
  });
  const [submittingLoading, setSubmittingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noNotifications, setNoNotifications] = useState(false);
  const [noStaff, setNoStaff] = useState(false);

  // Fetch notifications and staff list
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        setNoNotifications(false);
        setNoStaff(false);

        const [notiResponse, staffResponse] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-notification`,
            {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              cache: "no-store",
            }
          ),
          fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-staffs`, {
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
          }),
        ]);

        // Handle notification response
        if (!notiResponse.ok) {
          if (notiResponse.status === 401) {
            setError("Unauthorized: Please log in again.");
            return;
          }
          if (notiResponse.status === 404) {
            console.warn(
              "Notification endpoint not found. Treating as no notifications."
            );
            setNoNotifications(true);
          } else {
            console.error(
              `Notification fetch failed: ${notiResponse.status} ${notiResponse.statusText}`
            );
            setError("Failed to fetch notifications.");
          }
        }

        // Handle staff response
        if (!staffResponse.ok) {
          if (staffResponse.status === 401) {
            setError("Unauthorized: Please log in again.");
            return;
          }
          console.error(
            `Staff fetch failed: ${staffResponse.status} ${staffResponse.statusText}`
          );
          setNoStaff(true);
        }

        const notiContentType = notiResponse.headers.get("content-type");
        const staffContentType = staffResponse.headers.get("content-type");

        // Process notification response
        let notiResult = { success: false, data: [] };
        if (notiResponse.ok && notiContentType?.includes("application/json")) {
          notiResult = await notiResponse.json();
        } else if (notiResponse.status !== 404) {
          console.error(
            "Received non-JSON response from notification API:",
            notiContentType || "No content-type"
          );
        }

        // Process staff response
        let staffResult = { success: false, data: [] };
        if (
          staffResponse.ok &&
          staffContentType?.includes("application/json")
        ) {
          staffResult = await staffResponse.json();
        } else {
          console.error(
            "Received non-JSON response from staff API:",
            staffContentType || "No content-type"
          );
        }

        if (notiResult.success) {
          setNotifications(notiResult.data);
          setNoNotifications(notiResult.data.length === 0);
        } else {
          setNoNotifications(true);
        }

        if (staffResult.success) {
          setStaffOptions(staffResult.data);
          setNoStaff(staffResult.data.length === 0);
        } else {
          setNoStaff(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Sort staff: those with unread notifications go to the top
  const sortedStaff = [...staffOptions].sort((a, b) => {
    const hasNotiA = notifications.some((noti) => {
      const sentById =
        typeof noti.sentBy === "string" ? noti.sentBy : noti.sentBy?._id;
      return sentById === a._id && !noti.readReceipt;
    });
    const hasNotiB = notifications.some((noti) => {
      const sentById =
        typeof noti.sentBy === "string" ? noti.sentBy : noti.sentBy?._id;
      return sentById === b._id && !noti.readReceipt;
    });
    return hasNotiB ? 1 : hasNotiA ? -1 : 0;
  });

  const filteredStaff = sortedStaff.filter(
    (staff) =>
      staff.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/send-notification`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized: Please log in again.");
          return;
        }
        throw new Error(`Failed to send notification: ${response.statusText}`);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        throw new Error(
          "Received non-JSON response from send notification API"
        );
      }

      const result = await response.json();
      if (result.success) {
        setNotifications((prev) => [result.data, ...prev]);
        setIsSendModalOpen(false);
        setFormData({ message: "", sentTo: "" });
        setNoNotifications(false);
      } else {
        setError(result.message || "Failed to send notification");
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      setError("An error occurred while sending the notification.");
    } finally {
      setSubmittingLoading(false);
    }
  };

  const openSendModal = (staff: StaffOption) => {
    setFormData({ message: "", sentTo: staff._id });
    setSelectedStaff(staff);
    setIsSendModalOpen(true);
  };

  const handleReply = (notification: Notification) => {
    const sentById =
      typeof notification.sentBy === "string"
        ? notification.sentBy
        : notification.sentBy?._id;
    const staff = staffOptions.find((s) => s._id === sentById);
    if (staff) {
      setFormData({ message: "", sentTo: staff._id });
      setSelectedStaff(staff);
      setIsSendModalOpen(true);
      setIsViewModalOpen(false);
    }
  };

  const openViewModal = async (staff: StaffOption) => {
    setSelectedStaff(staff);
    setIsViewModalOpen(true);

    // Update read receipt for notifications from this staff
    const staffNotifications = getStaffNotifications(staff._id);
    const unreadNotificationIds = staffNotifications
      .filter((noti) => !noti.readReceipt)
      .map((noti) => noti._id);

    if (unreadNotificationIds.length > 0) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/update-notification`,
          {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notificationIds: unreadNotificationIds }),
            cache: "no-store",
          }
        );

        if (response.ok) {
          setNotifications((prev) =>
            prev.map((noti) =>
              unreadNotificationIds.includes(noti._id)
                ? { ...noti, readReceipt: true }
                : noti
            )
          );
        } else if (response.status === 404) {
          console.warn("No unread notifications found to mark as read.");
        } else {
          console.error(
            `Failed to update notification read status: ${response.statusText}`
          );
          setError("Failed to update notification read status.");
        }
      } catch (error) {
        console.error("Error updating notification read status:", error);
        setError("An error occurred while updating notification read status.");
      }
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    setSubmittingLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/delete-notification`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notificationId }),
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized: Please log in again.");
          return;
        }
        throw new Error(`Failed to delete notification: ${response.statusText}`);
      }

      const result = await response.json();
      if (result.success) {
        setNotifications((prev) =>
          prev.filter((noti) => noti._id !== notificationId)
        );
        if (notifications.length === 1) {
          setNoNotifications(true);
        }
      } else {
        setError(result.message || "Failed to delete notification");
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
      setError("An error occurred while deleting the notification.");
    } finally {
      setSubmittingLoading(false);
    }
  };

  const handleClearNotifications = async () => {
    setSubmittingLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/clear-notifications`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          cache: "no-store",
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          setError("Unauthorized: Please log in again.");
          return;
        }
        throw new Error(
          `Failed to clear notifications: ${response.statusText}`
        );
      }

      const result = await response.json();
      if (result.success) {
        setNotifications([]);
        setNoNotifications(true);
      } else {
        setError(result.message || "Failed to clear notifications");
      }
    } catch (error) {
      console.error("Error clearing notifications:", error);
      setError("An error occurred while clearing notifications.");
    } finally {
      setSubmittingLoading(false);
    }
  };

  const getStaffNotifications = (staffId: string) => {
    return notifications
      .filter((noti) => {
        const sentById =
          typeof noti.sentBy === "string" ? noti.sentBy : noti.sentBy?._id;
        return sentById === staffId || noti.sentTo === staffId;
      })
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  return (
    <div className="p-6">
      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaBell className="mr-2" /> Staff Notifications
        </h1>
        <button
          onClick={handleClearNotifications}
          className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
          disabled={loading || submittingLoading || noNotifications}
        >
          Clear All Notifications / Messages
        </button>
      </div>

      {/* Search input */}
      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search staff by name or email..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Staff list */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading staff...
                  </td>
                </tr>
              ) : noStaff ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No staff found.
                  </td>
                </tr>
              ) : filteredStaff.length > 0 ? (
                filteredStaff.map((staff) => {
                  const hasUnreadNotifications = notifications.some((noti) => {
                    const sentById =
                      typeof noti.sentBy === "string"
                        ? noti.sentBy
                        : noti.sentBy?._id;
                    return sentById === staff._id && !noti.readReceipt;
                  });
                  return (
                    <tr key={staff._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                            {staff.photoUrl ? (
                              <Image
                                src={staff.photoUrl}
                                alt={staff.fullName}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center">
                                <FaBell className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4 flex items-center">
                            <div className="font-medium text-gray-900">
                              {staff.fullName}
                            </div>
                            {hasUnreadNotifications && (
                              <span className="ml-2 h-2 w-2 bg-red-500 rounded-full" />
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {staff.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => openSendModal(staff)}
                          className="text-blue-600 hover:text-blue-900 mr-4 flex items-center cursor-pointer"
                          disabled={loading}
                        >
                          <FaPaperPlane className="mr-1" /> Send
                        </button>
                        {getStaffNotifications(staff._id).length > 0 && (
                          <button
                            onClick={() => openViewModal(staff)}
                            className="text-green-600 hover:text-green-900 flex items-center cursor-pointer"
                            disabled={loading}
                          >
                            <FaEnvelope className="mr-1" /> See Messages
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No staff match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Notification Modal */}
      <Transition appear show={isSendModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsSendModalOpen(false)}
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
                    Send Notification to {selectedStaff?.fullName}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="message"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        rows={4}
                        required
                        disabled={submittingLoading}
                      />
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                        onClick={() => setIsSendModalOpen(false)}
                        disabled={submittingLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50"
                        disabled={submittingLoading}
                      >
                        {submittingLoading ? (
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
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Sending...
                          </>
                        ) : (
                          "Send"
                        )}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* View Messages Modal */}
      <Transition appear show={isViewModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsViewModalOpen(false)}
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
                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Messages with {selectedStaff?.fullName}
                  </Dialog.Title>
                  <div className="mt-4 max-h-96 overflow-y-auto">
                    {selectedStaff &&
                    getStaffNotifications(selectedStaff._id).length > 0 ? (
                      getStaffNotifications(selectedStaff._id).map(
                        (notification) => (
                          <div
                            key={notification._id}
                            className={`mb-4 p-4 rounded-lg flex justify-between items-start ${
                              notification.sentByModel === "Staff"
                                ? "bg-blue-50"
                                : "bg-gray-50"
                            }`}
                          >
                            <div>
                              <p className="text-sm text-gray-700">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(
                                  notification.createdAt
                                ).toLocaleString()}
                              </p>
                              <p className="text-xs text-gray-500">
                                {notification.readReceipt
                                  ? "Read"
                                  : "Unread"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {notification.sentByModel === "Staff" && (
                                <button
                                  onClick={() => handleReply(notification)}
                                  className="text-blue-600 hover:text-blue-900 flex items-center cursor-pointer"
                                  disabled={submittingLoading}
                                >
                                  <FaReply className="h-4 w-4 mr-1" />
                                  Reply
                                </button>
                              )}
                              <button
                                onClick={() =>
                                  handleDeleteNotification(notification._id)
                                }
                                className="text-red-600 hover:text-red-900 flex items-center cursor-pointer"
                                disabled={submittingLoading}
                              >
                                <FaTrash className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-gray-500">
                        No messages with {selectedStaff?.fullName}.
                      </p>
                    )}
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
                      onClick={() => setIsViewModalOpen(false)}
                      disabled={submittingLoading}
                    >
                      Close
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