"use client";
import Link from "next/link";
import Image from "next/image";
import SearchBar from "./SearchBar";
import LogoutButton from "./LogoutButton";
import { useAppSelector } from "@/lib/hooks";
import { getUser } from "@/lib/features/userSlice";
import { Categories } from "@/types/Schema";
import CreateStreamButton from "./CreateStreamButton";
import { useState } from "react";

export default function Header({ categories }: { categories: Categories[] }) {
  const user = useAppSelector(getUser);

  // Add keyframes for animations if not already present - enhanced to match Sidebar effects
  if (typeof document !== "undefined") {
    const existingStyle = document.getElementById("header-animations");
    if (!existingStyle) {
      const style = document.createElement("style");
      style.id = "header-animations";
      style.textContent = `
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 15px rgba(192, 38, 211, 0.6); }
          50% { box-shadow: 0 0 25px rgba(192, 38, 211, 0.9); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `;
      document.head.appendChild(style);
    }
  }

  return (
    <header className="w-full bg-[#1a1a1a] border-b border-[#222] shadow-lg z-20 sticky top-0 relative overflow-hidden">
      {/* Background glow effects similar to Sidebar ambient lighting */}
      <div className="absolute top-0 left-1/4 w-64 h-full rounded-full bg-fuchsia-900/20 blur-2xl animate-pulse"></div>
      <div
        className="absolute top-0 right-1/4 w-64 h-full rounded-full bg-purple-900/20 blur-2xl animate-pulse"
        style={{ animationDelay: "1s" }}
      ></div>
      <div className="absolute bottom-0 left-1/2 w-32 h-8 -translate-x-1/2 rounded-full bg-purple-600/30 blur-xl opacity-70"></div>

      <div className="max-w-screen-2xl mx-auto flex items-center px-2 md:px-4 lg:px-6 py-3 gap-4 relative">
        {/* Logo - Updated to match the login page logo with enhanced glow */}
        <Link
          href="/"
          className="flex items-center group relative z-10 overflow-hidden"
        >
          <div className="relative group">
            <h1 className="text-3xl font-bold tracking-tighter transition-all duration-300 group-hover:scale-105">
              <span className="relative">
                {/* Logo text with gradient and animated glow */}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-[0_0_5px_rgba(192,38,211,0.8)]">
                  X
                </span>
                <span className="text-white">CAMS</span>

                {/* LIVE tag with enhanced glow */}
                <span className="absolute -top-1 -right-4 text-xs bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white px-1.5 rounded font-medium animate-pulse shadow-[0_0_10px_rgba(192,38,211,0.7)]">
                  LIVE
                </span>
              </span>

              {/* Enhanced bottom line with glow */}
              <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform origin-left transition-all duration-500 group-hover:scale-x-110 shadow-[0_0_10px_rgba(192,38,211,0.9)]"></span>

              {/* Animated ping effect */}
              <span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-white opacity-75 animate-ping"></span>
            </h1>

            {/* Strong outer glow effect */}
            <span className="absolute inset-0 shadow-[0_0_20px_5px_rgba(192,38,211,0.5)] opacity-70 rounded-lg"></span>

            {/* Additional shine effect across entire link */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
          </div>
        </Link>

        {/* Main Navigation - Enhanced with glowing active state similar to Sidebar */}
        <nav className="hidden md:flex space-x-1 ml-6 relative z-10">
          <Link
            href="/"
            className="text-white font-medium hover:text-white px-4 py-2 relative group overflow-hidden bg-gradient-to-r from-purple-600 to-fuchsia-600"
          >
            {/* Strong outer glow effect similar to Sidebar */}
            <span className="absolute inset-0 shadow-[0_0_15px_3px_rgba(192,38,211,0.7)] animate-pulse"></span>

            {/* Text with glow */}
            <span className="relative z-10 drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">
              Girls
            </span>

            {/* Animated shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_ease-in-out_infinite] opacity-50"></span>
          </Link>

          <Link
            href="/guys"
            className="text-[#bbb] hover:text-white px-4 py-2 hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-fuchsia-600/70 relative group"
          >
            {/* Glow effect on hover like in Sidebar */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_10px_2px_rgba(192,38,211,0.5)] transition-all duration-300"></span>

            {/* Text with conditional glow */}
            <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.6)] transition-all duration-300">
              Guys
            </span>

            {/* Animated shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
          </Link>

          <Link
            href="/trans"
            className="text-[#bbb] hover:text-white px-4 py-2 hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-fuchsia-600/70 relative group"
          >
            {/* Glow effect on hover like in Sidebar */}
            <span className="absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_10px_2px_rgba(192,38,211,0.5)] transition-all duration-300"></span>

            {/* Text with conditional glow */}
            <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.6)] transition-all duration-300">
              Trans
            </span>

            {/* Animated shine effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>
          </Link>
        </nav>

        {/* Search Bar - Enhanced with glow effect wrapper */}
        <div className="flex-1 max-w-xl relative group/search">
          {/* Subtle background glow effect that activates on hover */}
          <div className="absolute -inset-1 rounded-md bg-gradient-to-r from-purple-600/0 to-fuchsia-600/0 group-hover/search:from-purple-600/20 group-hover/search:to-fuchsia-600/20 opacity-0 group-hover/search:opacity-100 blur-md transition-all duration-300"></div>

          {/* SearchBar component */}
          <div className="relative z-10">
            <SearchBar />
          </div>
        </div>

        {/* Action Buttons - Enhanced with stronger glowing effects similar to Sidebar */}
        <div className="flex items-center gap-2 relative z-10">
          {user?.id ? (
            <>
              {/* CreateStreamButton with enhanced glow effect similar to Sidebar active items */}
              <div className="relative group">
                {/* Strong outer glow effect */}
                <div className="absolute -inset-0.5 rounded-sm bg-gradient-to-r from-purple-600/70 to-fuchsia-600/70 opacity-70 blur-sm animate-[pulse-glow_2s_ease-in-out_infinite]"></div>

                <div className="relative">
                  <CreateStreamButton categories={categories} />
                </div>

                {/* Enhanced shine effect */}
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_2s_ease-in-out_infinite] opacity-50"></div>
              </div>

              {/* User Profile and Logout - Enhanced with stronger pulsing glow */}
              <div className="flex items-center space-x-2">
                {/* Username avatar with glow effect */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center overflow-hidden relative group">
                  {/* Stronger pulsing glow effect */}
                  <span className="absolute inset-0 rounded-full shadow-[0_0_15px_rgba(192,38,211,0.7)] group-hover:shadow-[0_0_20px_rgba(192,38,211,0.9)] animate-[pulse-glow_3s_ease-in-out_infinite] transition-all duration-300"></span>

                  {/* Enhanced shine effect */}
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-70 animate-[shine_2s_ease-in-out_infinite]"></span>

                  {/* User avatar or initial */}
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt="User Avatar"
                      width={32}
                      height={32}
                      className="w-full h-full object-cover relative z-10"
                    />
                  ) : (
                    <span className="text-white text-sm font-medium relative z-10 drop-shadow-[0_0_3px_rgba(255,255,255,0.8)]">
                      {user?.username?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                </div>

                {/* Simple logout icon with glow effect */}
                <div className="relative group">
                  <LogoutButton className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-fuchsia-600/70 text-[#bbb] hover:text-white transition-all duration-300 relative" />

                  {/* Glow effect on hover */}
                  <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_15px_5px_rgba(192,38,211,0.5)] transition-all duration-300"></span>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* JOIN FREE button - Redesigned to match app styling */}
              <Link
                href="/register"
                className="bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold px-5 py-2 rounded-sm uppercase text-sm relative group overflow-hidden"
              >
                {/* Strong outer glow effect always visible */}
                <span className="absolute -inset-0.5 rounded-sm bg-gradient-to-r from-purple-600/80 to-fuchsia-600/80 opacity-80 blur-sm animate-[pulse-glow_2s_ease-in-out_infinite]"></span>

                {/* Enhanced inner shadow glow */}
                <span className="absolute inset-0 shadow-[0_0_15px_rgba(192,38,211,0.7)] animate-pulse transition-all duration-300"></span>

                {/* Always visible animated shine effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent animate-[shine_1.5s_ease-in-out_infinite] opacity-70"></span>

                {/* Text with stronger drop shadow */}
                <span className="relative z-10 drop-shadow-[0_0_2px_rgba(255,255,255,0.7)]">
                  JOIN FREE
                </span>
              </Link>

              {/* Login button - Enhanced with stronger glow similar to Sidebar hover states */}
              <Link
                href="/login"
                className="bg-[#1F1F23] hover:bg-gradient-to-r hover:from-purple-600/70 hover:to-fuchsia-600/70 text-[#bbb] hover:text-white font-medium px-5 py-2 rounded-sm transition-all duration-300 text-sm relative group overflow-hidden"
              >
                {/* Enhanced outer glow on hover */}
                <span className="absolute inset-0 rounded-sm opacity-0 group-hover:opacity-100 group-hover:shadow-[0_0_15px_5px_rgba(192,38,211,0.5)] transition-all duration-300"></span>

                {/* Shine effect */}
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></span>

                {/* Text with glow on hover */}
                <span className="relative z-10 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.7)] transition-all duration-300">
                  Log In
                </span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
