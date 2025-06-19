// hooks/useLoadWords.ts
import { useEffect, useState } from "react";
import { getAllVocabHistory } from "@/lib/vocabularyDB";

export type StatusType = "new" | "known" | "hard";

export interface Word {
  id: string;
  term: string;
  definition: string;
  status: StatusType;
  image_url: string;
  pronunciation: string;
  meaning: string;
  phonetic: string;
  lastReviewed: string;
}

export const useGetIndexDB = () => {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    getAllVocabHistory().then((dataFromDB) => {
      const formatted: Word[] = dataFromDB.map((item) => ({
        id: item.id,
        term: item.word,
        definition: item.meaning,
        image_url: item.image_url,
        meaning: item.meaning,
        phonetic: item.phonetic,
        status: item.status as StatusType,
        pronunciation: item.word,
        lastReviewed: item.date,
      }));
      setWords(formatted);
    });
  }, []);

  return words;
};
