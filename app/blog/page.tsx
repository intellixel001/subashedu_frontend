/* eslint-disable @typescript-eslint/no-unused-vars */
import Image from "next/image";
import Link from "next/link";
import { FaUserCircle } from "react-icons/fa";

interface Blog {
  _id: string;
  title: string;
  shortDescription: string;
  thumbnail: string;
  author: { name: string; photoUrl?: string };
  createdAt: string;
  updatedAt: string;
}

interface BlogsResponse {
  success: boolean;
  message: string;
  data: {
    blogs: Blog[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalBlogs: number;
    };
  };
}

async function fetchBlogs(
  page: number = 1,
  limit: number = 9
): Promise<BlogsResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/get-blogs?page=${page}&limit=${limit}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blogs");
  }

  return res.json();
}

export const revalidate = 60;

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page } = await searchParams;
  const pageNum = parseInt(page || "1", 10);
  let blogsData: BlogsResponse;

  try {
    blogsData = await fetchBlogs(pageNum);
  } catch (error) {
    return (
      <main className="w-full min-h-screen pt-20 pb-12 bg-gray-900">
        <section className="max-w-6xl mx-auto px-4">
          <p className="text-red-500 text-center">
            Error loading blogs. Please try again later.
          </p>
        </section>
      </main>
    );
  }

  const { blogs, pagination } = blogsData.data;
  const { currentPage, totalPages } = pagination;

  return (
    <main className="w-full min-h-screen pt-20 pb-12 bg-gray-900">
      <section className="max-w-6xl mx-auto px-4 md:px-8 lg:px-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 mt-8 text-gray-100 text-center">
          Explore Our Blogs
        </h1>

        {blogs.length === 0 ? (
          <p className="text-gray-300 text-center">No blogs available.</p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <Link
                  href={`/blog/${blog._id}`}
                  key={blog._id}
                  className="group bg-gray-800/70 backdrop-blur-md rounded-xl overflow-hidden shadow-md border border-myred/30 hover:shadow-myred/50 transition-all duration-300"
                >
                  <div className="relative w-full aspect-[4/3]">
                    <Image
                      src={blog.thumbnail || "/placeholder.png"}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-2 text-gray-100 group-hover:text-myred-secondary transition-colors">
                      {blog.title}
                    </h2>
                    <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                      {blog.shortDescription}
                    </p>
                    <div className="flex items-center gap-3">
                      {blog.author.photoUrl ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={blog.author.photoUrl}
                            alt={blog.author.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ) : (
                        <FaUserCircle className="w-10 h-10 text-gray-400" />
                      )}
                      <div>
                        <p className="text-gray-100 text-sm font-medium">
                          {blog.author.name}
                        </p>
                        <p className="text-gray-400 text-xs">
                          {new Date(blog.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-4">
                <Link
                  href={`/blog?page=${Math.max(currentPage - 1, 1)}`}
                  className={`px-4 py-2 rounded-lg bg-gray-700 text-gray-100 ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-myred hover:text-white"
                  } transition-colors`}
                  aria-disabled={currentPage === 1}
                >
                  Previous
                </Link>
                <span className="px-4 py-2 text-gray-300">
                  Page {currentPage} of {totalPages}
                </span>
                <Link
                  href={`/blog?page=${Math.min(currentPage + 1, totalPages)}`}
                  className={`px-4 py-2 rounded-lg bg-gray-700 text-gray-100 ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-myred hover:text-white"
                  } transition-colors`}
                  aria-disabled={currentPage === totalPages}
                >
                  Next
                </Link>
              </div>
            )}
          </>
        )}
      </section>
    </main>
  );
}
