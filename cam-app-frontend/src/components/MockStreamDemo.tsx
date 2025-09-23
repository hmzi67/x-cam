"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Categories, Streams } from "@/types/Schema";

// Mock data for demonstration
const mockStreams: Streams[] = [
  {
    id: "1",
    title: "Gaming Session - Live Gameplay",
    status: "live",
    creator_name: "GamerPro",
    viewer_count: 1234,
    playback_url: "https://picsum.photos/400/300?random=1",
    category: { id: "1", name: "Gaming" } as Categories,
  },
  {
    id: "2", 
    title: "Music Production Tutorial",
    status: "live",
    creator_name: "MusicMaker",
    viewer_count: 567,
    playback_url: "https://picsum.photos/400/300?random=2",
    category: { id: "2", name: "Music" } as Categories,
  },
  {
    id: "3",
    title: "Art & Drawing Session", 
    status: "scheduled",
    creator_name: "ArtistLife",
    viewer_count: 89,
    playback_url: "https://picsum.photos/400/300?random=3",
    category: { id: "3", name: "Art" } as Categories,
  },
  {
    id: "4",
    title: "Cooking Masterclass",
    status: "live",
    creator_name: "ChefExpert",
    viewer_count: 2100,
    playback_url: "https://picsum.photos/400/300?random=4",
    category: { id: "4", name: "Cooking" } as Categories,
  },
  {
    id: "5",
    title: "Tech Talk - Latest Trends",
    status: "offline",
    creator_name: "TechGuru",
    viewer_count: 0,
    playback_url: "https://picsum.photos/400/300?random=5",
    category: { id: "5", name: "Technology" } as Categories,
  },
  {
    id: "6",
    title: "Fitness Workout Live",
    status: "live",
    creator_name: "FitnessCoach",
    viewer_count: 890,
    playback_url: "https://picsum.photos/400/300?random=6",
    category: { id: "6", name: "Fitness" } as Categories,
  },
];

export default function MockStreamDemo() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // Mock authentication state
  const isLoggedIn = true; // Set to false to see "Sign Up to Unlock" state
  const canJoinStream = isLoggedIn;

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
      router.push("/login");
      return;
    }
    setLoading(true);
    // Simulate navigation
    setTimeout(() => {
      setLoading(false);
      alert(`Would navigate to stream ${streamId}`);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#181818] text-white">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#222] p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white">XCams - Live Streams</h1>
          <p className="text-gray-400 mt-1">Discover amazing content from creators worldwide</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Featured Streams</h2>
          <p className="text-gray-400">Join thousands of viewers watching live content</p>
        </div>

        {/* Modern Stream Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {mockStreams.map((stream) => {
            const status = getStreamStatus(stream);
            return (
              <div
                key={stream.id}
                className="group relative flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl hover:border-purple-500 transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
              >
                {/* Stream Thumbnail */}
                <div className="relative w-full h-48 overflow-hidden">
                  <img
                    src={stream.playbook_url ?? stream.playback_url ?? "/api/placeholder/400/200"}
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
                      <p className="text-gray-300 text-sm font-medium">{stream.creator_name || "Anonymous Streamer"}</p>
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
                    disabled={loading}
                    className={`mt-auto w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 ${
                      canJoinStream
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                        : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black shadow-lg"
                    }`}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Loading...
                      </div>
                    ) : canJoinStream ? (
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
          })}
        </div>
      </div>
    </div>
  );
}