import { getLoggedInUser } from "@/server-actions/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const refreshToken = (await cookies()).get(
    process.env.NEXT_PUBLIC_DIRECTUS_SESSION_NAME as string
  )?.value;

  // if (!refreshToken) return redirect("/login");
  // const user = await getLoggedInUser();
  // if (user.success) {
  //   return redirect("/stream");
  // } else {
  //   return redirect("/login");
  // }
  return redirect("/stream");
}
