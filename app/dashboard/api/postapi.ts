export interface BillingInfo {
  paymentMethod: string;
  transactionId: string;
}

export const enrolCourse = async (
  courseId: string,
  data: BillingInfo
): Promise<unknown> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/course/purchase/${courseId}`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      }
    );

    if (!res.ok) {
      throw new Error(res.statusText || "Failed to enrol in course");
    }

    const json = await res.json();
    return json.data;
  } catch (err) {
    console.error("❌ Error enrolling course:", err);
    throw err;
  }
};
