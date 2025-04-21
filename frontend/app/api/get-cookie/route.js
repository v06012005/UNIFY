// "use server";

// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function GET() {
//   const token = (await cookies()).get("token").value;
//   const response = NextResponse.json({ token: token }, { status: 200 });
//   return response;
// }
"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const tokenCookie = (await cookies()).get("token");

  if (!tokenCookie) {
    return NextResponse.json(
      { error: "Token not found" },
      { status: 404 }
    );
  }

  const token = tokenCookie.value;
  return NextResponse.json({ token: token }, { status: 200 });
}
