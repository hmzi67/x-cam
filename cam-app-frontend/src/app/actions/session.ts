'use server';

import { cookies } from "next/headers";

export async function setSessionCookie(data: any) {
  (await cookies()).set(
    process.env.NEXT_PUBLIC_DIRECTUS_SESSION_NAME as string,
    JSON.stringify(data),
    {
      secure: true,
      httpOnly: true,
      sameSite: "strict",
      path: '/',
    }
  );
}
