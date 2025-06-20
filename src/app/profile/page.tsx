import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) {
    return <div className="p-4 text-red-500">Không thể tải hồ sơ người dùng.</div>;
  }

  return (
    <div className="min-h-screen w-full">
      <div className="p-4">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 lg:mb-0">
          <div className="flex items-center mb-6">
            <div className="relative w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 text-6xl">
              {profile.username.charAt(0).toUpperCase()}
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                <i className="fas fa-pencil-alt text-gray-600 text-sm"></i>
              </button>
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-gray-800">{profile.username}</h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <p className="text-gray-500 text-sm">
                Đã tham gia {new Date(user.created_at!).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Thống kê</h2>
          {/* Thêm thông tin thống kê ở đây */}
        </div>
      </div>
    </div>
  );
}
