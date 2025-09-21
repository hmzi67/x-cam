'use server';

import directus from "@/lib/directus";
import { readItems } from "@directus/sdk";

export type Streams = Awaited<ReturnType<typeof directusFetchStreams>>;
export type Categories = Awaited<ReturnType<typeof directusFetchCategories>>;

export async function fetchStreams(
  filter: any = {}
): Promise<
  { success: true; data: Streams } | { success: false; data: unknown }
> {
  try {
    // Fetch the dropdown data using the second function
    const data = await directusFetchStreams(filter);
    return { success: true, data };
  } catch (error: any) {
    // Handle any error that occurs
    return { success: false, data: JSON.stringify(error.errors) };
  }
}
export async function directusFetchStreams(filter: any = {}) {
  const defaultFilter = { status: "live" };
  const finalFilter = { ...defaultFilter, ...filter };
  const response = await directus.request(
    readItems("streams", {
      filter: finalFilter,
      fields: ["*", { category: ["*"] }],
      sort:["-date_created"]
    })
  );
  return response;
}

export async function fetchCategories(): Promise<
  { success: true; data: Categories } | { success: false; data: unknown }
> {
  try {
    // Fetch the dropdown data using the second function
    const data = await directusFetchCategories();
    return { success: true, data };
  } catch (error: any) {
    // Handle any error that occurs
    return { success: false, data: JSON.stringify(error.errors) };
  }
}

export async function directusFetchCategories() {
  const response = await directus.request(
    readItems("categories", {
      fields: ["*"],
    })
  );
  return response;
}
