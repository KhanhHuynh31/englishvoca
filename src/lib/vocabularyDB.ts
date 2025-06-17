import { openDB } from "idb";

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
  const db = await getDB();
  const existing = await db.get(STORE_NAME, vocab.id);

  if (!existing) {
  await db.put(STORE_NAME, vocab);
} else if (existing.status !== vocab.status || existing.meaning !== vocab.meaning) {
  await db.put(STORE_NAME, { ...existing, ...vocab });
} else {
  console.log(`Word ${vocab.id} is unchanged.`);
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
  const db = await getDB();
  const word = await db.get(STORE_NAME, id);
  if (word) {
    word.status = newStatus;
    word.date = date;
    await db.put(STORE_NAME, word);
  }
};
export const clearVocabHistory = async () => {
  const db = await getDB();
  await db.clear("vocab-history");
};