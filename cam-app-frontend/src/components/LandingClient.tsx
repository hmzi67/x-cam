"use client";
import Sidebar from "@/components/Sidebar";
import Filters from "@/components/Filters";
import StreamGrid from "@/components/StreamGrid";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/lib/hooks";
import { getUser } from "@/lib/features/userSlice";
import { Categories, Streams } from "@/types/Schema";

export default function Landing({
  streams,
  categories,
}: {
  streams: Streams[];
  categories: Categories[];
}) {
  const userState = useAppSelector(getUser);
  const isLoggedIn = !!userState?.id;
  const balance = 0;
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  // Filter handler for Filters component
  const handleFilterChange = (key: string, value: string) => {
    const query = new URLSearchParams();
    if (value) query.set(key, value);
    window.location.href = `/stream?${query.toString()}`;
  };
  if (!isMounted) return null;
  return (
    <div className="min-h-screen bg-[#181818] text-white flex flex-col">
      {/* Header */}
      <Header categories={categories || []} />
      <div className="flex flex-1 w-full">
        {/* Sidebar */}
        <aside className="hidden md:block w-64 bg-[#1a1a1a] border-r border-[#222] p-0">
          <Sidebar categories={categories || []} />
        </aside>
        {/* Main Content */}
        <main className="flex-1 px-2 md:px-8 py-4">
          {/* Filters Row */}
          <div className="mb-4">
            <Filters
              region=""
              age=""
              ethnicity=""
              fetish=""
              language=""
              onFilterChange={handleFilterChange}
            />
          </div>
          {/* Stream Grid */}
          <StreamGrid
            streams={streams || []}
            isLoggedIn={isLoggedIn}
            balance={balance}
          />
        </main>
      </div>
    </div>
  );
}
