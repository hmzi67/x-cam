"use client";
import Link from "next/link";
import SearchBar from "./SearchBar";
import LogoutButton from "./LogoutButton";
import { useAppSelector } from "@/lib/hooks";
import { getUser } from "@/lib/features/userSlice";
import { Categories } from "@/types/Schema";
import CreateStreamButton from "./CreateStreamButton";

export default function Header({ categories }: { categories: Categories[] }) {
  const user = useAppSelector(getUser);
  return (
    <header className="w-full bg-[#121212] border-b border-[#222]">
      <div className="flex items-center px-2 md:px-8 py-3 gap-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white mr-4">
          <span className="inline-block align-middle mr-2">&#9679;</span>Xcams
        </Link>
        {/* Search Bar */}
        <div className="flex-1">
          <SearchBar />
        </div>
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {user?.id ? (
            <CreateStreamButton categories={categories} />
          ) : (
            <Link
              href="/register"
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-4 py-2 rounded transition"
            >
              Join Free
            </Link>
          )}
          {user?.id ? (
            <LogoutButton />
          ) : (
            <Link
              href="/login"
              className="bg-[#222] hover:bg-[#333] text-white px-4 py-2 rounded transition border border-[#333]"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
