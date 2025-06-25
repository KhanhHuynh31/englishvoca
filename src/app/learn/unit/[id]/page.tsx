import FlashcardClient from "./FlashCarrdClient";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function FlashcardPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("vocabulary")
    .select("*")
    .eq("unit_id", id);

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center">
        Không thể tải dữ liệu: {error.message}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="p-6 text-gray-500 text-center">
        Không có từ vựng nào trong bài học này.
      </div>
    );
  }

  return <FlashcardClient vocabData={data} />;
}
