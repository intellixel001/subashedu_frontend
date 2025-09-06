
export default function Section6() {
  const masterclasses = [
    {
      id: 1,
      videoId: "dQw4w9WgXcQ",
      title: "Masterclass on Effective Study Techniques",
      description:
        "Learn how to stay focused, retain information better, and maximize your study time.",
    },
    {
      id: 2,
      videoId: "9bZkp7q19f0",
      title: "Career Planning for Class 12+",
      description:
        "Get expert insights into university admissions, job prep, and skill building after HSC.",
    },
    {
      id: 3,
      videoId: "Zi_XLOBDo_Y",
      title: "Job Interview Essentials",
      description:
        "Learn how to present yourself professionally and answer interview questions with confidence.",
    },
  ];
  return (
    <section className="freeMasterclass px-6 py-12">
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-myred-secondary uppercase">
          Join the Next Free Master class
        </h2>
        <p className="text-gray-400 mt-2 text-sm sm:text-base">
          Upgrade your skills with in-depth sessions hosted by top educators
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {masterclasses.map((masterclass) => (
          <div
            key={masterclass.id}
            className="bg-gray-800 border border-myred/50 rounded-2xl shadow-lg hover:scale-[1.02] hover:shadow-myred/50 transition-all duration-300 ease-in-out overflow-hidden"
          >
            <div className="aspect-video">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${masterclass.videoId}`}
                title={masterclass.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-5">
              <h3 className="text-xl font-semibold text-gray-100 mb-2">
                {masterclass.title}
              </h3>
              <p className="text-gray-400 mb-4 text-sm">
                {masterclass.description}
              </p>
              <button className="bg-myred-dark text-white px-6 py-2 rounded-full hover:bg-myred hover:shadow-myred/50 focus:ring-2 focus:ring-myred focus:ring-offset-2 transition-all text-sm">
                Enroll Free
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
