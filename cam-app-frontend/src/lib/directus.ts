
import { Schema } from "@/types/Schema";
import {
  createDirectus,
  rest,
  authentication,
  graphql,
  AuthenticationData,
} from "@directus/sdk";

import { cookies } from "next/headers";

class AuthStorage {
  async get() {
    const cookieStore = await cookies();
    const data = cookieStore.get(
      process.env.NEXT_PUBLIC_DIRECTUS_SESSION_NAME as string
    )?.value;
    return data ? (JSON.parse(data) as AuthenticationData) : null;
  }
  async set(data: any) {
    console.log("Set Function is running")
    console.log("Setting data:", data); // Debugging line
    const cookieStore = await cookies();
    cookieStore.set(
      process.env.NEXT_PUBLIC_DIRECTUS_SESSION_NAME as string,
      JSON.stringify(data),
      {
        secure: true,
        httpOnly: true,
        sameSite: "strict",
        path: "/",
      }
    );
  }
}

export const storage = new AuthStorage();

const directus = createDirectus<Schema>(process.env.API_URL as string)
  .with(
    authentication("cookie", {
      credentials: "include",
      autoRefresh: true,
      storage,
    })
  )
  .with(
    rest({
      onRequest: (options) => ({ ...options, cache: "no-store" }),
      credentials: "include",
    })
  );

export default directus;
