import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaUserPlus } from "react-icons/fa";
import sanitizeHtml from "sanitize-html";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Fetch course data from the backend
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/course/${id}`
  );

  if (!res.ok) {
    return notFound();
  }

  const result = await res.json();
  const course = result?.data;

  // Sanitize the description HTML to prevent XSS
  const sanitizedDescription = sanitizeHtml(course?.description || "", {
    allowedTags: ["h2", "h3", "p", "strong", "em", "ul", "ol", "li"],
    allowedAttributes: {},
  });

  // Format price display
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("en-IN").format(price);

  return (
    <main className="w-full min-h-screen pt-30 pb-12 bg-gray-900">
      <section className="max-w-6xl mx-auto px-2 md:px-4 lg:px-10">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Image and Highlights */}
          <div className="lg:w-1/2">
            {/* Course Image */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-myred/30">
              <Image
                src={course?.thumbnailUrl || "/placeholder.png"}
                alt={course?.title || "Course Image"}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            {/* Course Highlights */}
            <div className="mt-8 bg-gray-800/70 backdrop-blur-md p-6 rounded-xl shadow-md border border-myred/30">
              <h3 className="text-xl font-bold mb-4 text-myred-secondary">
                Course Highlights
              </h3>
              <ul className="space-y-3 list-disc pl-6 text-gray-300">
                <li>
                  <strong>Subjects:</strong>{" "}
                  {course?.subjects?.join(", ") || "No subjects specified"}
                </li>
                <li>
                  <strong>Course For:</strong> {course?.courseFor || "N/A"}
                </li>
                <li>
                  <strong>Students Enrolled:</strong>{" "}
                  {course?.studentsEnrolled || 0}
                </li>
                <li>
                  <strong>Price:</strong>{" "}
                  <span className="font-bold text-myred-secondary">
                    ৳{formatPrice(course?.offer_price || 0)}
                  </span>
                  {course?.offer_price && course.offer_price < course.price && (
                    <span className="ml-2 text-sm text-gray-400 line-through">
                      ৳{formatPrice(course.price)}
                    </span>
                  )}
                </li>
              </ul>
              <Link href={`/course/${id}/enrollment/${course.id}`}>
                <button className="w-full mt-6 bg-gradient-to-r from-myred to-myred-secondary text-gray-100 py-3 rounded-lg font-medium hover:bg-myred-dark transition-colors duration-200 shadow-md hover:shadow-myred/50 flex items-center justify-center gap-2 relative overflow-hidden group">
                  <span className="relative z-10 flex items-center gap-2">
                    <FaUserPlus className="text-lg" />
                    Enroll Now
                  </span>
                  <span className="absolute inset-0 bg-myred-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </button>
              </Link>
            </div>
          </div>

          {/* Right Column: Course Details */}
          <div className="lg:w-1/2">
            <div className="bg-gray-800/70 backdrop-blur-md p-6 md:p-8 rounded-xl shadow-md border border-myred/30">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {course?.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-myred/20 text-myred-secondary text-sm px-3 py-1 rounded transition-colors duration-200 hover:bg-myred/30"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-100">
                {course?.title || "Untitled Course"}
              </h1>

              {/* Short Description */}
              <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                {course?.short_description || "No description available"}
              </p>

              {/* Description */}
              {course?.description && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-myred-secondary">
                    Course Description
                  </h3>
                  <div
                    className="prose max-w-none text-gray-300"
                    dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                  />
                </div>
              )}

              {/* Instructors */}
              {course?.instructors?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-4 text-myred-secondary">
                    {course.instructors.length > 1
                      ? "Instructors"
                      : "Instructor"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {course.instructors.map((instructor, index: number) => (
                      <div
                        key={index}
                        className="flex items-center gap-4 p-3 bg-gray-700/50 rounded-lg border border-myred/30"
                      >
                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                          <Image
                            src={instructor.image || "/placeholder-user.png"}
                            alt={instructor.name || "Instructor"}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div>
                          <p className="text-gray-100 font-medium">
                            {instructor.name || "Unknown Instructor"}
                          </p>
                          {instructor.bio && (
                            <p className="text-gray-300 text-sm mt-1">
                              {instructor.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Course Details */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 text-myred-secondary">
                  Course Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-myred/30">
                    <h4 className="font-medium text-gray-100 mb-2">
                      Created At
                    </h4>
                    <p className="text-gray-300">
                      {new Date(
                        course?.createdAt || Date.now()
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="bg-gray-700/50 p-4 rounded-lg border border-myred/30">
                    <h4 className="font-medium text-gray-100 mb-2">
                      Last Updated
                    </h4>
                    <p className="text-gray-300">
                      {new Date(
                        course?.updatedAt || Date.now()
                      ).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}