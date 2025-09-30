import { getSingleClassById } from "@/app/globalapi/getapi";

import SendToLogin from "@/app/materials/[id]/SendToLogin";
import { getCurrentStudent } from "@/lib/getCurrentStudent";
import { cookies } from "next/headers";
import RedirectToCourse from "./RedirectToCourse";
import ViewClass from "./ViewClass";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const studentObject = await getCurrentStudent();
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!studentObject?.data) {
    return <SendToLogin />;
  }

  // fetch single class
  const data = await getSingleClassById(id, accessToken);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {data?.data ? (
        <ViewClass freeClass={data?.data} />
      ) : (
        <RedirectToCourse id={data?.id} />
      )}
    </div>
  );
}
