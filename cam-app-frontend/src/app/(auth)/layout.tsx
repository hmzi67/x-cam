import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "XCams Login",
  description: "XCams Login Page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-r from-[#0e0e10] to-[#1f1f23]">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle,_#3b0764_1px,_transparent_1px)] bg-[length:24px_24px] opacity-[0.03]"></div>
      
      {/* Purple glow effects */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-20"></div>

      <div className="relative flex justify-center items-center min-h-screen px-4">
        <div className="bg-[#18181b] border border-gray-800 rounded-lg shadow-2xl w-full max-w-md p-6 z-10">
          <div className="flex justify-center mb-6">
            <div className="relative group">
              <h1 className="text-5xl font-bold tracking-tighter transition-all duration-300 group-hover:scale-105">
                <span className="relative">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">X</span><span className="text-white">CAMS</span>
                  <span className="absolute -top-2 -right-4 text-xs bg-purple-600 text-white px-1 rounded font-medium animate-pulse">LIVE</span>
                </span>
              </h1>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transform origin-left transition-all duration-500 group-hover:scale-x-110"></div>
              <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-white opacity-75 animate-ping"></div>
            </div>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
