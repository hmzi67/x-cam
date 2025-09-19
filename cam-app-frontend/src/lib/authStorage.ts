import { AuthenticationData } from "@directus/sdk";
import { cookies } from "next/headers";

class AuthStorage {
  async get() {
    const raw = (await cookies()).get(process.env.NEXT_PUBLIC_DIRECTUS_SESSION_NAME as string)?.value;
    return raw ? (JSON.parse(raw) as AuthenticationData) : null;
  }

  // 🚨 Do not write cookies here (restricted in Next.js 15).
  async set(_data: any) {
    console.warn("⚠️ Use setSessionCookie server action to set cookies.");
  }
}

export const storage = new AuthStorage();
