import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileIndexDB from "./profileIndexDB";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/account");
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (error || !profile) {
    return (
      <div className="p-4 text-red-500">Không thể tải hồ sơ người dùng.</div>
    );
  }

  return (
    <div className="min-h-screen w-full ">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-4xl font-bold shadow-inner">
                {profile.username.charAt(0).toUpperCase()}
              </div>
              <button
                className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-1.5 shadow hover:bg-gray-100 transition"
                title="Chỉnh sửa"
              >
                <svg
                  className="w-4 h-4 text-gray-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M17.414 2.586a2 2 0 0 1 0 2.828l-1.829 1.829-2.828-2.828L14.586 2.586a2 2 0 0 1 2.828 0zM13.172 5.172l-9.9 9.9a1 1 0 0 0-.263.446l-1 3a1 1 0 0 0 1.263 1.263l3-1a1 1 0 0 0 .446-.263l9.9-9.9-2.446-2.446z" />
                </svg>
              </button>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {profile.username}
              </h1>
              <p className="text-gray-500 text-sm">{user.email}</p>
              <p className="text-gray-400 text-sm mt-1">
                Đã tham gia:{" "}
                {new Date(user.created_at!).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        <ProfileIndexDB />
      </div>
    </div>
  );
}
