"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Categories } from "@/types/Schema";
import Link from "next/link";

const categories = [
  { name: "Models", count: 50 },
  { name: "Characters", count: 353 },
  { name: "AI Video", count: 125 },
  { name: "AI Apps", count: 117 },
  { name: "Video", count: 240 },
  { name: "Effects", count: 60 },
  { name: "Training", count: 58 },
  { name: "Asian", count: 60 },
  { name: "BBW", count: 58 },
  { name: "BDSM", count: 125 },
  { name: "Babes", count: 117 },
  { name: "Big Tits", count: 110 },
  { name: "Blonde", count: 240 },
  { name: "Couples", count: 21 },
  { name: "Curvy", count: 359 },
  { name: "Ebony", count: 134 },
  { name: "Feet", count: 477 },
  { name: "Latina", count: 132 },
  { name: "Leather", count: 67 },
  { name: "Lesbian", count: 17 },
  { name: "Mature", count: 101 },
];

export default function Sidebar({ categories: propCategories }: { categories: Categories[] }) {
  const router = useRouter();
  const [selectedSubs, setSelectedSubs] = useState<string[]>([]);
  const debouncedSubs = useDebounce(selectedSubs, 500);

  const handleCheckboxChange = (subName: string) => {
    setSelectedSubs((prev) =>
      prev.includes(subName)
        ? prev.filter((s) => s !== subName)
        : [...prev, subName]
    );
  };

  useEffect(() => {
    if (debouncedSubs.length > 0) {
      router.push(`/stream?filters=${debouncedSubs.join(",")}`);
    } else {
      router.push(`/stream`);
    }
  }, [debouncedSubs, router]);

  // For the demo, we'll use our hardcoded categories that match the screenshot
  return (
    <div className="w-full h-full bg-[#1a1a1a] text-white p-0">
      {/* Main Category Links */}
      <div className="border-b border-[#222]">
        <ul className="space-y-1 py-2">
          <li>
            <Link 
              href="/all-girls" 
              className="flex items-center px-4 py-2 text-white bg-gradient-to-r from-purple-600 to-fuchsia-600 relative group overflow-hidden"
            >
              {/* Strong outer glow effect */}
              <span className="absolute inset-0 shadow-[0_0_15px_3px_rgba(192,38,211,0.7)] animate-pulse"></span>
              
              {/* Inner content with its own glow */}
              <div className="relative z-10 flex items-center w-full">
                <svg className="w-4 h-4 mr-2 drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                <span className="drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]">All Girls Cams</span>
              </div>
              
              {/* Animated shine effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_ease-in-out_infinite] opacity-50"></span>
            </Link>
          </li>
          <li>
            <Link 
              href="/new-models" 
              className="flex items-center px-4 py-2 text-[#bbb] hover:text-white hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-fuchsia-600/70 relative group"
            >
              {/* Glow effect on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_10px_2px_rgba(192,38,211,0.5)] transition-all duration-300"></span>
              
              <svg className="w-4 h-4 mr-2 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.6)] transition-all duration-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
              <span className="relative group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.6)] transition-all duration-300">New Models</span>
            </Link>
          </li>
          <li>
            <Link 
              href="/gold-shows" 
              className="flex items-center px-4 py-2 text-[#bbb] hover:text-white hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-fuchsia-600/70 relative group"
            >
              {/* Glow effect on hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_10px_2px_rgba(192,38,211,0.5)] transition-all duration-300"></span>
              
              <svg className="w-4 h-4 mr-2 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.6)] transition-all duration-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd"></path>
              </svg>
              <span className="relative group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.6)] transition-all duration-300">GOLD Shows</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Category Pages Section */}
      <div className="py-4">
        <h3 className="text-sm font-semibold mb-2 px-4 text-[#bbb]">Category Pages</h3>
        <ul className="space-y-1">
          {categories.map((category) => {
            const isCharacters = category.name === "Characters"; // Now using actual "Characters" category
            return (
              <li key={category.name}>
                <button 
                  className={`flex items-center justify-between w-full px-4 py-1 text-left relative transition-all duration-300
                    ${isCharacters 
                      ? 'bg-gradient-to-r from-fuchsia-600/90 to-purple-600/90 text-white' 
                      : 'hover:bg-[#222]'}`}
                  onClick={() => handleCheckboxChange(category.name)}
                >
                  {/* Enhanced strong glow effect for Characters */}
                  {isCharacters && (
                    <span className="absolute inset-0 shadow-[0_0_20px_5px_rgba(192,38,211,0.9)] animate-pulse z-0"></span>
                  )}
                  
                  {/* Hover glow effect for all other categories */}
                  {!isCharacters && (
                    <span className="absolute inset-0 shadow-[0_0_0px_rgba(192,38,211,0)] hover:shadow-[0_0_10px_rgba(192,38,211,0.6)] opacity-0 hover:opacity-100 transition-all duration-300"></span>
                  )}
                  
                  <span className={`text-sm relative z-10 ${isCharacters ? 'text-white font-medium drop-shadow-[0_0_3px_rgba(255,255,255,0.9)]' : 'text-[#bbb]'}`}>
                    {category.name}
                  </span>
                  <span className={`text-xs relative z-10 ${isCharacters ? 'text-white/90' : 'text-[#777]'}`}>
                    {category.count}
                  </span>
                  
                  {/* Hot label for Characters with enhanced glow */}
                  {isCharacters && (
                    <span className="absolute right-12 top-1/2 -translate-y-1/2 bg-gradient-to-r from-red-600 to-red-500 text-white text-xs font-medium px-1.5 py-0.5 rounded shadow-[0_0_8px_rgba(239,68,68,0.8)] z-10">
                      hot
                    </span>
                  )}
                  
                  {/* Enhanced animated shine for Characters */}
                  {isCharacters && (
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_ease-in-out_infinite] opacity-80 z-5"></span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
