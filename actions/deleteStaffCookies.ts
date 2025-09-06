"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";


export async function deleteStaffCookies() {


  const cookieStore = await cookies();
  cookieStore.delete("staffAccessToken");
  cookieStore.delete("staffRefreshToken");

    redirect("/management-login")
}
