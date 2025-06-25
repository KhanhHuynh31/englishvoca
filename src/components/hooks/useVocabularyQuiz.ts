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
  const localData = useGetIndexDB(); // fallback từ IndexedDB
  const [vocabData, setVocabData] = useState<Word[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasGenerated, setHasGenerated] = useState(false);

  const MAX_QUESTIONS = 20;

  // 🔄 Load dữ liệu Supabase (nếu có), fallback sang localData
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createSupabaseBrowserClient();
        const { data: userData } = await supabase.auth.getUser();

        if (userData?.user) {
          const { data, error } = await supabase
            .from("user_vocab")
            .select(
              `
              last_reviewed,
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

          if (data && !error) {
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
                lastReviewed: item.last_reviewed || new Date().toISOString(),
              };
            });

            setVocabData(formatted);
          } else {
            console.warn("Fallback to localData (Supabase failed)");
            setVocabData(localData);
          }
        } else {
          setVocabData(localData);
        }
      } catch (err) {
        console.error("Fetch failed, using localData", err);
        setVocabData(localData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [localData]);

  // 🧠 Shuffle & generate quiz
  const shuffle = <T>(arr: T[]): T[] =>
    [...arr].sort(() => Math.random() - 0.5);

  const getWrongAnswers = (): string[] => {
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
    try {
      return JSON.parse(localStorage.getItem("usedQuizWords") || "[]");
    } catch {
      return [];
    }
  };

  const saveUsedWords = (words: string[]) => {
    localStorage.setItem("usedQuizWords", JSON.stringify(words));
  };

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
    if (isLoading || hasGenerated || vocabData.length === 0) return;

    const unused = vocabData
      .map((v) => v.term)
      .filter((term) => !getUsedWords().includes(term));

    if (unused.length < MAX_QUESTIONS) {
      localStorage.removeItem("usedQuizWords");
    }

    generateQuestions();
    setHasGenerated(true);
  }, [isLoading, hasGenerated, vocabData, generateQuestions]);

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
  const updateLastReviewed = async (word: string) => {
    try {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { error } = await supabase
        .from("user_vocab")
        .update({ last_reviewed: new Date().toISOString() })
        .match({
          user_id: user.id,
          word_id: vocabData.find((v) => v.term === word)?.id,
        });

      if (error) {
        console.error("Failed to update last_reviewed", error);
      }
    } catch (err) {
      console.error("Error updating last_reviewed", err);
    }
  };

  return {
    questions,
    setQuestions,
    updateWrongAnswers,
    getWrongQuestionObjects,
    updateLastReviewed,
    isLoading, // ✅ thêm loading để kiểm soát hiển thị
  };
};
