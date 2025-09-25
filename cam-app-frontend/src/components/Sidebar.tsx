"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { Categories } from "@/types/Schema";
import Link from "next/link";

const categories = [
  { name: "Anal", count: 50 },
  { name: "Asian", count: 60 },
  { name: "BBW", count: 58 },
  { name: "BDSM", count: 125 },
  { name: "Babes", count: 117 },
  { name: "Big Tits", count: 110 },
  { name: "Blonde", count: 240 },
  { name: "Brunette", count: 353 },
  { name: "Couples", count: 21 },
  { name: "Curvy", count: 359 },
  { name: "Ebony", count: 134 },
  { name: "Feet", count: 477 },
  { name: "Granny", count: 40 },
  { name: "Group Sex", count: 0 },
  { name: "Hairy", count: 149 },
  { name: "Housewives", count: 421 },
  { name: "Huge Tits", count: 15 },
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
            <Link href="/all-girls" className="flex items-center px-4 py-2 text-white hover:bg-[#222] bg-purple-600">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
              </svg>
              All Girls Cams
            </Link>
          </li>
          <li>
            <Link href="/new-models" className="flex items-center px-4 py-2 text-[#bbb] hover:bg-[#222]">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
              </svg>
              New Models
            </Link>
          </li>
          <li>
            <Link href="/gold-shows" className="flex items-center px-4 py-2 text-[#bbb] hover:bg-[#222]">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M5 2a2 2 0 00-2 2v14l3.5-2 3.5 2 3.5-2 3.5 2V4a2 2 0 00-2-2H5zm4.707 3.707a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L8.414 9H10a3 3 0 013 3v1a1 1 0 102 0v-1a5 5 0 00-5-5H8.414l1.293-1.293z" clipRule="evenodd"></path>
              </svg>
              GOLD Shows
            </Link>
          </li>
        </ul>
      </div>

      {/* Category Pages Section */}
      <div className="py-4">
        <h3 className="text-sm font-semibold mb-2 px-4 text-[#bbb]">Category Pages</h3>
        <ul className="space-y-1">
          {categories.map((category) => (
            <li key={category.name}>
              <button 
                className="flex items-center justify-between w-full px-4 py-1 hover:bg-[#222] text-left"
                onClick={() => handleCheckboxChange(category.name)}
              >
                <span className="text-[#bbb] text-sm">{category.name}</span>
                <span className="text-[#777] text-xs">{category.count}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
