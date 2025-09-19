"use client";
import Sidebar from "@/components/Sidebar";
import Filters from "@/components/Filters";
import StreamGrid from "@/components/StreamGrid";
import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import { Categories, Streams } from "@/types/Schema";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getUser } from "@/lib/features/userSlice";
import { useFormState } from "react-dom";

export default function Landing({
  streams,
  categories,
}: {
  streams: Streams[];
  categories: Categories[];
}) {
  const userState = useAppSelector(getUser);
  console.log({ userState });
  const isLoggedIn = !!userState?.id;
  const balance = 0;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  const router = useRouter();
  const handleFilterChange = async (key: string, value: string) => {
    const query = new URLSearchParams();
    if (value) query.set(key, value);
    router.push(`/stream?${query.toString()}`); // Simple redirect for now; enhance with search params
  };
  if (!isMounted) return null;
  return (
    <Box
      sx={{
        flexGrow: 1,
        bgcolor: "#121212",
        color: "white",
        minHeight: "100vh",
      }}
    >
      <Header categories={categories || []} />
      <Box sx={{ display: "flex", p: 2 }}>
        <Sidebar categories={categories || []} />
        <Box sx={{ flexGrow: 1, ml: 2 }}>
          <Filters
            region=""
            age=""
            ethnicity=""
            fetish=""
            language=""
            onFilterChange={handleFilterChange}
          />
          <StreamGrid
            streams={streams || []}
            isLoggedIn={isLoggedIn}
            balance={balance}
          />
        </Box>
      </Box>
    </Box>
  );
}
