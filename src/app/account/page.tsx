"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { signInAction, signUpAction } from "@/app/actions/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getAllVocabHistory, clearVocabHistory } from "@/lib/vocabularyDB";

type AuthMode = "login" | "register" | "forgot" | "reset";

const AccountPage = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirm: "" });
  const [fadeIn, setFadeIn] = useState(true);
  const [emailError, setEmailError] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const error = search.get("error");
    // ✅ Nếu link khôi phục hết hạn hoặc sai
    if (error) {
      toast.error("Link đã hết hạn. Vui lòng yêu cầu lại.", {
        duration: 3000,
      });
      setTimeout(() => {
        setMode("forgot");
      }, 1000);
      return;
    }

    const checkRecovery = async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setMode("reset"); // 👉 Cho phép đổi mật khẩu
      }
    };

    checkRecovery();
  }, []);

  const title = {
    login: "Đăng nhập",
    register: "Đăng ký",
    forgot: "Quên mật khẩu",
    reset: "Đặt lại mật khẩu",
  }[mode];

  const change = (field: string, value: string) => {
    setForm({ ...form, [field]: value });
    if (field === "email") setEmailError(""); // clear email error khi người dùng gõ lại
  };

  const setFadeOutAndSwitch = (next: AuthMode) => {
    setFadeIn(false);
    setTimeout(() => {
      setMode(next);
      setFadeIn(true);
    }, 200);
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    const res = await fetch("/api/check-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    return data.exists === true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = createSupabaseBrowserClient();

    try {
      if (mode === "forgot") {
        if (!form.email.includes("@")) {
          setEmailError("Email không hợp lệ");
          emailInputRef.current?.focus();
          return;
        }

        const exists = await checkEmailExists(form.email);
        if (!exists) {
          setEmailError("Email không tồn tại trong hệ thống.");
          emailInputRef.current?.focus();
          setLoading(false); // ❗ Phải dừng loading nếu trả về sớm
          return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(
          form.email,
          {
            redirectTo: `${window.location.origin}/account`,
          }
        );

        if (error) throw error;
        toast.success("Đã gửi email khôi phục!");
        setFadeOutAndSwitch("login");
        return;
      }

      if (mode === "reset") {
        const { error } = await supabase.auth.updateUser({
          password: form.password,
        });
        if (error) throw error;
        toast.success("Đổi mật khẩu thành công!");
        setTimeout(() => router.push("/"), 1500);
        return;
      }

      // login / register
      const action = mode === "login" ? signInAction : signUpAction;
      const formData = new FormData();
      formData.append("email", form.email);
      formData.append("password", form.password);
      if (mode === "register") formData.append("confirmPassword", form.confirm);

      const result = await action(formData);
      if (result?.success) {
        toast.success(title + " thành công!");
        await handleSyncAfterAuth();
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast.error(result?.message || "Có lỗi xảy ra.");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lỗi không xác định");
    } finally {
      setLoading(false);
    }
  };

  const handleSyncAfterAuth = async () => {
    const localVocab = await getAllVocabHistory();
    if (localVocab.length === 0) return;

    const supabase = createSupabaseBrowserClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data: existingVocab } = await supabase
      .from("user_vocab")
      .select("word_id")
      .eq("user_id", user.id);

    const existingIds = new Set(existingVocab?.map((v) => v.word_id));
    const newEntries = localVocab
      .filter((item) => !existingIds.has(item.id))
      .map((item) => ({
        user_id: user.id,
        word_id: item.id,
        word_status: item.status,
      }));

    if (newEntries.length > 0) {
      await supabase.from("user_vocab").insert(newEntries);
      await clearVocabHistory();
      toast.success(`Đồng bộ ${newEntries.length} từ.`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`transition-all duration-500 ease-in-out transform ${
          fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        } bg-[#2D333B] text-white rounded-xl p-6 w-full max-w-md shadow-2xl relative`}
      >
        <button
          onClick={() => router.push("/")}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold"
        >
          &times;
        </button>

        <h1 className="text-2xl font-bold text-center mb-4">{title}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === "login" || mode === "register" || mode === "forgot") && (
            <div>
              <input
                ref={emailInputRef}
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => change("email", e.target.value)}
                className={`w-full p-3 rounded-md bg-[#3B424A] border ${
                  emailError ? "border-red-500" : "border-[#4B525B]"
                } focus:outline-none`}
              />
              {emailError && (
                <p className="text-red-400 text-sm mt-1">{emailError}</p>
              )}
            </div>
          )}

          {(mode === "login" || mode === "register" || mode === "reset") && (
            <input
              type="password"
              placeholder="Mật khẩu"
              required
              value={form.password}
              onChange={(e) => change("password", e.target.value)}
              className="w-full p-3 rounded-md bg-[#3B424A] border border-[#4B525B] focus:outline-none"
            />
          )}

          {mode === "register" && (
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              required
              value={form.confirm}
              onChange={(e) => change("confirm", e.target.value)}
              className="w-full p-3 rounded-md bg-[#3B424A] border border-[#4B525B] focus:outline-none"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-md font-bold"
          >
            {loading ? "Đang xử lý..." : title}
          </button>
        </form>

        <div className="mt-4 text-sm text-center text-gray-400 space-y-1">
          {mode === "login" && (
            <>
              <button
                onClick={() => setFadeOutAndSwitch("forgot")}
                className="hover:underline"
              >
                Quên mật khẩu?
              </button>
              <br />
              <button
                onClick={() => setFadeOutAndSwitch("register")}
                className="hover:underline"
              >
                Chưa có tài khoản?
              </button>
            </>
          )}
          {mode === "register" && (
            <button
              onClick={() => setFadeOutAndSwitch("login")}
              className="hover:underline"
            >
              Đã có tài khoản? Đăng nhập
            </button>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <button
              onClick={() => setFadeOutAndSwitch("login")}
              className="hover:underline"
            >
              Quay lại đăng nhập
            </button>
          )}
        </div>

        <Toaster position="top-center" />
      </div>
    </div>
  );
};

export default AccountPage;
