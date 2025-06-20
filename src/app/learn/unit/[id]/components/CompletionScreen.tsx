"use client";

export default function CompletionScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen px-4 text-center animate-fade-in">
      <h2 className="text-4xl font-bold text-green-600 mb-4">🎉 Hoàn thành!</h2>
      <p className="text-gray-600 mb-8">
        Chúc mừng bạn đã hoàn thành bài học. Hãy ôn tập thường xuyên nhé!
      </p>
      <button
        onClick={onRetry}
        className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
      >
        🔁 Học lại
      </button>
    </div>
  );
}
