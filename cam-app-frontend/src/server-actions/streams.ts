"use server";
import directus from "@/lib/directus";
import { Streams } from "@/types/Schema";
import { createItem, readItem, updateItem } from "@directus/sdk";
import { cookies } from "next/headers";

fetchStreamById;
export type Stream = Awaited<ReturnType<typeof directusFetchStream>>;
export async function fetchStreamById(
  id: string
): Promise<
  { success: true; data: Stream } | { success: false; data: unknown }
> {
  try {
    // Fetch the dropdown data using the second function
    const data = await directusFetchStream(id);
    return { success: true, data };
  } catch (error: any) {
    // Handle any error that occurs
    return { success: false, data: JSON.stringify(error.errors) };
  }
}
export async function directusFetchStream(id: string) {
  const response = await directus.request(
    readItem("streams", id, {
      fields: ["*", { category: ["*"] }],
    })
  );
  return response;
}
export async function endStream(id: string) {
  const response = await directus.request(
    updateItem("streams", id, {
      status: "ended",
    })
  );
  return response;
}

export async function createAnItem(
  collection: string,
  payload: Partial<Streams>
): Promise<
  { success: true; data: Stream } | { success: false; data: unknown }
> {
  try {
    // Fetch the dropdown data using the second function
    const data = await directusCreateAnItem(collection, payload);
    return { success: true, data };
  } catch (error: any) {
    // Handle any error that occurs
    return { success: false, data: JSON.stringify(error.errors) };
  }
}

async function directusCreateAnItem(
  collection: any,
  payload: Partial<Streams>
) {
  const response = await directus.request(createItem(collection, payload));
  return response;
}
export async function getLivekitToken(room: string, role: string, name?: string) {
  const cookieStore = await cookies();
  const cookieData = cookieStore.get("directus_data")?.value;
  const token = JSON.parse(cookieData as string)?.access_token;
  if (!token) throw new Error("You are not signed in.");
  const query = [`role=${encodeURIComponent(role)}`];
  if (name) query.push(`name=${encodeURIComponent(name)}`);
  const res = await fetch(`${process.env.API_URL}/livekit/token/${room}?${query.join("&")}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch LiveKit token");
  }
  return res.json();
}
export async function startPrivateRoom(streamId: string, viewerId: string) {
  const res = await fetch(`${process.env.API_URL}/livekit/private-room`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ streamId, viewerId }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to start private room");
  }

  return res.json(); // { room: "..." }
}
