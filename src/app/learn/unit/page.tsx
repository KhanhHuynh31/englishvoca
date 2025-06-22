import BookUnitsClient from "./BookUnitsClient";
import { fallbackUnits } from "@/lib/data/fallback-unit";

export default async function BookUnits() {
//   const supabase = await createSupabaseServerClient();
//   const { data, error } = await supabase.from("units").select("*").order('id');
// ;

//   if (error) {
//     console.error("Lỗi tải dữ liệu:", error.message);
//     return (
//       <div className="p-6 text-center text-red-500">Không thể tải dữ liệu.</div>
//     );
//   }

  return <BookUnitsClient units={fallbackUnits} />;
}
