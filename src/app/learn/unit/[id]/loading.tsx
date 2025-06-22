

import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
      {/* Progress Bar Skeleton */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 animate-[pulseBg_1.5s_infinite_ease-in-out]">
        {/* Progress bar itself will be static, or simulate partial loading */}
        <div
          className="bg-blue-300 h-2.5 rounded-full"
          style={{ width: `30%` }} // Simulate partial loading
        />
      </div>

      {/* Card Container Skeleton */}
      <div className="w-full max-w-md h-[500px] [perspective:1000px] mb-4">
        <div
          className={`relative w-full h-full p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center cursor-wait
            bg-white border border-gray-200 animate-[pulseBg_1.5s_infinite_ease-in-out]`}
        >
          {/* Image Placeholder */}
          <div className="w-48 h-48 bg-gray-300 rounded-lg mb-4 animate-[pulseText_1.5s_infinite_ease-in-out]"></div>

          {/* Word Placeholder */}
          <div className="h-8 w-3/4 bg-gray-300 rounded mb-2 animate-[pulseText_1.5s_infinite_ease-in-out]"></div>
          {/* Phonetic Placeholder */}
          <div className="h-4 w-1/3 bg-gray-300 rounded animate-[pulseText_1.5s_infinite_ease-in-out]"></div>

          {/* Status Buttons Placeholder */}
          <div className="absolute bottom-6 flex flex-wrap gap-2 justify-center w-full px-6">
            <div className="h-8 w-24 bg-gray-300 rounded-full animate-[pulseText_1.5s_infinite_ease-in-out]"></div>
            <div className="h-8 w-24 bg-gray-300 rounded-full animate-[pulseText_1.5s_infinite_ease-in-out] delay-100"></div>
            <div className="h-8 w-24 bg-gray-300 rounded-full animate-[pulseText_1.5s_infinite_ease-in-out] delay-200"></div>
          </div>
        </div>
      </div>

      {/* Navigation Placeholder */}
      <div className="flex items-center justify-between w-full max-w-xs">
        <div className="p-4 bg-gray-200 rounded-full shadow-md animate-[pulseBg_1.5s_infinite_ease-in-out]">
          <span className="text-xl text-transparent">←</span>{" "}
          {/* Invisible text to maintain size */}
        </div>
        <div className="h-6 w-16 bg-gray-300 rounded animate-[pulseText_1.5s_infinite_ease-in-out]"></div>
        <div className="p-4 bg-gray-200 rounded-full shadow-md animate-[pulseBg_1.5s_infinite_ease-in-out]">
          <span className="text-xl text-transparent">→</span>{" "}
          {/* Invisible text to maintain size */}
        </div>
      </div>
    </div>
  );
};

export default Loading;