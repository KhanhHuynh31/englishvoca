"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { signInAction, signUpAction } from "@/app/actions/auth";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const closePopup = () => {
    if (typeof window !== "undefined") {
      window.history.back();
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      closePopup();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const action = isRegister ? signUpAction : signInAction;
      const result = await action(formData);
      if (result && !result.success) {
        setErrorMsg(result.message || "Đã xảy ra lỗi.");
      }
    });
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
          <button
            onClick={() => setIsRegister((prev) => !prev)}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md text-sm"
          >
            {isRegister ? "ĐĂNG NHẬP" : "ĐĂNG KÝ"}
          </button>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          {isRegister ? "Đăng ký" : "Đăng nhập"}
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="email"
            type="text"
            placeholder="Email"
            required
            className="w-full p-3 rounded-md bg-[#3B424A] border border-[#4B525B] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
          />
          <div className="relative">
            <input
              name="password"
              type="password"
              placeholder="Mật khẩu"
              required
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
              disabled
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md transition duration-200 text-lg"
          >
            {isRegister ? "TẠO TÀI KHOẢN" : "ĐĂNG NHẬP"}
          </button>
        </form>
        {errorMsg && (
          <div className="text-red-500 text-center text-sm">{errorMsg}</div>
        )}

        {!isRegister && (
          <>
            {/* OR Divider */}
            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-gray-400 uppercase text-sm font-semibold">
                HOẶC
              </span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div>

            {/* Social */}
            <div className="space-y-4">
              <button className="w-full bg-[#1877F2] hover:bg-[#156ACB] text-white font-bold py-3 rounded-md flex items-center justify-center space-x-2">
                <span>FACEBOOK</span>
              </button>
              <button className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-md flex items-center justify-center space-x-2">
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
