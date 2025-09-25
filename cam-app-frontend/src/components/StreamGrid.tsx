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
  console.log("streams in StreamGrid:", streams);
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
      router.push("/register");
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

  // Add keyframes for StreamGrid animations if not already present
  if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('streamgrid-animations');
    if (!existingStyle) {
      const style = document.createElement('style');
      style.id = 'streamgrid-animations';
      style.textContent = `
        @keyframes thumbnail-pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes status-pulse {
          0%, 100% { opacity: 0.8; box-shadow: 0 0 5px rgba(239, 68, 68, 0.5); }
          50% { opacity: 1; box-shadow: 0 0 15px rgba(239, 68, 68, 0.8); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {streams.length === 0 ? (
        <div className="col-span-full text-center py-16 text-[#bbb] relative">
          {/* Enhanced empty state with glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-fuchsia-600/10 to-purple-600/5 rounded-lg opacity-50"></div>
          <div className="text-xl font-semibold relative z-10 drop-shadow-[0_0_8px_rgba(192,38,211,0.5)]">No streams available</div>
          <div className="mt-2 text-sm relative z-10">Be the first to go live!</div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-8 rounded-full bg-fuchsia-600/20 blur-xl"></div>
        </div>
      ) : (
        streams.map((stream) => {
          // Generate random rating stars for demo
          const rating = getRating();
          const randomFlag = getRandomFlag();
          const isHovered = hoveredStreamId === stream.id;
          
          return (
            <div
              key={stream.id}
              className="group relative overflow-hidden cursor-pointer rounded-lg border border-gray-800 transition-all duration-300 hover:border-fuchsia-500/50 hover:scale-[1.02]"
              onClick={() => handleJoinStream(stream?.id)}
              onMouseEnter={() => setHoveredStreamId(stream.id)}
              onMouseLeave={() => setHoveredStreamId(null)}
            >
              {/* Enhanced outer glow effect on hover */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-purple-600/0 to-fuchsia-600/0 group-hover:from-purple-600/30 group-hover:to-fuchsia-600/30 rounded-lg opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 ${isHovered ? 'shadow-[0_0_15px_rgba(192,38,211,0.6)]' : ''}`}></div>
              
              {/* Star Rating with enhanced glow */}
              <div className="absolute top-0 left-0 z-20 m-1.5 bg-black/40 px-1 py-0.5 rounded">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-3 h-3 ${i < rating ? 'text-yellow-400 drop-shadow-[0_0_3px_rgba(250,204,21,0.8)]' : 'text-gray-500'}`} 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              
              {/* Stream Thumbnail with enhanced effects */}
              <div className="relative w-full aspect-video overflow-hidden rounded-t-lg group-hover:scale-[1.01] transition-all duration-700">
                {/* Thumbnail Image with animated hover - removed blur effect */}
                <div className="relative h-full group-hover:brightness-110 transition-all duration-300">
                  {stream.thumbnail_url ? (
                    <img 
                      src={stream.thumbnail_url}
                      alt={stream.title || "Stream thumbnail"}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03] group-hover:animate-[thumbnail-pulse_4s_ease-in-out_infinite]"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] group-hover:from-[#1e1e1e] group-hover:to-[#322a3a] transition-all duration-500"></div>
                  )}
                  
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                {/* Live status indicator with enhanced glow */}
                {stream.status === "live" && (
                  <div className="absolute top-1 right-1 z-20 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded animate-[status-pulse_2s_ease-in-out_infinite] shadow-[0_0_10px_rgba(239,68,68,0.7)]">
                    <span className="relative">LIVE</span>
                  </div>
                )}
                
                {/* Country Flag with enhanced display */}
                <div className="absolute top-1 right-12 z-20 text-lg bg-black/30 rounded overflow-hidden group-hover:scale-110 transition-transform duration-300">
                  <span className="drop-shadow-lg">{randomFlag}</span>
                </div>
                
                {/* Enhanced Viewer count */}
                {stream.status === "live" && (
                  <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1.5 bg-black/70 text-white text-xs px-2 py-1 rounded group-hover:bg-gradient-to-r group-hover:from-purple-800/90 group-hover:to-fuchsia-800/90 transition-all duration-300 group-hover:shadow-[0_0_10px_rgba(192,38,211,0.5)]">
                    {/* Eye icon */}
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{Math.floor(Math.random() * 50) + 10}</span>
                  </div>
                )}
                
                {/* Join Now button - only shown on hover for non-logged in users */}
                {!canJoinStream && isHovered && (
                  <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-gradient-to-b from-black/70 to-purple-900/60 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <div className="text-white text-center">
                      <button className="bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-700 hover:to-purple-700 text-white font-bold px-6 py-2 rounded-full text-sm shadow-[0_0_15px_rgba(192,38,211,0.7)] transition-all duration-300 transform scale-95 hover:scale-105">
                        <span className="drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]">Join Now</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Enhanced Streamer Info with glowing effects */}
              <div className="flex items-center p-2 bg-gradient-to-r from-[#1a1a1a] to-[#222] text-white relative overflow-hidden rounded-b-lg">
                {/* Background glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-purple-600/10 to-fuchsia-600/10 transition-opacity duration-300"></div>
                
                {/* Animated shine effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-fuchsia-400/10 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_2s_ease-in-out_infinite]"></div>
                
                {/* Heart Icon with enhanced effects */}
                <button className="text-gray-400 hover:text-red-500 mr-2 relative group/heart">
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover/heart:opacity-100 group-hover/heart:shadow-[0_0_8px_rgba(239,68,68,0.7)] transition-opacity duration-300"></span>
                  <svg className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/heart:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
                
                {/* Streamer Name with enhanced styling */}
                <div className="font-medium text-sm truncate text-white group-hover:text-fuchsia-200 transition-colors duration-300 relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(217,70,219,0.5)]">
                  {(stream.user_created?.first_name + " " + stream.user_created?.last_name) || stream.title?.split(' ')[0] || "Streamer"}
                </div>
                
                {/* Status Badge */}
                <div className="ml-auto bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-xs px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 shadow-[0_0_10px_rgba(192,38,211,0.5)]">
                  <span className="drop-shadow-sm">Online</span>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
