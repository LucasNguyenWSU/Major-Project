import { client } from "@repo/db/client";
import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Commenter } from "@/types/commenting";

const WEB_AUTH_COOKIE = "web_auth_token";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

type JwtPayload = {
  sub?: unknown;
  role?: unknown;
  exp?: unknown;
  iat?: unknown;
  [key: string]: unknown;
};

function encodeJson(value: unknown) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function signValue(value: string) {
  return createHmac("sha256", process.env.JWT_SECRET ?? "secret")
    .update(value)
    .digest("base64url");
}

function signJwt(payload: JwtPayload) {
  const now = Math.floor(Date.now() / 1000);
  const header = encodeJson({ alg: "HS256", typ: "JWT" });
  const body = encodeJson({
    ...payload,
    iat: now,
    exp: now + SESSION_MAX_AGE_SECONDS,
  });
  const unsignedToken = `${header}.${body}`;
  return `${unsignedToken}.${signValue(unsignedToken)}`;
}

function verifyJwt(token: string | undefined) {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  if (!header || !body || !signature) return null;

  const expectedSignature = signValue(`${header}.${body}`);
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);

  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const decodedHeader = JSON.parse(
      Buffer.from(header, "base64url").toString("utf8"),
    ) as { alg?: unknown };
    if (decodedHeader.alg !== "HS256") return null;

    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as JwtPayload;

    if (
      typeof payload.exp === "number" &&
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function getUserIdFromPayload(payload: JwtPayload | null) {
  if (!payload || payload.role !== "user") return null;
  const userId = Number(payload.sub);
  return Number.isInteger(userId) && userId > 0 ? userId : null;
}

function getAdminFromPayload(payload: JwtPayload | null) {
  return payload?.role === "admin"
    ? { role: "admin" as const, displayName: "Admin" }
    : null;
}

export function setUserSessionCookie(response: NextResponse, userId: number) {
  response.cookies.set(
    WEB_AUTH_COOKIE,
    signJwt({ role: "user", sub: userId }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    },
  );
}

export function clearUserSessionCookie(response: NextResponse) {
  response.cookies.set(WEB_AUTH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export function setWebAdminSessionCookie(response: NextResponse) {
  response.cookies.set(WEB_AUTH_COOKIE, signJwt({ role: "admin" }), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
}

export function isAdminCredentials(username: string, password: string) {
  return (
    username === "admin" && password === (process.env.PASSWORD || "123456")
  );
}

export async function getCurrentPublicUser() {
  const serverCookies = await cookies();
  const payload = verifyJwt(serverCookies.get(WEB_AUTH_COOKIE)?.value);
  const userId = getUserIdFromPayload(payload);
  if (!userId) return null;

  return client.db.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, displayName: true },
  });
}

export async function getCurrentCommenter(): Promise<Commenter | null> {
  const serverCookies = await cookies();
  const payload = verifyJwt(serverCookies.get(WEB_AUTH_COOKIE)?.value);
  const admin = getAdminFromPayload(payload);
  if (admin) return admin;

  const userId = getUserIdFromPayload(payload);
  if (!userId) return null;

  const user = await client.db.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, displayName: true },
  });

  return user ? { role: "user", ...user } : null;
}
