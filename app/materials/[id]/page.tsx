import { getSingleMetarials } from "@/app/globalapi/getapi";
import MaterialPurchaseForm from "@/components/MaterialPurchaseForm";
import { getCurrentStudent } from "@/lib/getCurrentStudent";
import SendToLogin from "./SendToLogin";
import SendToPDF from "./SendToPDF";

export const revalidate = 0;
export const fetchCache = "force-no-store";

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
    return <SendToLogin />;
  }
  const student = studentObject?.data.student || null;
  if (!student) {
    return <SendToLogin />;
  }
  const apiData = await getSingleMetarials(id);

  if (!apiData) {
    return <MaterialPurchaseForm materialId={id} />;
  }

  return <SendToPDF id={apiData?._id} />;
}
