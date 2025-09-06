import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const cookies = request.cookies;
  const accessToken = cookies.get("accessToken");
  const adminAccessToken = cookies.get("adminAccessToken");
  const staffAccessToken = cookies.get("staffAccessToken");

  const accessTokenValue =
    accessToken && typeof accessToken !== "string" ? accessToken.value : "";
  const adminAccessTokenValue =
    adminAccessToken && typeof adminAccessToken !== "string"
      ? adminAccessToken.value
      : "";
  const staffAccessTokenValue =
    staffAccessToken && typeof staffAccessToken !== "string"
      ? staffAccessToken.value
      : "";

  // Initialize response
  let response = NextResponse.next();

  // student dashboard routes
  if (pathname.startsWith("/dashboard")) {
    try {
      const fetchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/current-student`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `accessToken=${accessTokenValue}`,
          },
          credentials: "include",
        }
      );

      if (!fetchResponse.ok) {
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/login`);
      }

      // Add header to disable DevTools for authenticated dashboard routes
      response = NextResponse.next();
      response.headers.set("X-Debug-Disabled", "true");

      return response;
    } catch (error) {
      console.error("Dashboard middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  // admin routes
  if (pathname.startsWith("/admin")) {
    try {
      const fetchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-admin`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `adminAccessToken=${adminAccessTokenValue}`,
          },
          credentials: "include",
        }
      );

      if (!fetchResponse.ok) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_URL}/admin-login`
        );
      }

      // Add header to disable DevTools for authenticated admin routes
      response = NextResponse.next();
      response.headers.set("X-Debug-Disabled", "true");

      return response;
    } catch (error) {
      console.error("Admin middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  // staff routes
  if (pathname.startsWith("/management")) {
    try {
      const fetchResponse = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/staff/get-staff`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Cookie: `staffAccessToken=${staffAccessTokenValue}`,
          },
          credentials: "include",
        }
      );

      if (!fetchResponse.ok) {
        return NextResponse.redirect(
          `${process.env.NEXT_PUBLIC_URL}/management-login`
        );
      }

      // Add header to disable DevTools for authenticated staff routes
      response = NextResponse.next();
      response.headers.set("X-Debug-Disabled", "true");

      return response;
    } catch (error) {
      console.error("Staff middleware error:", error);
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }
  }

  return response;
}

// Only apply middleware to specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/management/:path*"],
};