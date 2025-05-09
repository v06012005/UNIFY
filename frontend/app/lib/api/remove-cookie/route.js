// "use server"

// import {NextResponse} from "next/server";
// export async function GET() {
//     const response = NextResponse.json({message: 'Cookie remove successfully'}, {status: 200});
//     response.cookies.set('token', '', {
//         maxAge: 0,
//         path: '/'
//     });
//     return response;
// }
"use server";

import { NextResponse } from "next/server";

export async function GET() {
  const response = NextResponse.json(
    { message: "Cookie removed successfully" },
    { status: 200 }
  );

  response.cookies.set("token", "", {
    expires: new Date(0), 
    path: "/",            
  });

  return response;
}
