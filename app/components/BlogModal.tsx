"use client";

import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { BlogEditor } from "./BlogEditor";

interface Blog {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnail?: string;
  author: {
    name: string;
    photoUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  shortDescription: string;
  description: string;
  thumbnail?: string;
  author: {
    name: string;
    photoUrl?: string;
  };
}

interface BlogModalProps {
  isModalOpen: boolean;
  Fragment: typeof Fragment;
  currentBlog: Blog | null;
  handleSubmit: (
    e: React.FormEvent,
    formData: FormData,
    authorPhotoFile: File | null,
    thumbnailFile: File | null
  ) => void;
  formData: FormData;
  setFormData: (formData: FormData) => void;
  setIsModalOpen: (isOpen: boolean) => void;
  isProcessing: boolean;
}

export const BlogModal: React.FC<BlogModalProps> = ({
  isModalOpen,
  Fragment,
  currentBlog,
  handleSubmit,
  formData,
  setFormData,
  setIsModalOpen,
  isProcessing,
}) => {
  const [authorPhotoPreview, setAuthorPhotoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [authorPhotoFile, setAuthorPhotoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const authorFileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentBlog) {
      setAuthorPhotoPreview(currentBlog.author?.photoUrl || null);
      setThumbnailPreview(currentBlog.thumbnail || null);
    } else {
      setAuthorPhotoPreview(null);
      setThumbnailPreview(null);
    }
    setAuthorPhotoFile(null);
    setThumbnailFile(null);
  }, [currentBlog]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "authorName") {
      setFormData({
        ...formData,
        author: { ...formData.author, name: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAuthorFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAuthorPhotoFile(file);
      setAuthorPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleThumbnailFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeAuthorPhoto = () => {
    setAuthorPhotoPreview(null);
    setAuthorPhotoFile(null);
    setFormData({
      ...formData,
      author: { ...formData.author, photoUrl: "" },
    });
  };

  const removeThumbnail = () => {
    setThumbnailPreview(null);
    setThumbnailFile(null);
    setFormData({
      ...formData,
      thumbnail: "",
    });
  };

  const triggerAuthorFileInput = () => {
    authorFileInputRef.current?.click();
  };

  const triggerThumbnailFileInput = () => {
    thumbnailFileInputRef.current?.click();
  };

  const handleDescriptionChange = (html: string) => {
    setFormData({ ...formData, description: html });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.shortDescription || !formData.description || !formData.author.name) {
      setFormError("All fields except images are required.");
      return;
    }
    setFormError(null);
    handleSubmit(e, formData, authorPhotoFile, thumbnailFile);
  };

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setIsModalOpen(false)}
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
          <div className="fixed inset-0 bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-md sm:max-w-lg lg:w-[90%] lg:max-w-none rounded-xl bg-card p-6 sm:p-8 lg:p-10 shadow-xl animate-fade-in dark:bg-card"
              >
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold text-foreground dark:text-foreground"
                >
                  {currentBlog ? "Edit Blog" : "Create New Blog"}
                </Dialog.Title>
                {formError && (
                  <div className="mt-4 p-3 bg-destructive/20 text-destructive rounded-md animate-pulse">
                    {formError}
                  </div>
                )}
                <form onSubmit={handleFormSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Blog Thumbnail (Optional)
                    </label>
                    <input
                      type="file"
                      ref={thumbnailFileInputRef}
                      onChange={handleThumbnailFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-16 rounded-md overflow-hidden border border-border dark:border-border">
                        {thumbnailPreview ? (
                          <Image
                            src={thumbnailPreview}
                            alt="Blog thumbnail preview"
                            width={96}
                            height={64}
                            className="w-full h-full object-cover glow"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground dark:bg-muted dark:text-muted-foreground">
                            No thumbnail
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={triggerThumbnailFileInput}
                        className="px-3 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 dark:text-foreground dark:hover:bg-muted dark:focus:ring-primary"
                      >
                        {thumbnailPreview ? "Change" : "Upload"}
                      </button>
                      {thumbnailPreview && (
                        <button
                          type="button"
                          onClick={removeThumbnail}
                          className="text-sm text-myred hover:text-myred-dark transition-colors duration-200 dark:text-myred dark:hover:text-myred-dark"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Author Photo (Optional)
                    </label>
                    <input
                      type="file"
                      ref={authorFileInputRef}
                      onChange={handleAuthorFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-border dark:border-border">
                        {authorPhotoPreview ? (
                          <Image
                            src={authorPhotoPreview}
                            alt="Author photo preview"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover glow"
                          />
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground dark:bg-muted dark:text-muted-foreground">
                            No photo
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={triggerAuthorFileInput}
                        className="px-3 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 dark:text-foreground dark:hover:bg-muted dark:focus:ring-primary"
                      >
                        {authorPhotoPreview ? "Change" : "Upload"}
                      </button>
                      {authorPhotoPreview && (
                        <button
                          type="button"
                          onClick={removeAuthorPhoto}
                          className="text-sm text-myred hover:text-myred-dark transition-colors duration-200 dark:text-myred dark:hover:text-myred-dark"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Author Name
                    </label>
                    <input
                      type="text"
                      name="authorName"
                      value={formData.author.name || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground">
                      Short Description
                    </label>
                    <input
                      type="text"
                      name="shortDescription"
                      value={formData.shortDescription || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full border border-border rounded-md py-2 px-3 bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:border-border dark:focus:ring-primary dark:focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-muted-foreground dark:text-muted-foreground mb-1">
                      Content
                    </label>
                    <BlogEditor
                      value={formData.description || ""}
                      onChange={handleDescriptionChange}
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="inline-flex justify-center rounded-md border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 dark:bg-card dark:text-foreground dark:hover:bg-muted dark:focus:ring-primary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-myred-dark focus:outline-none focus:ring-2 focus:ring-primary transition-colors duration-200 dark:bg-primary dark:text-primary-foreground dark:hover:bg-myred-dark dark:focus:ring-primary"
                      disabled={isProcessing}
                    >
                      {currentBlog
                        ? isProcessing
                          ? "Updating..."
                          : "Update Blog"
                        : isProcessing
                        ? "Creating..."
                        : "Create Blog"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};