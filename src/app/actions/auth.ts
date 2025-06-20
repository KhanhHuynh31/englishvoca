"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // Basic validation
  if (!email || !password) {
    return { success: false, message: "Vui lòng nhập email và mật khẩu." };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      success: false,
      message: "Email hoặc mật khẩu không đúng. Vui lòng thử lại.",
    };
  }

  return { success: true };
}

export async function signUpAction(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!email || !password || !confirmPassword) {
    return {
      success: false,
      message: "Vui lòng điền đầy đủ các trường.",
    };
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Mật khẩu xác nhận không khớp." };
  }

  if (password.length < 6) {
    return {
      success: false,
      message: "Mật khẩu phải có ít nhất 6 ký tự.",
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    if (authError.message.includes("User already registered")) {
      return { success: false, message: "Email đã được đăng ký." };
    }
    return { success: false, message: authError.message };
  }

  // --- Bắt đầu thêm dữ liệu vào bảng user_profiles ---
  if (authData.user) {
    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert([
        {
          user_id: authData.user.id, // ID của người dùng từ Supabase Auth
          username: email.split("@")[0], // Tên người dùng mặc định từ email
          // avatar_url: 'default_avatar.png', // Tùy chọn: Thêm avatar mặc định
          // bio: 'Xin chào! Tôi là người dùng mới.', // Tùy chọn: Thêm bio mặc định
        },
      ]);

    if (profileError) {
      // Xử lý lỗi nếu không thể tạo profile. Có thể muốn xóa người dùng vừa tạo
      // nếu việc tạo profile thất bại để tránh dữ liệu không nhất quán.
      console.error("Lỗi khi tạo user profile:", profileError);
      // await supabase.auth.admin.deleteUser(authData.user.id); // Cần Supabase Admin client để xóa
      return {
        success: false,
        message:
          "Đăng ký thành công nhưng không thể tạo hồ sơ người dùng. Vui lòng liên hệ hỗ trợ.",
      };
    }
  }
  // --- Kết thúc thêm dữ liệu vào bảng user_profiles ---

  return { success: true };
}
