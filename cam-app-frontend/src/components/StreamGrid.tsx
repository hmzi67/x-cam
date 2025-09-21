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
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
              className="relative flex flex-col bg-gradient-to-br from-[#1e1e1e] to-[#2a2a2a] border border-[#333] rounded-lg overflow-hidden shadow hover:shadow-lg hover:border-blue-700 transition cursor-pointer"
            >
              {/* Stream Thumbnail */}
              <div className="relative w-full h-48">
                <img
                  src={stream.playback_url ?? "/api/placeholder/400/200"}
                  alt={stream.title ?? "Stream thumbnail"}
                  className={`w-full h-full object-cover transition ${
                    !canJoinStream ? "blur-md" : ""
                  }`}
                />
                {/* Status Badge */}
                <span
                  className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-bold text-white ${status.color}`}
                >
                  {status.text}
                </span>
                {/* Viewer Count */}
                {stream.status === "live" && (
                  <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <svg
                      className="w-4 h-4 inline-block"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                    {formatViewerCount(stream?.viewer_count ?? 0)}
                  </span>
                )}
                {/* Overlay for locked content */}
                {!canJoinStream && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="bg-yellow-500 text-black px-3 py-1 rounded font-semibold text-sm">
                      Sign Up to Unlock
                    </span>
                  </div>
                )}
              </div>
              {/* Stream Info */}
              <div className="flex-1 flex flex-col justify-between bg-[#1a1a1a] text-white p-3">
                <div>
                  <div className="font-semibold text-lg mb-1 truncate">
                    {stream.title}
                  </div>
                  <div className="text-xs text-[#bbb] mb-1">
                    Category:{" "}
                    {(stream.category as Categories)?.name || "Uncategorized"}
                  </div>
                </div>
                <button
                  onClick={() => handleJoinStream(stream?.id)}
                  className={`mt-2 w-full text-center px-4 py-2 rounded font-semibold transition ${
                    canJoinStream
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-yellow-500 hover:bg-yellow-600 text-black"
                  }`}
                >
                  {canJoinStream ? "Watch Now" : "Sign Up to Unlock"}
                </button>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
