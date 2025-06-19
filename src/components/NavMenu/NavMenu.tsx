"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState, useCallback } from "react";

export default function NavMenu() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Menu items tĩnh - không có bất kỳ logic bất đồng bộ nào
  const menuItems = [
    { href: "/learn/unit", icon: "📚", label: "Học từ mới" },
    { href: "/wordbook", icon: "🎯", label: "Sổ từ của tôi" },
    { href: "/profile", icon: "👤", label: "Hồ sơ" },
    { href: "/account", icon: "🔑", label: "Đăng nhập" },
  ];

  // Xử lý đóng menu khi nhấn vào link hoặc overlay
  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  // Các lớp CSS dùng chung để dễ quản lý và tái sử dụng
  const commonLinkClasses =
    "flex items-center space-x-3 p-3 rounded-xl font-bold transition-all duration-200 ease-in-out group";
  const activeLinkClasses = "bg-blue-100 text-blue-500 shadow-sm";
  const inactiveLinkClasses =
    "text-gray-700 hover:bg-gray-100 hover:text-blue-500";

  return (
    <>
      {/* Nút mở menu trên mobile */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 hover:scale-105"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Mở menu"
      >
        <span className="text-2xl">☰</span>
      </button>

      {/* Overlay nền mờ khi mở menu mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden animate-fade-in"
          onClick={handleCloseMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Menu trượt ra trên mobile */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-screen w-64 bg-white shadow-lg px-6 py-8 z-30 transform transition-transform duration-300 ease-in-out md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
          <Link
            href="/"
            onClick={handleCloseMobileMenu}
            className="text-2xl font-bold text-green-600 hover:text-green-700 transition-colors duration-200"
            aria-label="Trang chủ Flash Vocab"
          >
            Flash Vocab
          </Link>
          <button
            onClick={handleCloseMobileMenu}
            aria-label="Đóng menu"
            className="p-1 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200"
          >
            <span className="text-2xl text-gray-600 hover:text-gray-900">
              ✖
            </span>
          </button>
        </div>
        <nav>
          <ul className="space-y-3 text-base">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={handleCloseMobileMenu}
                    className={clsx(
                      commonLinkClasses,
                      isActive ? activeLinkClasses : inactiveLinkClasses
                    )}
                  >
                    <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Menu gốc dành cho màn hình lớn */}
      <nav className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-48 lg:w-64 bg-white shadow-lg px-4 lg:px-6 py-6 lg:py-8 z-10 border-r border-gray-100">
        <header className="mb-8 border-b border-gray-200 pb-4">
          <Link
            href="/"
            aria-label="Homepage"
            className="text-3xl font-bold text-green-600 hover:text-green-700 transition-colors duration-200"
          >
            Flash Vocab
          </Link>
        </header>
        <ul className="space-y-3 text-base flex-grow">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    commonLinkClasses,
                    isActive ? activeLinkClasses : inactiveLinkClasses
                  )}
                >
                  <span className="text-xl group-hover:scale-110 transition-transform duration-200">
                    {item.icon}
                  </span>
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
