"use client";

export default function LoadingWordBook() {
  return (
    <div className="w-full h-full px-4 py-8 bg-[#fdf6e3] text-gray-800 animate-pulse">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header skeleton */}
        <div className="sticky top-0 z-10 bg-[#fdf6e3]/90 backdrop-blur-md rounded-b-xl p-4 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-24 bg-gray-300 rounded-full" />
              <div className="h-5 w-12 bg-indigo-300 rounded-full shadow-lg" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-20 bg-orange-300 rounded-full shadow-md" />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 md:justify-start justify-between items-center">
            <div className="flex gap-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-24 bg-gray-200 rounded-full"
                />
              ))}
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <div className="h-8 w-16 bg-blue-300 rounded-md" />
              <div className="h-5 w-20 bg-pink-300 rounded" />
            </div>
          </div>
        </div>

        {/* WordCard skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {[...Array(6)].map((_, idx) => (
            <div
              key={idx}
              className="w-full p-4 rounded-xl border border-gray-200 shadow-md bg-yellow-50 animate-pulse"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="h-5 w-24 bg-gray-300 rounded" />
                <div className="h-5 w-5 bg-gray-200 rounded-full" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-200 rounded" />
                <div className="h-3 w-2/3 bg-gray-200 rounded" />
              </div>
              <div className="mt-4 h-4 w-1/2 bg-gray-300 rounded" />
              <div className="mt-3 flex gap-2">
                <div className="h-6 w-16 bg-yellow-300 rounded-full" />
                <div className="h-6 w-16 bg-green-300 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
