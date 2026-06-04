import { NextResponse } from "next/server";
import { clearUserSessionCookie } from "@/utils/auth";

export async function POST() {
  const response = NextResponse.json({ ok: true });
  clearUserSessionCookie(response);
  return response;
}

export async function DELETE() {
  return POST();
}
