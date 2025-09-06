import CommonCourseClient from "@/app/components/CommonCourseClient";
import styles from "../../styles/AllCourses.module.css";

export default async function AllCourses({ params }) {
  const { name } = await params;
  const decodedCategory = decodeURIComponent(name);

  try {
    // Fetch courses from the API
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/courses/${name}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch courses: ${response.statusText}`);
    }

    const { success, data: courses } = await response.json();

    if (!success || !courses || courses.length === 0) {
      return (
        <main className={`${styles.allCourses} w-full min-h-screen bg-gray-900`}>
          <section className="mx-auto px-6 md:px-8 lg:px-20 py-8 bg-transparent">
            <h1 className="text-3xl md:text-4xl text-center uppercase text-myred-secondary font-bold mb-8">
              {`${decodedCategory} Courses`}
            </h1>
            <p className="text-center text-gray-300">
              No courses found for this category.
            </p>
          </section>
        </main>
      );
    }

    return (
      <main className={`${styles.allCourses} w-full min-h-screen bg-gray-900`}>
        <section className="mx-auto px-6 md:px-8 lg:px-20 py-8 bg-transparent">
          <h1 className="text-3xl md:text-4xl text-center uppercase text-myred-secondary font-bold mb-8">
            {`${decodedCategory} Courses`}
          </h1>
          <CommonCourseClient coursesData={courses} name={decodedCategory} />
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error fetching courses:", error.message);
    return (
      <main className={`${styles.allCourses} w-full min-h-screen bg-gray-900`}>
        <section className="mx-auto px-6 md:px-8 lg:px-20 py-8 bg-transparent">
          <h1 className="text-3xl md:text-4xl text-center uppercase text-myred-secondary font-bold mb-8">
            {`${decodedCategory} Courses`}
          </h1>
          <p className="text-center text-gray-300">
            An error occurred while fetching courses. Please try again later.
          </p>
        </section>
      </main>
    );
  }
}