"use client";

import React, { useState, useEffect, useRef } from "react";

const LoginPage: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Ngăn cuộn nền khi popup mở
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Đóng popup
  const closePopup = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  // Nếu click ra ngoài modal thì đóng
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closePopup();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleOverlayClick}
    >
      <div
        ref={modalRef}
        className="relative bg-[#2D333B] text-gray-100 w-full max-w-md rounded-xl shadow-2xl p-8 mx-4"
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={closePopup}
            className="text-gray-400 hover:text-white text-2xl font-bold"
          >
            &times;
          </button>
          {!isRegister && (
            <button
              onClick={() => setIsRegister(true)}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md text-sm"
            >
              ĐĂNG KÝ
            </button>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          {isRegister ? "Đăng ký" : "Đăng nhập"}
        </h1>

        {/* Form */}
        <form className="space-y-4">
          {isRegister && (
            <input
              type="text"
              placeholder="Tên hiển thị"
              className="w-full p-3 rounded-md bg-[#3B424A] border border-[#4B525B] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          )}
          <input
            type="text"
            placeholder="Email hoặc tên đăng nhập"
            className="w-full p-3 rounded-md bg-[#3B424A] border border-[#4B525B] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          />
          <div className="relative">
            <input
              type="password"
              placeholder="Mật khẩu"
              className="w-full p-3 rounded-md bg-[#3B424A] border border-[#4B525B] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400 pr-20"
            />
            {!isRegister && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-400 hover:text-blue-300 text-sm font-semibold"
              >
                QUÊN?
              </button>
            )}
          </div>
          {isRegister && (
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="w-full p-3 rounded-md bg-[#3B424A] border border-[#4B525B] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md transition duration-200 text-lg"
          >
            {isRegister ? "TẠO TÀI KHOẢN" : "ĐĂNG NHẬP"}
          </button>
        </form>

        {!isRegister && (
          <>
            {/* OR Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-gray-400 uppercase text-sm font-semibold">HOẶC</span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            {/* Social Login */}
            <div className="space-y-4">
              <button className="w-full bg-[#1877F2] hover:bg-[#156ACB] text-white font-bold py-3 rounded-md flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33V22H12c5.523 0 10-4.477 10-10z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>FACEBOOK</span>
              </button>
              <button className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-md flex items-center justify-center space-x-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.22v3.6h6.77c-.24 1.44-.95 2.52-2.07 3.32-.97.74-2.14 1.25-3.52 1.25-2.9 0-5.26-2.36-5.26-5.26 0-2.9 2.36-5.26 5.26-5.26 1.54 0 2.84.66 3.79 1.55l2.67-2.67c-1.64-1.54-3.84-2.49-6.46-2.49-5.5 0-9.98 4.48-9.98 9.98s4.48 9.98 9.98 9.98c5.22 0 9.4-4 9.4-9.4 0-.66-.06-1.28-.18-1.88h-9.22z" />
                </svg>
                <span>GOOGLE</span>
              </button>
            </div>
          </>
        )}

        {/* Disclaimers */}
        <p className="text-gray-400 text-xs text-center mt-8 leading-relaxed px-2">
          Khi đăng ký bạn đã đồng ý với Các chính sách và Chính sách bảo mật của chúng tôi.
        </p>
        <p className="text-gray-400 text-xs text-center mt-2 leading-relaxed px-2">
          Trang này được bảo vệ bởi reCAPTCHA và theo Chính sách bảo mật và Điều khoản dịch vụ của Google.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
