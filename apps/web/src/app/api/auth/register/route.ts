import { client } from "@repo/db/client";
import { NextResponse } from "next/server";
import { setUserSessionCookie } from "@/utils/auth";
import { hashPassword } from "@/utils/passwords";
import {
  isValidDisplayName,
  isValidPassword,
  isValidUsername,
  normalizeDisplayName,
  normalizeUsername,
} from "@/utils/users";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    username?: unknown;
    displayName?: unknown;
    password?: unknown;
  };

  const username = normalizeUsername(body.username);
  const displayName = normalizeDisplayName(body.displayName, username);

  if (username === "admin") {
    return NextResponse.json(
      { error: "Admin is a reserved username" },
      { status: 400 },
    );
  }

  if (!isValidUsername(username)) {
    return NextResponse.json(
      {
        error: "Username must be 3-24 letters, numbers, underscores, or dashes",
      },
      { status: 400 },
    );
  }

  if (!isValidDisplayName(displayName)) {
    return NextResponse.json(
      { error: "Display name must be 2-40 characters" },
      { status: 400 },
    );
  }

  if (!isValidPassword(body.password)) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }

  try {
    const user = await client.db.user.create({
      data: {
        username,
        displayName,
        passwordHash: hashPassword(body.password),
      },
      select: { id: true, username: true, displayName: true },
    });

    const response = NextResponse.json({ user });
    setUserSessionCookie(response, user.id);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Username is already taken" },
      { status: 409 },
    );
  }
}
