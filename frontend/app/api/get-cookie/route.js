"use server";

import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const token = (await cookies()).get("token").value;
  const response = NextResponse.json({ token: token }, { status: 200 });
  return response;
}
