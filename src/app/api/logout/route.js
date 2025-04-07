import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  const serialized = serialize("userToken", null, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
  const response = NextResponse.json({
    status: 200,
    message: "Se cerró la sesión",
  });
  response.headers.set("Set-Cookie", serialized);
  return response;
}
