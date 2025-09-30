import SendToLogin from "@/app/materials/[id]/SendToLogin";
import { getCurrentStudent } from "@/lib/getCurrentStudent";
import LiveClassRoom from "./LiveClassRoom";

export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function PDFReader({
  params,
}: {
  params: Promise<{ roomtoken: string }>;
}) {
  const { roomtoken } = await params;

  const studentObject = await getCurrentStudent();

  if (!roomtoken) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Class token not found
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
  //   const apiData = await getSingleMetarials(id);

  //   if (!apiData) {
  //     return <MaterialPurchaseForm materialId={id} />;
  //   }

  return <LiveClassRoom />;
}
