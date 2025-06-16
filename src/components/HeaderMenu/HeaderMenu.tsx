"use client";
import React from "react";
import { usePathname } from "next/navigation";

export default function HeaderMenu() {
  const pathname = usePathname();

  // Hàm ánh xạ đường dẫn → tiêu đề
  const getTitleFromPath = (path: string): string => {
    if (path === "/unit") return "Phần 2, Cửa 1";
    if (path === "/learn") return "Phần 2, Cửa 2";
    if (path.startsWith("/quiz")) return "Luyện Quiz";
    if (path.startsWith("/lessons")) return "Học Từ Mới";
    if (path.startsWith("/wordbook")) return "Sổ Từ Cá Nhân";
    if (path.startsWith("/practice")) return "Quiz";
if (path.startsWith("/mission")) return "Nhiệm vụ hàng ngày";
    return ""; // Trả về chuỗi rỗng khi không khớp
  };

  const title = getTitleFromPath(pathname);

  // Nếu không có tiêu đề → không hiển thị gì cả
  if (!title) return null;

  return (
    <header className="mb-8">
      <div className="relative mb-4 rounded-xl bg-blue-500 p-4 text-white">
        <div className="flex items-center justify-between">
          <a href="#" className="flex items-center font-bold">
            <span aria-hidden="true" className="text-xl">
              ←
            </span>
            <span className="ml-3">{title}</span>
          </a>

        </div>
      </div>
    </header>
  );
}
