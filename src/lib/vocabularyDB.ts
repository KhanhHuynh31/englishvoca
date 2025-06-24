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
    // Người dùng đã đăng nhập, thực hiện lưu vào Supabase
    try {
      const { data, error } = await createSupabaseBrowserClient()
        .from("user_vocab") // Tên bảng của bạn trên Supabase
        .upsert(
          {
            user_id: user.id,
            word_id: vocab.id,
            word_status: vocab.status,
            last_reviewed: vocab.date,
            // Thêm các trường khác nếu cần, ví dụ: user_id: user.uid
          },
          { onConflict: "id" } // Chỉ định cột 'id' là khóa chính, nếu có bản ghi trùng id, nó sẽ được cập nhật
        )
        .select(); // Để trả về dữ liệu đã được lưu/cập nhật

      if (error) {
        console.error("Lỗi khi lưu vào Supabase:", error.message);
      } else {
        console.log("Đã lưu/cập nhật thành công trên Supabase:", data);
      }
    } catch (error) {
      console.error("Lỗi không mong muốn khi kết nối Supabase:", error);
    }
  } else {
    console.log("Người dùng chưa đăng nhập, lưu vào IndexDB.");
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
      console.log(`Word ${vocab.id} is unchanged.`);
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
