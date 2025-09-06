import Image from "next/image";
import { notFound } from "next/navigation";
import { FaUserCircle } from "react-icons/fa";
import sanitizeHtml from "sanitize-html";

interface Blog {
  _id: string;
  title: string;
  shortDescription: string;
  description: string;
  thumbnail: string;
  author: { name: string; photoUrl?: string };
  createdAt: string;
  updatedAt: string;
}

interface BlogResponse {
  success: boolean;
  message: string;
  data: Blog;
}

async function fetchBlog(id: string): Promise<BlogResponse> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/blog/${id}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch blog");
  }

  return res.json();
}

export const revalidate = 300;

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  let blog: Blog;

  try {
    const result = await fetchBlog(id);
    blog = result.data;
  } catch (error) {
    console.log("Error fetching blog:", error);
    return notFound();
  }

  // Sanitize the description HTML to prevent XSS
  const sanitizedDescription = sanitizeHtml(blog.description || "", {
    allowedTags: [
      "h2",
      "h3",
      "p",
      "strong",
      "em",
      "ul",
      "ol",
      "li",
      "a",
      "img",
    ],
    allowedAttributes: {
      a: ["href", "target"],
      img: ["src", "alt"],
    },
  });

  return (
    <main className="w-full min-h-screen pt-20 pb-12 bg-gray-900">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Blog Thumbnail */}
        <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8 shadow-lg border border-myred/30">
          <Image
            src={blog.thumbnail || "/placeholder.png"}
            alt={blog.title || "Blog Image"}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        {/* Blog Header: Title and Short Description */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-gray-100 mb-4 leading-tight">
            {blog.title}
          </h1>
          <p className="text-gray-300 text-lg md:text-xl italic leading-relaxed mb-4">
            {blog.shortDescription}
          </p>
        </header>

        {/* Author Info */}
        <div className="mb-8 bg-gray-800/70 backdrop-blur-md p-6 rounded-lg shadow-md border border-myred/30">
          <div className="flex items-center gap-4">
            {blog.author.photoUrl ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src={blog.author.photoUrl}
                  alt={blog.author.name}
                  fill
                  className="object-cover"
                  sizes="48px"
                />
              </div>
            ) : (
              <FaUserCircle className="w-12 h-12 text-gray-400" />
            )}
            <div>
              <p className="text-gray-100 font-semibold text-lg">
                By {blog.author.name}
              </p>
              <p className="text-gray-500 text-sm">
                Published on{"     "}
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}{" "}
                &bull; Updated on{" "}
                {new Date(blog.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Blog Content */}
        <section className="mb-12 prose prose-lg prose-invert max-w-none text-gray-300">
          <div dangerouslySetInnerHTML={{ __html: sanitizedDescription }} />
        </section>
      </article>
    </main>
  );
}
