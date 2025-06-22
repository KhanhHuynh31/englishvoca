"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useState, useCallback, useTransition } from "react";
import {
  BookOpenCheck,
  BookMarked,
  User,
  LogOut,
  LogIn,
  Menu,
  X,
} from "lucide-react";
import { signOutAction } from "@/app/actions/auth";

type NavMenuClientProps = {
  isLoggedIn: boolean;
};

type MenuItem = {
  href: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
};

export default function NavMenuClient({ isLoggedIn }: NavMenuClientProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await signOutAction();
      location.reload();
    });
  };

  const menuItems: MenuItem[] = [
    { href: "/learn/unit", icon: BookOpenCheck, label: "Học từ mới" },
    { href: "/wordbook", icon: BookMarked, label: "Sổ từ của tôi" },
    { href: "/profile", icon: User, label: "Hồ sơ" },
    isLoggedIn
      ? {
          href: "#",
          icon: LogOut,
          label: isPending ? "Đang đăng xuất..." : "Đăng xuất",
          onClick: handleLogout,
        }
      : { href: "/account", icon: LogIn, label: "Đăng nhập" },
  ];

  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const commonLinkClasses =
    "flex items-center space-x-3 p-3 rounded-xl font-bold transition-all duration-200 ease-in-out group";
  const activeLinkClasses = "bg-blue-100 text-blue-500 shadow-sm";
  const inactiveLinkClasses =
    "text-gray-700 hover:bg-gray-100 hover:text-blue-500";

  const renderMenuItem = (item: MenuItem, isMobile = false) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    const className = clsx(
      commonLinkClasses,
      isActive ? activeLinkClasses : inactiveLinkClasses,
      "w-full text-left"
    );

    const content = (
      <>
        <Icon className="w-5 h-5 shrink-0" />
        <span>{item.label}</span>
      </>
    );

    return (
      <li key={item.href}>
        {item.onClick ? (
          <button
            onClick={() => {
              item.onClick?.();
              if (isMobile) handleCloseMobileMenu();
            }}
            className={className}
            disabled={isPending}
          >
            {content}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={isMobile ? handleCloseMobileMenu : undefined}
            className={className}
          >
            {content}
          </Link>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Mobile button */}
      <button
        className="fixed top-4 left-4 z-30 p-2 rounded-md bg-white shadow-md md:hidden focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform hover:scale-105"
        onClick={() => setIsMobileOpen(true)}
        aria-label="Mở menu"
      >
        <Menu className="w-6 h-6 text-gray-800" />
      </button>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden animate-fade-in"
          onClick={handleCloseMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar */}
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
            className="text-2xl font-bold text-green-600 hover:text-green-700"
            aria-label="Trang chủ Flash Vocab"
          >
            Flash Vocab
          </Link>
          <button
            onClick={handleCloseMobileMenu}
            aria-label="Đóng menu"
            className="p-1 rounded-full hover:bg-gray-100 focus:ring-2 focus:ring-blue-500"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <nav>
          <ul className="space-y-3 text-base">{menuItems.map((item) => renderMenuItem(item, true))}</ul>
        </nav>
      </aside>

      {/* Desktop sidebar */}
      <nav className="hidden md:flex md:flex-col md:fixed md:top-0 md:left-0 md:h-screen md:w-48 lg:w-64 bg-white shadow-lg px-4 lg:px-6 py-6 lg:py-8 z-10 border-r border-gray-100">
        <header className="mb-8 border-b border-gray-200 pb-4">
          <Link
            href="/"
            className="text-3xl font-bold text-green-600 hover:text-green-700"
          >
            Flash Vocab
          </Link>
        </header>
        <ul className="space-y-3 text-base flex-grow">
          {menuItems.map((item) => renderMenuItem(item))}
        </ul>
      </nav>
    </>
  );
}
