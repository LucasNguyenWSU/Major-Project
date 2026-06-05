import { client } from "@repo/db/client";
import { NextResponse } from "next/server";
import {
  isAdminCredentials,
  setWebAdminSessionCookie,
  setUserSessionCookie,
} from "@/utils/auth";
import { verifyPassword } from "@/utils/passwords";
import { isValidPassword, normalizeUsername } from "@/utils/users";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    username?: unknown;
    password?: unknown;
  };

  const username = normalizeUsername(body.username);
  const password = typeof body.password === "string" ? body.password : "";

  if (!username || !password) {
    return NextResponse.json(
      { error: "Enter a username and password" },
      { status: 400 },
    );
  }

  if (username === "admin") {
    if (!isAdminCredentials(username, password)) {
      return NextResponse.json(
        { error: "Invalid admin username or password" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      user: { role: "admin", displayName: "Admin" },
    });
    setWebAdminSessionCookie(response);
    return response;
  }

  if (!isValidPassword(password)) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 },
    );
  }

  let user;
  try {
    user = await client.db.user.findUnique({
      where: { username },
      select: {
        id: true,
        username: true,
        displayName: true,
        passwordHash: true,
      },
    });
  } catch (error) {
    console.error("Login database lookup failed", error);
    return NextResponse.json(
      { error: "Could not sign in right now. Please try again." },
      { status: 500 },
    );
  }

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({
    user: {
      id: user.id,
      username: user.username,
      displayName: user.displayName,
    },
  });
  setUserSessionCookie(response, user.id);
  return response;
}
