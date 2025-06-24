import { useEffect, useState, useCallback } from "react";
import { useGetIndexDB, Word } from "@/components/hooks/useGetIndexDB";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export interface QuizQuestion {
  word: string;
  phonetic: string;
  meaning: string;
  imageUrl: string;
  options: string[];
  correct: string;
}

export const useVocabularyQuiz = () => {
  const localData = useGetIndexDB(); // fallback
  const [vocabData, setVocabData] = useState<Word[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false); // ✅ chỉ tạo câu hỏi 1 lần
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const MAX_QUESTIONS = 20;

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createSupabaseBrowserClient();
      const { data: userData } = await supabase.auth.getUser();

      if (userData?.user) {
        const { data, error } = await supabase
          .from("user_vocab")
          .select(
            `
            created_at,
            word_status,
            vocabulary (
              id,
              word,
              phonetic,
              partOfSpeech,
              meaning,
              example,
              definition,
              image_url
            )
          `
          )
          .eq("user_id", userData.user.id);

        if (!error && data) {
          const formatted: Word[] = data.map((item) => {
            const v = Array.isArray(item.vocabulary)
              ? item.vocabulary[0]
              : item.vocabulary;
            return {
              id: v?.id,
              term: v?.word,
              phonetic: v?.phonetic || "",
              partOfSpeech: v?.partOfSpeech || "",
              meaning: v?.meaning || "",
              example: v?.example || "",
              definition: v?.definition || "",
              pronunciation: v?.phonetic || "",
              image_url: v?.image_url || "",
              status: item.word_status || "new",
              lastReviewed: item.created_at || new Date().toISOString(),
            };
          });
          setVocabData(formatted);
        } else {
          setVocabData(localData);
        }
      } else {
        setVocabData(localData);
      }

      setIsReady(true); // ✅ đã có dữ liệu
    };

    fetchData();
  }, [localData]);

  const getWrongAnswers = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("wrongAnswers") || "[]");
    } catch {
      return [];
    }
  };

  const updateWrongAnswers = (word: string, isCorrect: boolean) => {
    const wrong = getWrongAnswers();
    const updated = isCorrect
      ? wrong.filter((w) => w !== word)
      : [...new Set([...wrong, word])];
    localStorage.setItem("wrongAnswers", JSON.stringify(updated));
  };

  const getUsedWords = (): string[] => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("usedQuizWords") || "[]");
    } catch {
      return [];
    }
  };

  const saveUsedWords = (words: string[]) => {
    localStorage.setItem("usedQuizWords", JSON.stringify(words));
  };

  const shuffle = <T>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

  const generateQuestions = useCallback(() => {
    if (vocabData.length < 4) return;

    const wrongList = getWrongAnswers();
    const usedWords = getUsedWords();

    const sortedVocab = [...vocabData].sort((a, b) => {
      const score = (w: Word) =>
        (w.status === "new" ? 3 : w.status === "hard" ? 2 : 1) +
        (Date.now() - new Date(w.lastReviewed).getTime()) /
          (1000 * 60 * 60 * 24) /
          30 +
        (wrongList.includes(w.term) ? 5 : 0) +
        (usedWords.includes(w.term) ? -10 : 10);
      return score(b) - score(a);
    });

    const selected = sortedVocab.slice(0, MAX_QUESTIONS);

    const generated = selected.map((item) => {
      const isUsingMeaning = Math.random() < 0.5;
      const correctAnswer = isUsingMeaning ? item.meaning : item.definition;

      const distractors = shuffle(
        vocabData
          .filter((w) => w.id !== item.id)
          .map((w) => (isUsingMeaning ? w.meaning : w.definition))
          .filter((t) => !!t && t !== correctAnswer)
      ).slice(0, 3);

      return {
        word: item.term,
        phonetic: item.phonetic,
        meaning: correctAnswer,
        imageUrl:
          item.image_url ||
          `https://source.unsplash.com/400x400/?english,${item.term}`,
        options: shuffle([correctAnswer, ...distractors]),
        correct: correctAnswer,
      };
    });

    setQuestions(generated);
    saveUsedWords([...new Set([...usedWords, ...selected.map((i) => i.term)])]);
  }, [vocabData]);

  useEffect(() => {
    if (!isReady || hasGenerated || vocabData.length === 0) return;

    const used = getUsedWords();
    const all = vocabData.map((v) => v.term);
    const unused = all.filter((term) => !used.includes(term));

    if (unused.length < MAX_QUESTIONS) {
      localStorage.removeItem("usedQuizWords");
    }

    generateQuestions();
    setHasGenerated(true); // ✅ chỉ gọi 1 lần
  }, [isReady, vocabData, hasGenerated, generateQuestions]);

  const getWrongQuestionObjects = (): QuizQuestion[] => {
    const wrong = getWrongAnswers();
    return vocabData
      .filter((w) => wrong.includes(w.term))
      .map((item) => {
        const isUsingMeaning = Math.random() < 0.5;
        const correctAnswer = isUsingMeaning ? item.meaning : item.definition;

        const distractors = shuffle(
          vocabData
            .filter((w) => w.id !== item.id)
            .map((w) => (isUsingMeaning ? w.meaning : w.definition))
            .filter((t) => !!t && t !== correctAnswer)
        ).slice(0, 3);

        return {
          word: item.term,
          phonetic: item.pronunciation || "",
          meaning: correctAnswer,
          imageUrl:
            item.image_url ||
            `https://source.unsplash.com/400x400/?english,${item.term}`,
          options: shuffle([correctAnswer, ...distractors]),
          correct: correctAnswer,
        };
      });
  };

  return {
    questions,
    setQuestions,
    updateWrongAnswers,
    getWrongQuestionObjects,
  };
};
