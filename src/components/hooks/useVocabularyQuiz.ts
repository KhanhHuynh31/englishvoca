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

  const shuffle = <T,>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

  const generateQuestions = useCallback(() => {
    if (vocabData.length < 4) return;

    const wrongList = getWrongAnswers();

    const sortedVocab = [...vocabData].sort((a, b) => {
      const score = (w: Word) =>
        (w.status === "new" ? 3 : w.status === "hard" ? 2 : 1) +
        (Date.now() - new Date(w.lastReviewed).getTime()) / (1000 * 60 * 60 * 24) / 30 +
        (wrongList.includes(w.term) ? 5 : 0); // Ưu tiên từ sai
      return score(b) - score(a);
    });

    const generated = sortedVocab.map((item) => {
      const distractors = shuffle(
        vocabData.filter((w) => w.id !== item.id).map((w) => w.definition)
      ).slice(0, 3);

      return {
        word: item.term,
        phonetic: item.pronunciation || "",
        meaning: item.definition,
        imageUrl:
          item.image_url || "https://source.unsplash.com/400x400/?english",
        options: shuffle([item.definition, ...distractors]),
        correct: item.definition,
      };
    });

    setQuestions(generated);
  }, [vocabData]);

  useEffect(() => {
    generateQuestions();
  }, [generateQuestions]);

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
            item.image_url || "https://source.unsplash.com/400x400/?english",
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
