// // middleware.ts
// import { NextRequest, NextResponse } from "next/server";

// export async function middleware(request: NextRequest) {
//   const pathname = request.nextUrl.pathname;

//   const cookies = request.cookies;
//   const accessToken = cookies.get("accessToken");
//   const adminAccessToken = cookies.get("adminAccessToken");
//   const staffAccessToken = cookies.get("staffAccessToken");

//   const accessTokenValue =
//     accessToken && typeof accessToken !== "string" ? accessToken.value : "";
//   const adminAccessTokenValue =
//     adminAccessToken && typeof adminAccessToken !== "string"
//       ? adminAccessToken.value
//       : "";
//   const staffAccessTokenValue =
//     staffAccessToken && typeof staffAccessToken !== "string"
//       ? staffAccessToken.value
//       : "";

//   // student dashboard routes
//   if (pathname.startsWith("/dashboard")) {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/student/current-student`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Cookie: `accessToken=${accessTokenValue}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         return NextResponse.redirect(process.env.NEXT_PUBLIC_URL);
//       }

//       return NextResponse.next();
//     } catch (error) {
//       console.error("Dashboard middleware error:", error);
//       return NextResponse.json(
//         { error: "Internal server error" },
//         { status: 500 }
//       );
//     }
//   }

//   // admin routes
//   if (pathname.startsWith("/admin")) {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/get-admin`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Cookie: `adminAccessToken=${adminAccessTokenValue}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         return NextResponse.redirect(
//           `${process.env.NEXT_PUBLIC_URL}/admin-login`
//         );
//       }

//       return NextResponse.next();
//     } catch (error) {
//       console.error("Admin middleware error:", error);
//       return NextResponse.json(
//         { error: "Internal server error" },
//         { status: 500 }
//       );
//     }
//   }

//   // staff routes
//   if (pathname.startsWith("/staff")) {
//     try {
//       const response = await fetch(
//         `${process.env.NEXT_PUBLIC_SERVER_URL}/api/staff/get-staff`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Cookie: `staffAccessToken=${staffAccessTokenValue}`,
//           },
//           credentials: "include",
//         }
//       );

//       if (!response.ok) {
//         return NextResponse.redirect(
//           `${process.env.NEXT_PUBLIC_URL}/staff-login`
//         );
//       }

//       return NextResponse.next();
//     } catch (error) {
//       console.error("Staff middleware error:", error);
//       return NextResponse.json(
//         { error: "Internal server error" },
//         { status: 500 }
//       );
//     }
//   }

//   return NextResponse.next();
// }

// // Only apply middleware to specific routes
// export const config = {
//   matcher: ["/dashboard/:path*", "/admin/:path*", "/staff/:path*"],
// };


