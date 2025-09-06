"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function deleteAdminCookies() {


  const cookieStore = await cookies();
  cookieStore.delete("adminAccessToken");
  cookieStore.delete("adminRefreshToken");

    redirect("/admin-login")
}
