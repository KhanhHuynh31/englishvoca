import { createSupabaseServerClient } from "@/lib/supabase/server";
import ProfileIndexDB from "./profileIndexDB";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;

  if (user) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!error && data) {
      profile = data;
    }
  }

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="bg-white p-6 rounded-2xl shadow-md mb-8">
          <div className="flex items-center gap-6">
            <div className="relative w-24 h-24">
              <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-4xl font-bold shadow-inner">
                {profile?.username?.charAt(0).toUpperCase() ?? "?"}
              </div>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {profile?.username ?? "Khách"}
              </h1>
              <p className="text-gray-500 text-sm">
                {user?.email ?? "Chưa đăng nhập"}
              </p>
              {user?.created_at && (
                <p className="text-gray-400 text-sm mt-1">
                  Đã tham gia:{" "}
                  {new Date(user.created_at).toLocaleDateString("vi-VN")}
                </p>
              )}
            </div>
          </div>
        </div>

        <ProfileIndexDB />
      </div>
    </div>
  );
}
