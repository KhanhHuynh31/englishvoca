// app/learn/unit/page.tsx
import { createSupabaseServerClient } from "@/lib/supabase";
import BookUnitsClient from "./BookUnitsClient";

export const revalidate = 60;

export default async function BookUnits() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("units").select("*");

  if (error) {
    console.error("Lỗi tải dữ liệu:", error.message);
    return (
      <div className="p-6 text-center text-red-500">Không thể tải dữ liệu.</div>
    );
  }

  return <BookUnitsClient units={data || []} />;
}
