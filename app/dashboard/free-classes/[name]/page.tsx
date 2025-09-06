import { cookies } from "next/headers";
import Link from "next/link";
import { FaExclamationTriangle, FaPlayCircle, FaYoutube } from "react-icons/fa";

function getYouTubeVideoId(url) {
  const regex = /(?:youtube\.com\/(?:watch\?v=|live\/|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

async function getClasses(name) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || "";

  const apiUrl = `${process.env.SERVER_URL}/api/student/get-free-classes/${name}`;

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken ? `Bearer ${accessToken}` : "",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      if (res.status === 401) {
        throw new Error("Unauthorized: Please log in again");
      }
      throw new Error(`HTTP error: ${res.status} ${res.statusText} - ${errorText}`);
    }

    const result = await res.json();

    if (!result.success) {
      throw new Error(result.message || "Error fetching classes");
    }

    const data = Array.isArray(result.data) ? result.data : [];
    return { data, error: null };
  } catch (error) {
    console.error("Error fetching classes:", error);
    return { data: [], error: error.message || "Failed to connect to the server. Please try again later." };
  }
}

export default async function ClassesPage({ params }) {
  const { name } = await params;

  if (!["hsc", "ssc", "job", "admission"].includes(name)) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="max-w-6xl mx-auto text-center">
          <FaExclamationTriangle className="text-4xl text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800">Invalid Category</h1>
          <p className="mt-2 text-gray-600">
            Please select a valid category (HSC, SSC, or Job).
          </p>
          <Link
            href="/dashboard/free-classes"
            className="mt-4 inline-block text-[#F7374F] hover:underline"
          >
            Go Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  const { data: classes, error } = await getClasses(name);

  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#F7374F] uppercase">
            Free {name.toUpperCase()} ClasseS
          </h2>
          <p className="text-gray-600 mt-2 text-sm sm:text-base">
            Upgrade your skills with in-depth sessions hosted by top educators
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-center">
            <FaExclamationTriangle className="text-2xl text-red-500 mx-auto mb-2" />
            <p className="text-red-700">{error}</p>
            <Link
              href="/dashboard/free-classes"
              className="mt-2 inline-block text-[#F7374F] hover:underline"
            >
              Go Back to Categories
            </Link>
            {error.includes("Unauthorized") && (
              <Link
                href="/login"
                className="mt-2 ml-4 inline-block text-[#F7374F] hover:underline"
              >
                Log In
              </Link>
            )}
          </div>
        )}

        {!error && classes.length === 0 && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
            <FaExclamationTriangle className="text-2xl text-yellow-500 mx-auto mb-2" />
            <p className="text-yellow-700">
              No free classes available for {name.toUpperCase()}.
            </p>
            <Link
              href="/dashboard/free-classes"
              className="mt-2 inline-block text-[#F7374F] hover:underline"
            >
              Go Back to Categories
            </Link>
          </div>
        )}

        {!error && classes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {classes.map((classItem) => {
              const videoId = getYouTubeVideoId(classItem.videoLink);
              return (
                <div
                  key={classItem._id}
                  className="relative bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 group"
                >
                  {/* Thumbnail with Play Icon Overlay */}
                  <div className="relative aspect-video">
                    {videoId ? (
                      <>
                        <iframe
                          className="w-full h-full"
                          src={`https://www.youtube.com/embed/${videoId}`}
                          title={classItem.title}
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FaPlayCircle className="text-white text-4xl" />
                        </div>
                      </>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">Invalid YouTube URL</p>
                      </div>
                    )}
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                      {classItem.title}
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm line-clamp-3">
                      {classItem.subject || "No description available"}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3">
                      <Link
                        href={`/dashboard/free-classes/${name}/${classItem._id}`}
                        className="flex items-center justify-center bg-[#F7374F] text-white px-4 py-2 rounded-full hover:bg-[#e02a3f] transition-all duration-300 text-sm font-medium w-full"
                      >
                        <FaPlayCircle className="mr-2 text-lg" />
                        Watch Now
                      </Link>
                      {videoId && (
                        <Link
                          href={classItem.videoLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-900 transition-all duration-300 text-sm font-medium w-full"
                        >
                          <FaYoutube className="mr-2 text-lg" />
                          Watch on YouTube
                        </Link>
                      )}
                    </div>
                  </div>

                  {/* Decorative Badge */}
                  <div className="absolute top-4 left-4 bg-[#F7374F] text-white text-xs font-semibold px-2 py-1 rounded-full">
                    Free
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}