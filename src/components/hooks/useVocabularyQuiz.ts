import { useEffect, useState, useCallback } from "react";
import { useGetIndexDB } from "@/components/hooks/useGetIndexDB";
import { Word } from "@/components/hooks/useGetIndexDB";

export interface QuizQuestion {
  word: string;
  phonetic: string;
  meaning: string;
  imageUrl: string;
  options: string[];
  correct: string;
}

export const useVocabularyQuiz = () => {
  const vocabData = useGetIndexDB();
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  const MAX_QUESTIONS = 20;

  // Wrong answers
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

  // Used words
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

  // Shuffle helper
  const shuffle = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

  const generateQuestions = useCallback(() => {
    if (vocabData.length < 4) return;

    const wrongList = getWrongAnswers();
    const usedWords = getUsedWords();

    // Ưu tiên từ chưa kiểm tra
    const sortedVocab = [...vocabData].sort((a, b) => {
      const score = (w: Word) =>
        (w.status === "new" ? 3 : w.status === "hard" ? 2 : 1) +
        (Date.now() - new Date(w.lastReviewed).getTime()) /
          (1000 * 60 * 60 * 24) /
          30 +
        (wrongList.includes(w.term) ? 5 : 0) +
        (usedWords.includes(w.term) ? -10 : 10); // Ưu tiên từ chưa dùng

      return score(b) - score(a);
    });

    const selected = sortedVocab.slice(0, MAX_QUESTIONS);

    const generated = selected.map((item) => {
      const distractors = shuffle(
        vocabData.filter((w) => w.id !== item.id).map((w) => w.definition)
      ).slice(0, 3);

      return {
        word: item.term,
        phonetic: item.phonetic,
        meaning: item.definition,
        imageUrl:
          item.image_url || `https://source.unsplash.com/400x400/?english,${item.term}`,
        options: shuffle([item.definition, ...distractors]),
        correct: item.definition,
      };
    });

    setQuestions(generated);
    saveUsedWords([...new Set([...usedWords, ...selected.map((i) => i.term)])]);
  }, [vocabData]);

  useEffect(() => {
    if (vocabData.length === 0) return;

    const used = getUsedWords();
    const all = vocabData.map((v) => v.term);
    const unused = all.filter((term) => !used.includes(term));

    // Nếu gần hết từ, reset lại
    if (unused.length < MAX_QUESTIONS) {
      localStorage.removeItem("usedQuizWords");
    }

    generateQuestions();
  }, [vocabData, generateQuestions]);

  const getWrongQuestionObjects = (): QuizQuestion[] => {
    const wrong = getWrongAnswers();
    return vocabData
      .filter((w) => wrong.includes(w.term))
      .map((item) => {
        const distractors = shuffle(
          vocabData.filter((w) => w.id !== item.id).map((w) => w.definition)
        ).slice(0, 3);

        return {
          word: item.term,
          phonetic: item.pronunciation || "",
          meaning: item.definition,
          imageUrl:
            item.image_url || `https://source.unsplash.com/400x400/?english,${item.term}`,
          options: shuffle([item.definition, ...distractors]),
          correct: item.definition,
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
