import { Alert, Box } from "@mui/material";
import { fetchCategories, fetchStreams } from "@/server-actions/landingpage";
import Landing from "@/components/LandingClient";

export default async function Home({
  searchParams,
}: {
  searchParams?: { filters?: string };
}) {
  const params = await searchParams;

  const filters =
    params?.filters &&  
    typeof params.filters === "string" &&
    params.filters.length > 0
      ? params.filters.split(",")
      : [];
  const streams = await fetchStreams(
    filters.length ? { category: { name: { _in: filters } } } : {}
  );
  const categories = await fetchCategories();
  console.log("Streams fetched:", streams);
  console.log("Categories fetched:", categories);

  if (!streams.success || streams.data.length === 0) {
    return <Alert>No streams available at the moment.</Alert>;
  }
  if (!categories.success || categories.data.length === 0) {
    return <Alert>No categories available at the moment.</Alert>;
  }
  return (
    <Landing streams={streams.data || []} categories={categories.data || []} />
  );
}
