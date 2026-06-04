import { NextResponse } from "next/server";
import { getCurrentCommenter } from "@/utils/auth";

export async function GET() {
  const commenter = await getCurrentCommenter();
  return NextResponse.json({ user: commenter });
}
