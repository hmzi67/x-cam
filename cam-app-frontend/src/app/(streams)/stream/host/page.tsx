import { redirect } from "next/navigation";
import HostPageImpl from "./page.client";

interface PageProps {
  searchParams: Promise<{
    at?: string;
    rt?: string;
  }>;
}

export default async function HostPage({ searchParams }: PageProps) {
  const { at, rt } = await searchParams; // 👈 await here

  if (!at || !rt) {
    redirect("/");
  }

  const serverUrl = process.env
    .LIVEKIT_WS_URL!.replace("wss://", "https://")
    .replace("ws://", "http://");

  return <HostPageImpl authToken={at} roomToken={rt} serverUrl={serverUrl} />;
}
