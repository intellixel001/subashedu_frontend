import MaterialPurchaseForm from "@/components/MaterialPurchaseForm";
import PDFViewerWrapper from "@/components/PDFViewerWrapper";
import { getCurrentStudent } from "@/lib/getCurrentStudent";

interface PageParams {
  id: string;
}

// Next.js page function
export default async function PDFReader({
  params,
}: {
  params: PageParams; // conforming to PageProps
}) {
  const { id } = params;

  if (!id) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Material not found
      </div>
    );
  }

  const studentObject = await getCurrentStudent();

  if (!studentObject) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Student not found
      </div>
    );
  }

  const student = studentObject.data.student;

  const isPurchased =
    student.coursesEnrolled.some((course) => course.materials.includes(id)) ||
    student.materials.includes(id);

  if (!isPurchased) return <MaterialPurchaseForm materialId={id} />;

  // Use the PDF Viewer component
  return <PDFViewerWrapper materialId={id} />;
}
