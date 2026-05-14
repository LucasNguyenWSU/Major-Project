import { env } from "@repo/env/admin";
import { cookies } from "next/headers";
import * as jwt from "jsonwebtoken";

export async function isLoggedIn() {
  const userCookies = await cookies();
  const token = userCookies.get("auth_token")?.value;
  if (!token) return false;

  try {
    jwt.verify(token, env.JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}
