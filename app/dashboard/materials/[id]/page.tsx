import PDFViewer from "@/app/components/PDFViewer";
import { getSingleMetarials } from "@/app/globalapi/getapi";
import SendToLogin from "@/app/materials/[id]/SendToLogin";
import MaterialPurchaseForm from "@/components/MaterialPurchaseForm";
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
  if (!student) {
    return <SendToLogin />;
  }
  const apiData = await getSingleMetarials(id);

  console.log({ apiData });

  if (!apiData) {
    return <MaterialPurchaseForm materialId={id} />;
  }

  return <PDFViewer apiData={apiData?.data} />;
}
