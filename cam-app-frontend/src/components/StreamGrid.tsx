"use client";

import { getUser } from "@/lib/features/userSlice";
import { useAppSelector } from "@/lib/hooks";
import { Streams, Categories } from "@/types/Schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "./stream/spinner";
import Image from "next/image";

// Mock country flags for the demo
const countryFlags: {[key: string]: string} = {
  "Italy": "🇮🇹",
  "France": "🇫🇷",
  "Brazil": "🇧🇷",
  "USA": "🇺🇸",
  "UK": "🇬🇧",
  "Spain": "🇪🇸",
  "Germany": "🇩🇪",
  "Canada": "🇨🇦",
  "China": "🇨🇳",
  "Russia": "🇷🇺",
  "Colombia": "🇨🇴",
  "Romania": "🇷🇴",
};

export default function StreamGrid({
  streams,
  isLoggedIn,
  balance,
}: {
  streams: Streams[];
  isLoggedIn: boolean;
  balance: number;
}) {
  const canJoinStream = isLoggedIn;
  const router = useRouter();
  const userState = useAppSelector(getUser);
  const [loading, setLoading] = useState(false);
  const [hoveredStreamId, setHoveredStreamId] = useState<string | null>(null);

  // Add mock rating for demonstration purposes
  const getRating = () => {
    return Math.floor(Math.random() * 5) + 1;
  };

  // Get random country flag
  const getRandomFlag = () => {
    const countries = Object.keys(countryFlags);
    const randomCountry = countries[Math.floor(Math.random() * countries.length)];
    return countryFlags[randomCountry];
  };

  const formatViewerCount = (count: number = 0) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleJoinStream = async (streamId: string | undefined) => {
    if (!canJoinStream) {
      router.push("/login");
      return;
    }
    if (!streamId || !userState?.first_name) {
      console.error("Stream ID or user name missing");
      return;
    }

    setLoading(true);
    router.push(`/stream/watch/${streamId}`);
  };

  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {streams.length === 0 ? (
        <div className="col-span-full text-center py-16 text-[#bbb]">
          <div className="text-xl font-semibold">No streams available</div>
          <div className="mt-2 text-sm">Be the first to go live!</div>
        </div>
      ) : (
        streams.map((stream) => {
          // Generate random rating stars for demo
          const rating = getRating();
          const randomFlag = getRandomFlag();
          
          return (
            <div
              key={stream.id}
              className="group relative overflow-hidden cursor-pointer"
              onClick={() => handleJoinStream(stream?.id)}
              onMouseEnter={() => setHoveredStreamId(stream.id)}
              onMouseLeave={() => setHoveredStreamId(null)}
            >
              {/* Star Rating */}
              <div className="absolute top-0 left-0 z-20 m-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-3 h-3 ${i < rating ? 'text-yellow-400' : 'text-gray-500'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Stream Thumbnail */}
              <div className="relative w-full aspect-video overflow-hidden">
                {/* Thumbnail Image */}
                <div className={`relative h-full ${!canJoinStream ? "blur-sm" : ""}`}>
                  {stream.thumbnail_url ? (
                    <img 
                      src={stream.thumbnail_url}
                      alt={stream.title || "Stream thumbnail"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a]"></div>
                  )}
                </div>
                
                {/* Country Flag */}
                <div className="absolute top-1 right-1 z-20 text-lg">
                  {randomFlag}
                </div>
                
                {/* Viewer count */}
                {stream.status === "live" && (
                  <div className="absolute bottom-1 right-1 z-20 flex items-center gap-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                    <span>{Math.floor(Math.random() * 50) + 10}</span>
                  </div>
                )}
                
                {/* Adult Content Overlay for non-logged in users */}
                {!canJoinStream && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/70">
                    <div className="text-white text-center">
                      <div className="text-lg font-bold mb-2">Adult Content</div>
                      <div className="mb-4 text-sm">You Must Be 18+</div>
                      <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold px-3 py-1 rounded-sm text-sm">
                        I Agree
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Streamer Info */}
              <div className="flex items-center p-1 bg-gradient-to-r from-[#1a1a1a] to-[#222] text-white">
                {/* Heart Icon */}
                <button className="text-gray-400 hover:text-red-500 mr-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                
                {/* Streamer Name */}
                <div className="font-medium text-sm truncate text-white">
                  {stream.user_created || stream.title?.split(' ')[0] || "Streamer"}
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
