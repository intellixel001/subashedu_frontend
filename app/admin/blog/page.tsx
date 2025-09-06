/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { BlogModal } from "@/app/components/BlogModal";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useState } from "react";
import { FaEdit, FaPlus, FaSearch, FaTrash } from "react-icons/fa";

interface Author {
  name: string;
  photoUrl?: string;
}

interface Blog {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnail?: string;
  author: Author;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  shortDescription: string;
  description: string;
  thumbnail?: string;
  author: Author;
}

export default function BlogAdminDashboard() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noBlogsAvailable, setNoBlogsAvailable] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [formData, setFormData] = useState<FormData>({
    title: "",
    shortDescription: "",
    description: "",
    thumbnail: "",
    author: { name: "", photoUrl: "" },
  });

  const fetchBlogs = async (pageNum: number, search: string) => {
    try {
      setLoading(true);
      setError(null);
      setNoBlogsAvailable(false);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-blogs?page=${pageNum}&limit=${limit}&search=${encodeURIComponent(search)}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.message || "Failed to fetch blogs");
      }

      setBlogs(result.data.blogs || []);
      setTotalPages(result.data.pages || 1);
      setNoBlogsAvailable(result.data.blogs.length === 0);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError(error.message || "Failed to fetch blogs");
      setBlogs([]);
      setNoBlogsAvailable(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page, searchTerm);
  }, [page]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setPage(1);
      fetchBlogs(1, searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const openCreateModal = () => {
    setCurrentBlog(null);
    setFormData({
      title: "",
      shortDescription: "",
      description: "",
      thumbnail: "",
      author: { name: "", photoUrl: "" },
    });
    setIsModalOpen(true);
    setError(null);
  };

  const openEditModal = (blog: Blog) => {
    setCurrentBlog(blog);
    setFormData({
      title: blog.title,
      shortDescription: blog.shortDescription,
      description: blog.description,
      thumbnail: blog.thumbnail || "",
      author: { name: blog.author.name, photoUrl: blog.author.photoUrl || "" },
    });
    setIsModalOpen(true);
    setError(null);
  };

  const handleSubmit = async (
    e: React.FormEvent,
    formData: FormData,
    authorPhotoFile: File | null,
    thumbnailFile: File | null
  ) => {
    e.preventDefault();
    try {
      setIsProcessing(true);
      setError(null);

      const endpoint = currentBlog
        ? `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/update-blog`
        : `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/create-blog`;

      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("shortDescription", formData.shortDescription);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("author", JSON.stringify({ name: formData.author.name }));

      if (currentBlog) {
        formDataToSend.append("id", currentBlog._id);
      }

      if (authorPhotoFile) {
        formDataToSend.append("authorPhoto", authorPhotoFile);
      }

      if (thumbnailFile) {
        formDataToSend.append("thumbnail", thumbnailFile);
      }

      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        body: formDataToSend,
      });

      const result = await response.json();
      if (result.success) {
        setIsModalOpen(false);
        fetchBlogs(page, searchTerm);
      } else {
        throw new Error(result.message || "Failed to save blog");
      }
    } catch (error) {
      console.error("Error saving blog:", error);
      setError(error.message || "An error occurred while saving the blog");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;
    setIsProcessing(true);
    try {
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/delete-blog`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: blogToDelete }),
        }
      );

      const result = await response.json();
      if (result.success) {
        fetchBlogs(page, searchTerm);
      } else {
        throw new Error(result.message || "Failed to delete blog");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
      setError(error.message || "An error occurred while deleting the blog");
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          <FaPlus className="mr-2" /> Create New Blog
        </button>
      </div>

      {noBlogsAvailable && !loading && (
        <div className="mb-4 p-4 bg-blue-100 text-blue-700 rounded-lg text-center">
          No blogs available
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search blogs by title, description, or author..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-blue-600 dark:bg-gray-800 dark:text-white dark:border-gray-600"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Thumbnail
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Author
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : blogs.length > 0 ? (
                blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {blog.thumbnail ? (
                          <Image
                            src={blog.thumbnail}
                            alt={blog.title}
                            width={48}
                            height={32}
                            className="h-8 w-12 rounded-md object-cover"
                          />
                        ) : (
                          <div className="h-8 w-12 rounded-md bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300">
                            No thumbnail
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-2">
                          <div className="font-medium text-gray-900 dark:text-white">{blog.title}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                            {blog.shortDescription}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center">
                        {blog.author.photoUrl ? (
                          <Image
                            src={blog.author.photoUrl}
                            alt={blog.author.name}
                            width={32}
                            height={32}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300">
                            {blog.author.name.charAt(0)}
                          </div>
                        )}
                        <span className="ml-2 text-gray-900 dark:text-white">{blog.author.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(blog.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(blog)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 mr-4"
                        disabled={loading}
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => {
                          setBlogToDelete(blog._id);
                          setIsDeleteDialogOpen(true);
                        }}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
                        disabled={loading}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-gray-500 dark:text-gray-400">
                    No blogs found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center space-x-2">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || loading}
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-gray-700 dark:text-gray-300">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages || loading}
            className="px-3 py-1 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      <BlogModal
        isModalOpen={isModalOpen}
        Fragment={Fragment}
        currentBlog={currentBlog}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        setIsModalOpen={setIsModalOpen}
        isProcessing={isProcessing}
      />

      <Transition appear show={isDeleteDialogOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => !isProcessing && setIsDeleteDialogOpen(false)}
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
            <div className="fixed inset-0 bg-black/55" />
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
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 dark:text-white"
                  >
                    Confirm Blog Deletion
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Are you sure you want to delete this blog? This action cannot be undone.
                    </p>
                  </div>

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
                      onClick={() => setIsDeleteDialogOpen(false)}
                      disabled={isProcessing}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={handleDelete}
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
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
                          Deleting...
                        </>
                      ) : (
                        "Delete Blog"
                      )}
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