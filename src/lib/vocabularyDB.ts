import { openDB } from "idb";
import { createSupabaseBrowserClient } from "./supabase/client";

const DB_NAME = "vocab-db";
const STORE_NAME = "vocab-history";

type StatusType = "new" | "hard" | "known";

export const getDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
};

export const saveVocabHistory = async (vocab: {
  id: string;
  word: string;
  meaning: string;
  status: StatusType;
  image_url?: string;
  phonetic?: string;
  date: string;
}) => {
  const supabase = createSupabaseBrowserClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    try {
      // 1. Kiểm tra xem đã có bản ghi chưa
      const { data: existing, error: checkError } = await supabase
        .from("user_vocab")
        .select("id")
        .eq("user_id", user.id)
        .eq("word_id", vocab.id)
        .maybeSingle();

      if (checkError) {
        console.error("Lỗi khi kiểm tra từ vựng:", checkError.message);
        return;
      }

      if (existing) {
        // 2. Nếu đã có -> update
        const { error: updateError } = await supabase
          .from("user_vocab")
          .update({
            word_status: vocab.status,
            last_reviewed: vocab.date,
          })
          .eq("id", existing.id);

        if (updateError) {
          console.error("Không thể cập nhật từ:", updateError.message);
        } else {
          console.log(`✅ Đã cập nhật từ '${vocab.word}'`);
        }
      } else {
        // 3. Nếu chưa có -> insert
        const { error: insertError } = await supabase.from("user_vocab").insert([
          {
            user_id: user.id,
            word_id: vocab.id,
            word_status: vocab.status,
            last_reviewed: vocab.date,
          },
        ]);

        if (insertError) {
          console.error("Không thể thêm từ mới:", insertError.message);
        } else {
          console.log(`✅ Đã thêm mới từ '${vocab.word}'`);
        }
      }
    } catch (error) {
      console.error("Lỗi không mong muốn:", error);
    }
  } else {
    // Người dùng chưa đăng nhập → lưu vào IndexedDB
    console.log("🗃️ Người dùng chưa đăng nhập, lưu vào IndexDB.");
    const db = await getDB();
    const existing = await db.get(STORE_NAME, vocab.id);

    if (!existing) {
      await db.put(STORE_NAME, vocab);
    } else if (
      existing.status !== vocab.status ||
      existing.meaning !== vocab.meaning
    ) {
      await db.put(STORE_NAME, { ...existing, ...vocab });
    } else {
      console.log(`Word ${vocab.id} không thay đổi.`);
    }
  }
};


export const getAllVocabHistory = async () => {
  const db = await getDB();
  return db.getAll(STORE_NAME);
};

export const updateVocabStatus = async (
  id: string,
  newStatus: StatusType,
  date: string
) => {
  // Cập nhật IndexedDB
  const db = await getDB(); // Giả định getDB() đã được định nghĩa cho IndexedDB
  const word = await db.get(STORE_NAME, id);
  if (word) {
    word.status = newStatus;
    word.date = date;
    await db.put(STORE_NAME, word);
  }
  // Cập nhật Supabase
  try {
    const { data, error } = await createSupabaseBrowserClient()
      .from("user_vocab") // Tên bảng của bạn trên Supabase
      .update({ word_status: newStatus, last_reviewed: date }) // Các cột bạn muốn cập nhật
      .eq("word_id", id); // Điều kiện để tìm bản ghi cần cập nhật (ví dụ: theo id)

    if (error) {
      console.error("Lỗi khi cập nhật Supabase:", error.message);
      // Xử lý lỗi nếu cần, ví dụ: thông báo cho người dùng, ghi log, rollback IndexedDB (nếu có logic phức tạp)
    } else {
      console.log("Cập nhật Supabase thành công:", data);
    }
  } catch (error) {
    console.error("Lỗi không mong muốn khi kết nối Supabase:", error);
  }
};
export const clearVocabHistory = async () => {
  const db = await getDB();
  await db.clear("vocab-history");
};
