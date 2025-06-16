// components/Loading.tsx
export default function Loading() {
  return (
    <div className="w-full h-[70vh] flex flex-col items-center justify-center text-blue-600">
      {/* Vòng tròn xoay */}
      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>

      {/* Dòng chữ nhấp nháy */}
      <p className="text-lg font-medium animate-pulse">Đang tải nội dung...</p>
    </div>
  );
}
