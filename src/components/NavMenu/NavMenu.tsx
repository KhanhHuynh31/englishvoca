"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState } from "react";

export default function NavMenu() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { href: "/learn/unit", icon: "📚", label: "Học từ mới" },
    { href: "/lessons", icon: "💪", label: "Luyện tập" },
    { href: "/wordbook", icon: "🎯", label: "Sổ từ của tôi" },
    { href: "/mission", icon: "🏆", label: "Nhiệm vụ" },
    { href: "/profile", icon: "👤", label: "Hồ sơ" },
    { href: "/account", icon: "👤", label: "Đăng nhập" },
  ];

  return (
    <>
      {/* Nút mở menu trên mobile */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md md:hidden"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Mở menu"
      >
        <span className="text-2xl">☰</span>
      </button>

      {/* Overlay nền mờ khi mở menu mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 backdrop-blur-xs z-20 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Menu trượt ra trên mobile */}
      <div
        className={clsx(
          "fixed top-0 left-0 h-screen w-64 bg-white shadow-md px-6 py-8 z-30 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="text-2xl font-bold text-green-500">Flash Vocab</span>
          <button onClick={() => setIsMobileOpen(false)} aria-label="Đóng menu">
            <span className="text-2xl">✖</span>
          </button>
        </div>
        <ul className="space-y-3 text-base">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={clsx(
                    "flex items-center space-x-3 p-3 rounded-xl font-bold transition-colors duration-200",
                    isActive
                      ? "bg-blue-100 text-blue-500"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Menu gốc dành cho màn hình lớn - giữ nguyên như bạn yêu cầu */}
      <nav className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-48 lg:w-64 bg-white shadow-md px-4 lg:px-6 py-6 lg:py-8 z-10">
        <header className="mb-8">
          <Link
            href="/"
            aria-label="Homepage"
            className="text-3xl font-bold text-green-500"
          >
            Flash Vocab
          </Link>
        </header>
        <ul className="space-y-3 text-base">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center space-x-3 p-3 rounded-xl font-bold transition-colors duration-200",
                    isActive
                      ? "bg-blue-100 text-blue-500"
                      : "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
