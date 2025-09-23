"use client";

import { getUser } from "@/lib/features/userSlice";
import { useAppSelector } from "@/lib/hooks";
import { Streams, Categories } from "@/types/Schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Spinner } from "./stream/spinner";

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

  const getStreamStatus = (stream: Streams) => {
    if (stream.status === "live") {
      return { color: "bg-green-600", text: "LIVE" };
    } else if (stream.status === "scheduled") {
      return { color: "bg-yellow-500", text: "SCHEDULED" };
    }
    return { color: "bg-gray-600", text: "OFFLINE" };
  };

  const formatViewerCount = (count: number = 0) => {
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  const handleJoinStream = async (streamId: string | undefined) => {
    if (!canJoinStream) {
      router.push("/signup");
      return;
    }
    if (!streamId || !userState?.first_name) {
      console.error("Stream ID or user name missing");
      // Optionally redirect to a profile page to set the name
      return;
    }

    setLoading(true);
    router.push(`/stream/watch/${streamId}`);
  };

  if (loading) return <Spinner />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {streams.length === 0 ? (
        <div className="col-span-full text-center py-16 text-[#bbb]">
          <div className="text-xl font-semibold">No streams available</div>
          <div className="mt-2 text-sm">Be the first to go live!</div>
        </div>
      ) : (
        streams.map((stream) => {
          const status = getStreamStatus(stream);
          return (
            <div
              key={stream.id}
              className="group relative flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-purple-500 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
            >
              {/* Stream Thumbnail */}
              <div className="relative w-full h-48 overflow-hidden">
                <img
                  src={stream.playback_url ?? "/api/placeholder/400/200"}
                  alt={stream.title ?? "Stream thumbnail"}
                  className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
                    !canJoinStream ? "blur-md" : ""
                  }`}
                />
                {/* Live Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-white shadow-lg ${status.color}`}>
                    {status.text}
                  </span>
                </div>
                
                {/* Viewer Count */}
                {stream.status === "live" && (
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-lg">
                    <div className="flex items-center space-x-1 text-white text-xs">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/>
                      </svg>
                      <span>{formatViewerCount(stream?.viewer_count ?? 0)}</span>
                    </div>
                  </div>
                )}

                {/* Hover Play Button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-purple-600 hover:bg-purple-700 rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                    </svg>
                  </div>
                </div>

                {/* Locked Content Overlay */}
                {!canJoinStream && (
                  <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                    <div className="text-center">
                      <svg className="w-12 h-12 text-yellow-400 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                      <p className="text-yellow-400 text-sm font-semibold">Premium Content</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Stream Info */}
              <div className="p-4 flex-1 flex flex-col bg-gray-900/80">
                <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-purple-300 transition-colors">
                  {stream.title || "Live Stream"}
                </h3>
                
                <div className="flex items-center space-x-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {stream.creator_name?.charAt(0).toUpperCase() || "?"}
                    </span>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm font-medium">Anonymous Streamer</p>
                    <p className="text-gray-500 text-xs">{(stream.category as Categories)?.name || "General"}</p>
                  </div>
                </div>

                {/* Tags */}
                {(stream.category as Categories) && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30">
                      {(stream.category as Categories).name}
                    </span>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleJoinStream(stream?.id)}
                  className={`mt-auto w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] ${
                    canJoinStream
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black shadow-lg"
                  }`}
                >
                  {canJoinStream ? (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                      </svg>
                      <span>Watch Now</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                      </svg>
                      <span>Sign Up to Unlock</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
