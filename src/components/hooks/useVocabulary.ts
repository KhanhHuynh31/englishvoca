import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { getAllVocabHistory } from "@/lib/vocabularyDB";
import { useState, useEffect } from "react";

// --- Các kiểu dữ liệu (Types) ---
export type StatusType = "new" | "known" | "hard";

export interface Word {
  id: string;
  term: string;
  definition: string;
  status: StatusType;
  image_url: string | null;
  meaning: string;
  phonetic: string;
  lastReviewed: string; // Tương ứng với created_at trong user_vocab
  example?: string | null;
}

const supabase = createSupabaseBrowserClient();

// --- Custom Hook mới ---
export const useVocabulary = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // 1. Thử lấy dữ liệu từ IndexedDB trước
        const dataFromDB = await getAllVocabHistory();

        if (dataFromDB && dataFromDB.length > 0) {
          console.log("✅ Dữ liệu được tải từ IndexedDB.");
          const formatted: Word[] = dataFromDB.map((item) => ({
            id: item.id.toString(),
            term: item.word,
            definition: item.definition || item.meaning,
            image_url: item.image_url,
            meaning: item.meaning,
            phonetic: item.phonetic,
            status: item.status as StatusType,
            lastReviewed: item.date || new Date().toISOString(),
          }));
          setWords(formatted);
        } else {
          // 2. Nếu IndexedDB trống, fetch từ Supabase
          console.log("ℹ️ IndexedDB trống. Đang tải dữ liệu từ Supabase...");

          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            console.log(
              "👤 Người dùng chưa đăng nhập. Không thể tải dữ liệu từ Supabase."
            );
            setWords([]); // Đảm bảo words là mảng rỗng
            return;
          }
          const { data: supabaseData, error: supabaseError } = await supabase
            .from("user_vocab")
            .select(
              `
              created_at,
              word_status,
              vocabulary(
                id,
                word,
                phonetic,
                part_of_speech,
                meaning,
                example,
                definition,
                image_url
              )
              `
            )
            .eq("user_id", user.id);

          if (supabaseError) {
            throw supabaseError;
          }

          if (supabaseData) {
            console.log(
              `✅ Tải thành công ${supabaseData.length} từ vựng từ Supabase.`
            );

            // --- PHẦN SỬA LỖI NẰM Ở ĐÂY ---
            const formatted = supabaseData
              .map((item) => {
                // Lấy chi tiết từ vựng một cách an toàn
                // Supabase có thể trả về object hoặc array cho join
                const vocabDetail = Array.isArray(item.vocabulary)
                  ? item.vocabulary[0]
                  : item.vocabulary;

                // Nếu không có chi tiết từ vựng, bỏ qua item này
                if (!vocabDetail) {
                  return null;
                }

                // Bây giờ, `vocabDetail` chắc chắn là một object
                return {
                  id: vocabDetail.id.toString(),
                  term: vocabDetail.word,
                  definition: vocabDetail.definition || vocabDetail.meaning,
                  image_url: vocabDetail.image_url,
                  meaning: vocabDetail.meaning,
                  phonetic: vocabDetail.phonetic,
                  status: item.word_status as StatusType,
                  lastReviewed: item.created_at,
                  example: vocabDetail.example,
                } as Word;
              })
              // Lọc bỏ bất kỳ giá trị null nào đã được tạo ra ở bước trên
              .filter((word): word is Word => word !== null);

            setWords(formatted);
          }
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Lỗi khi tải dữ liệu từ vựng:", err.message);
        } else {
          console.error("Lỗi khi tải dữ liệu từ vựng:", err);
        }
        setError("Không thể tải được danh sách từ vựng.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Chỉ chạy 1 lần khi component được mount

  return { words, loading, error };
};
