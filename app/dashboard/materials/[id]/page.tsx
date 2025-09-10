import MaterialPurchaseForm from "@/components/MaterialPurchaseForm";
import PDFViewerWrapper from "@/components/PDFViewerWrapper";
import { getCurrentStudent } from "@/lib/getCurrentStudent";

export default async function PDFReader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const studentObject = await getCurrentStudent();

  if (!id) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Material not found
      </div>
    );
  }

  if (!studentObject) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Student not found
      </div>
    );
  }

  const student = studentObject.data.student;

  const coursesEnrolled = student.coursesEnrolled;
  const isPurchased = coursesEnrolled.some((course) => {
    return course.materials.some((material: string) => material === id);
  });

  const isPurchased2 = student.materials.some((material) => {
    return material === id;
  });
  console.log({ isPurchased2, id });

  // console.log({ isPurchased, id, 1: student });

  if (!isPurchased || !isPurchased2) {
    return <MaterialPurchaseForm materialId={id} />;
  }

  return <PDFViewerWrapper materialId={id} />;
}
