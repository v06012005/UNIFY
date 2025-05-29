"use server"

import {NextResponse} from "next/server";
export async function POST(req) {
    const { token } = await req.json();
    if(!token) return NextResponse.json({ error: "refreshToken is missing" }, { status: 400 });
    const response = NextResponse.json({message: 'Cookie set successfully'}, {status: 200});
    response.cookies.set('token', token, {
        httpOnly: true,
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7
    });
    return response;
}