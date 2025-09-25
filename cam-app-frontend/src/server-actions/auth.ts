"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginFormData } from "@/app/(auth)/login/login-form";
import directus, { storage } from "@/lib/directus";
import { readMe, registerUser } from "@directus/sdk";

export type User = {
  id: string;
  message: string;
  refresh_token: string;
  access_token: string;
  expires_at: number;
  expires: number;
  refresh_token_expires_at: number;
  first_name: string;
  last_name: string;
  mfa_code: number;
  mfa_code_expiry: string;
  email: string;
  balance: number;
  role: {
    name: string;
  };
};
export type LoggedInUserType = Awaited<
  ReturnType<typeof directusGetLoggedInUser>
>;

export const getUserData = async () => {
  const cookieStore = await cookies();
  let userdata = cookieStore.get(
    process.env.NEXT_PUBLIC_DIRECTUS_SESSION_NAME as string
  )?.value;
  if (!userdata) return null;
  
  try {
    let userdataObj: User = JSON.parse(userdata);
    return userdataObj;
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};

export const getLoggedInUser = async (): Promise<
  { success: true; data: LoggedInUserType } | { success: false; data: unknown }
> => {
  try {
    const loggedInUser = await directusGetLoggedInUser();
    return { success: true, data: loggedInUser };
  } catch (error: any) {
    return { success: false, data: JSON.stringify(error.errors) };
  }
};

export const directusGetLoggedInUser = async () => {
  return directus.request(
    readMe({
      fields: ["id", "first_name", "last_name", { role: ["name"] }],
    })
  );
};

export async function loginMfaGeneration(
  formData: LoginFormData
): Promise<{ success: true; data: any } | { success: false; data: unknown }> {
  try {
    const res = await directusLoginMfaGeneration(formData);
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, data: JSON.stringify(error.errors) };
  }
}
async function directusLoginMfaGeneration(formData: LoginFormData) {
  const res = await fetch(`${process.env.API_URL}/auth/mfa`, {
    method: "POST",
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
    }),
    headers: { "Content-Type": "application/json" },
  });
  const resJson: { expires_at: string } = await res.json();
  if (!res.ok) {
    throw new Error("Invalid credentials!");
  }
  return resJson;
}

export async function loginMfaVerification(
  formData: LoginFormData
): Promise<{ success: true; data: any } | { success: false; data: unknown }> {
  try {
    const res = await directusLoginMfaVerification(formData);
    return { success: true, data: res };
  } catch (error: any) {
    return { success: false, data: JSON.stringify(error.errors) };
  }
}
async function directusLoginMfaVerification(formData: LoginFormData) {
  const res = await fetch(`${process.env.API_URL}/auth/mfa/login`, {
    method: "POST",
    body: JSON.stringify({
      email: formData.email,
      password: formData.password,
      mfa_code: formData.mfa_code,
    }),
    headers: { "Content-Type": "application/json" },
  });
  const user: User = await res.json();
  // If no error and we have user data, return it
  if (!res.ok && user) {
    throw new Error("Invalid credentials!");
  }

  if (user?.access_token) storage.set(user);

  return user;
}

export const handleSignUp = async (formData: {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<any> => {
  console.log("Registering user with data:", formData);
  const res: any = await directus.request(
    registerUser(formData.email, formData.password, {
      verification_url: `${
        process.env.NEXT_PUBLIC_FRONTEND_URL as string
      }/register/verify`,
      first_name: formData.first_name,
      last_name: formData.last_name,
    })
  );
  //   , {
  //
  //     }
  console.log({ res });
  return true;
};

export async function handleLogout() {
  let cookierStore = await cookies();
  cookierStore.delete(process.env.NEXT_PUBLIC_DIRECTUS_SESSION_NAME as string);
  redirect("/login");
}
export async function verifyEmailToken(token: string): Promise<any> {
  const res = await fetch(
    `${process.env.API_URL}/users/register/verify-email?token=${token}`,
    { method: "GET", cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Verification failed");
  }
  return { success: true };
}
