export function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0e0e10]">
      <div className="relative">
        <div className="h-24 w-24">
          <div className="absolute h-full w-full rounded-full border-4 border-t-purple-600 border-r-purple-400 border-b-purple-300 border-l-purple-500 animate-spin"></div>
          <div className="absolute h-full w-full flex items-center justify-center">
            <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white text-2xl font-bold px-3 py-1 rounded">
              X
            </span>
          </div>
        </div>
      </div>
      <p className="mt-6 text-xl font-medium text-white">Loading stream...</p>
      <p className="mt-2 text-sm text-gray-400">Please wait while we connect you</p>
    </div>
  );
}