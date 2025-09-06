import { cookies } from "next/headers";
// import Link from "next/link";
import { CiVideoOn } from "react-icons/ci";
import { FaChalkboardTeacher, FaClock } from "react-icons/fa";

export default async function LiveClassesPage() {
  let liveClasses = [];
  let error = null;

  try {
    liveClasses = await fetchLiveClasses();
  } catch (err) {
    error = err.message;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-red-500">
        <p className="text-lg font-medium mb-2">Could not load live classes</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 py-4">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8 border border-gray-100">
        <div className="bg-[#f7374f] p-4 lg:p-6 text-white">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-3">
            <FaChalkboardTeacher className="text-3xl" />
            Ongoing Live Classes
          </h1>
          <p className="mt-2 opacity-90">
            Join your live classes and continue learning
          </p>
        </div>

        <div className="p-2 md:p-4">
          {liveClasses.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FaClock className="mx-auto text-5xl text-[#f7374f] mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No live classes currently ongoing
              </h3>
              <p className="text-gray-500">
                Check back later or view your upcoming classes
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {liveClasses.map((classItem) => (
                <div
                  key={classItem._id}
                  className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="bg-[#f7374f]/5 p-5 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-[#f7374f]/10 p-3 rounded-full text-[#f7374f]">
                        <CiVideoOn  className="text-xl" />
                      </div>
                      <h3 className="font-bold text-lg">{classItem.title}</h3>
                    </div>

                    <div className="space-y-2 mb-4 flex-1">
                      <p>
                        <span className="font-medium">Subject:</span>{" "}
                        {classItem.subject.charAt(0).toUpperCase() +
                          classItem.subject.slice(1)}
                      </p>
                      <p>
                        <span className="font-medium">Instructor:</span>{" "}
                        {classItem.instructor}
                      </p>
                      <p>
                        <span className="font-medium">Course:</span>{" "}
                        {classItem.course?.title || "N/A"}  
                      </p>
                    </div>

                    <a
                      href={`/dashboard/live-class/${classItem._id}`}
                      className="w-full bg-[#f7374f] text-white px-4 py-2 rounded-lg hover:bg-[#e12d42] hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-auto"
                    >
                      <CiVideoOn/>  Join Live Class
                    </a>
                  </div>
                </div>
              )).reverse()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

async function fetchLiveClasses() {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/live-classes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch live classes");
    }

    const data = await response.json();
    return data.data;
  } catch (err) {
    throw new Error(err.message);
  }
}
