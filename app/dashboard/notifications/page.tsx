"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { FaBell, FaEnvelope, FaPaperPlane, FaSearch, FaTrash } from "react-icons/fa";

interface Notification {
  _id: string;
  message: string;
  sentBy: SenderOption | null;
  sentTo: string;
  createdAt: string;
  readReceipt: boolean;
  sentByModel: string;
}

interface SenderOption {
  _id: string;
  fullName: string;
  email: string;
  photoUrl?: string;
  role: string;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [senderOptions, setSenderOptions] = useState<SenderOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSender, setSelectedSender] = useState<SenderOption | null>(null);
  const [formData, setFormData] = useState({
    message: "",
    sentTo: "",
  });
  const [submittingLoading, setSubmittingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noNotifications, setNoNotifications] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        setNoNotifications(false);

        const [notiResponse, senderResponse] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/get-notifications`,
            {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              cache: "no-store",
            }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/get-senders`,
            {
              method: "GET",
              credentials: "include",
              headers: { "Content-Type": "application/json" },
              cache: "no-store",
            }
          ),
        ]);

        if (!notiResponse.ok) {
          if (notiResponse.status === 401) {
            setError("Unauthorized: Please log in again.");
            return;
          }
          setNoNotifications(true);
        }

        if (!senderResponse.ok) {
          if (senderResponse.status === 401) {
            setError("Unauthorized: Please log in again.");
            return;
          }
        }

        const notiContentType = notiResponse.headers.get("content-type");
        const senderContentType = senderResponse.headers.get("content-type");

        let notiResult = { success: false, data: { notifications: [] } };
        if (notiResponse.ok && notiContentType?.includes("application/json")) {
          notiResult = await notiResponse.json();
        }

        let senderResult = { success: false, data: [] };
        if (senderResponse.ok && senderContentType?.includes("application/json")) {
          senderResult = await senderResponse.json();
        }

        if (notiResult.success) {
          setNotifications(notiResult.data.notifications);
          setNoNotifications(notiResult.data.notifications.length === 0);
        } else {
          setNoNotifications(true);
        }

        if (senderResult.success && notiResult.data.notifications.length > 0) {
          setSenderOptions(senderResult.data);
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

  const sortedSenders = [...senderOptions].sort((a, b) => {
    const hasNotiA = notifications.some(
      (noti) => noti.sentBy?._id === a._id && !noti.readReceipt
    );
    const hasNotiB = notifications.some(
      (noti) => noti.sentBy?._id === b._id && !noti.readReceipt
    );
    return hasNotiB ? 1 : hasNotiA ? -1 : 0;
  });

  const filteredSenders = sortedSenders.filter(
    (sender) =>
      sender.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sender.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/send-notification`,
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
        throw new Error(`Failed to send notification: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setNotifications((prev) => [result.data.notification, ...prev]);
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

  const openSendModal = (sender: SenderOption) => {
    setFormData({ message: "", sentTo: sender._id });
    setSelectedSender(sender);
    setIsSendModalOpen(true);
  };

  const handleReply = (notification: Notification) => {
    if (!notification.sentBy) return;
    const sender = senderOptions.find((s) => s._id === notification.sentBy?._id);
    if (sender) {
      setFormData({ message: "", sentTo: sender._id });
      setSelectedSender(sender);
      setIsSendModalOpen(true);
      setIsViewModalOpen(false);
    }
  };

  const openViewModal = async (sender: SenderOption) => {
    setSelectedSender(sender);
    setIsViewModalOpen(true);

    const senderNotifications = getSenderNotifications(sender._id);
    const unreadNotificationIds = senderNotifications
      .filter((noti) => !noti.readReceipt)
      .map((noti) => noti._id);

    if (unreadNotificationIds.length > 0) {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/update-notification`,
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
        } else {
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/delete-notification`,
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
        throw new Error(`Failed to delete notification: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setNotifications((prev) =>
          prev.filter((noti) => noti._id !== notificationId)
        );
        if (notifications.length === 1) {
          setNoNotifications(true);
          setSenderOptions([]);
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
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/clear-notifications`,
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
        throw new Error(`Failed to clear notifications: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setNotifications([]);
        setSenderOptions([]);
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

  const getSenderNotifications = (senderId: string) => {
    return notifications
      .filter((noti) => noti.sentBy?._id === senderId || noti.sentTo === senderId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  };

  return (
    <div className="p-6">
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <FaBell className="mr-2" /> Notifications
        </h1>
        {!noNotifications && (
          <button
            onClick={handleClearNotifications}
            className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-2 md:px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50"
            disabled={loading || submittingLoading}
          >
            Clear All Notifications
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center text-gray-500">Loading...</div>
      ) : noNotifications ? (
        <div className="text-center text-gray-500">
          No notifications available
        </div>
      ) : (
        <>
          <div className="mb-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search senders by name or email..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sender
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSenders.length > 0 ? (
                    filteredSenders.map((sender) => {
                      const hasUnreadNotifications = notifications.some(
                        (noti) => noti.sentBy?._id === sender._id && !noti.readReceipt
                      );
                      return (
                        <tr key={sender._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full overflow-hidden">
                                {sender.photoUrl ? (
                                  <Image
                                    src={sender.photoUrl}
                                    alt={sender.fullName}
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
                                  {sender.fullName}
                                </div>
                                {hasUnreadNotifications && (
                                  <span className="ml-2 h-2 w-2 bg-red-500 rounded-full" />
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {sender.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                            {sender.role}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => openSendModal(sender)}
                              className="text-blue-600 hover:text-blue-900 mr-4 flex items-center cursor-pointer"
                              disabled={loading}
                            >
                              <FaPaperPlane className="mr-1" /> Send
                            </button>
                            {getSenderNotifications(sender._id).length > 0 && (
                              <button
                                onClick={() => openViewModal(sender)}
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
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No senders match your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

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
                    Send Notification to {selectedSender?.fullName}
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
                    Messages with {selectedSender?.fullName}
                  </Dialog.Title>
                  <div className="mt-4 max-h-96 overflow-y-auto">
                    {selectedSender &&
                    getSenderNotifications(selectedSender._id).length > 0 ? (
                      getSenderNotifications(selectedSender._id).map(
                        (notification) => (
                          <div
                            key={notification._id}
                            className={`mb-4 p-4 rounded-lg flex justify-between items-start ${
                              notification.sentByModel === "Student"
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
                                {notification.readReceipt ? "Read" : "Unread"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              {notification.sentByModel !== "Student" && (
                                <button
                                  onClick={() => handleReply(notification)}
                                  className="text-blue-600 hover:text-blue-900 flex items-center cursor-pointer"
                                  disabled={submittingLoading}
                                >
                                  <FaPaperPlane className="h-4 w-4 mr-1" />
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
                        No messages with {selectedSender?.fullName}.
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