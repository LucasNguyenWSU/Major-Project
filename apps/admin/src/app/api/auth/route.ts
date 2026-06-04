import { NextResponse } from "next/server";
import { env } from "@repo/env/admin";
import * as jwt from "jsonwebtoken";

const PASSWORD = "123456";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const { password } = await request.json().catch(() => ({ password: "" }));

  const expectedPassword = env.PASSWORD || PASSWORD;
  if (password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  const token = jwt.sign({ role: "admin" }, env.JWT_SECRET, {
    expiresIn: "7d",
  });

  response.cookies.set("auth_token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set("auth_token", "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
