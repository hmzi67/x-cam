import { Categories } from "@/types/Schema";
import { useState } from "react";
import CreateStreamModal from "./CreateStreamModal";

export default function CreateStreamButton({
  categories,
}: {
  categories: Categories[];
}) {
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const onClose = () => setOpenCreateDialog(false);

  return (
    <>
      <button
        onClick={() => setOpenCreateDialog(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white text-sm font-medium transition-all duration-300 focus:outline-none rounded-sm relative group overflow-hidden"
      >
        {/* Glow effect */}
        <span className="absolute inset-0 shadow-[0_0_15px_rgba(192,38,211,0.5)] group-hover:shadow-[0_0_25px_rgba(192,38,211,0.7)] opacity-90 transition-all duration-300"></span>
        
        {/* Shine animation */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 group-hover:animate-[shine_1.5s_ease-in-out_infinite] opacity-0 group-hover:opacity-100"></span>
        
        {/* Border glow */}
        <span className="absolute inset-0 rounded-sm border border-fuchsia-400/50 group-hover:border-fuchsia-300/70 transition-colors duration-300"></span>
        
        <svg
          className="w-4 h-4 relative z-10 group-hover:text-white/95 transition-colors duration-300"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
        <span className="relative z-10">Broadcast</span>
      </button>

      {/* Mobile version - icon only */}
      <button
        onClick={() => setOpenCreateDialog(true)}
        className="md:hidden flex items-center justify-center w-8 h-8 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-sm transition-all duration-300 focus:outline-none relative group overflow-hidden"
      >
        {/* Glow effect */}
        <span className="absolute inset-0 shadow-[0_0_15px_rgba(192,38,211,0.5)] group-hover:shadow-[0_0_25px_rgba(192,38,211,0.7)] opacity-90 transition-all duration-300"></span>
        
        {/* Shine animation */}
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 group-hover:animate-[shine_1.5s_ease-in-out_infinite] opacity-0 group-hover:opacity-100"></span>
        
        {/* Border glow */}
        <span className="absolute inset-0 rounded-sm border border-fuchsia-400/50 group-hover:border-fuchsia-300/70 transition-colors duration-300"></span>
        
        <svg
          className="w-4 h-4 relative z-10"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
          />
        </svg>
      </button>

      {openCreateDialog && (
        <CreateStreamModal
          open={openCreateDialog}
          onClose={onClose}
          categories={categories}
        />
      )}
    </>
  );
}
