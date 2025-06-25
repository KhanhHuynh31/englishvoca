"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { signInAction, signUpAction } from "@/app/actions/auth";
import toast, { Toaster } from "react-hot-toast";
import { clearVocabHistory, getAllVocabHistory } from "@/lib/vocabularyDB";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const LoginPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [isPending, startTransition] = useTransition();

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

  /**
   * Hàm trợ giúp: Xử lý tất cả các tác vụ sau khi xác thực thành công.
   * Bao gồm hiển thị thông báo, đồng bộ dữ liệu và đóng popup.
   */
  const handleAuthSuccess = async (isRegister: boolean) => {
    // Hiển thị thông báo thành công cho người dùng
    toast.success(isRegister ? "Đăng ký thành công!" : "Đăng nhập thành công!");

    try {
      const localVocab = await getAllVocabHistory();
      // Nếu không có từ vựng local, không làm gì thêm
      if (localVocab.length === 0) {
        console.log("ℹ️ IndexedDB trống, không có dữ liệu để import.");
        return;
      }

      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("Chưa đăng nhập! Không thể đồng bộ.");
        return;
      }

      // 1. Lấy từ vựng đã có của user trên server
      const { data: existingVocab, error: fetchError } = await supabase
        .from("user_vocab")
        .select("word_id")
        .eq("user_id", user.id);

      if (fetchError) throw new Error(fetchError.message);

      // 2. Lọc ra những từ mới chưa có trên server
      const existingWordIds = new Set(existingVocab?.map((v) => v.word_id));
      const newEntries = localVocab
        .filter((item) => !existingWordIds.has(item.id))
        .map((item) => ({
          user_id: user.id,
          word_id: item.id,
          word_status: item.status,
        }));

      if (newEntries.length === 0) {
        console.log("ℹ️ Không có từ vựng mới để đồng bộ.");
        return;
      }

      // 3. Chèn các từ mới vào database
      const { error: insertError } = await supabase
        .from("user_vocab")
        .insert(newEntries);

      if (insertError) throw new Error(insertError.message);

      // Xóa lịch sử local chỉ khi đã chèn lên server thành công
      await clearVocabHistory();
      toast.success(`Đồng bộ thành công ${newEntries.length} từ.`);
    } catch (error: any) {
      console.error("Lỗi khi đồng bộ dữ liệu:", error.message);
      toast.error("Có lỗi xảy ra khi đồng bộ dữ liệu của bạn.");
    } finally {
      // Tác vụ này luôn được gọi sau khi xác thực thành công,
      // dù cho việc đồng bộ có lỗi hay không.
      setTimeout(() => closePopup(), 1000);
    }
  };

  /**
   * Hàm chính: Xử lý sự kiện submit form.
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const action = isRegister ? signUpAction : signInAction;
      const result = await action(formData);

      if (result?.success) {
        // Ủy quyền xử lý cho hàm trợ giúp khi thành công
        await handleAuthSuccess(isRegister);
      } else {
        toast.error(result?.message || "Đã xảy ra lỗi.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  backdrop-blur-sm">
      <div
        ref={modalRef}
        className="relative bg-[#2D333B] text-gray-100 w-full max-w-md rounded-xl shadow-2xl p-8 mx-4"
      >
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={closePopup}
            className="text-gray-400 hover:text-white text-2xl font-bold"
            aria-label="Close popup"
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
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
              name="confirmPassword"
              type="password"
              placeholder="Nhập lại mật khẩu"
              required
              className="w-full p-3 rounded-md bg-[#3B424A] border border-[#4B525B] focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
            />
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-md transition duration-200 text-lg"
            disabled={isPending}
          >
            {isPending
              ? "Đang xử lý..."
              : isRegister
              ? "TẠO TÀI KHOẢN"
              : "ĐĂNG NHẬP"}
          </button>
        </form>

        {!isRegister && (
          <>
            {/* OR Divider */}
            {/* <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-600"></div>
              <span className="mx-4 text-gray-400 uppercase text-sm font-semibold">
                HOẶC
              </span>
              <div className="flex-grow border-t border-gray-600"></div>
            </div> */}

            {/* Social */}
            {/* <div className="space-y-4">
              <button className="w-full bg-[#1877F2] hover:bg-[#156ACB] text-white font-bold py-3 rounded-md flex items-center justify-center space-x-2">
                <span>FACEBOOK</span>
              </button>
              <button className="w-full bg-white hover:bg-gray-100 text-gray-800 font-bold py-3 rounded-md flex items-center justify-center space-x-2">
                <span>GOOGLE</span>
              </button>
            </div> */}
          </>
        )}

        {/* Disclaimers */}
        <p className="text-gray-400 text-xs text-center mt-8 leading-relaxed px-2">
          Khi đăng ký bạn đã đồng ý với Các chính sách bảo mật của
          chúng tôi.
        </p>
      </div>
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
};

export default LoginPage;
