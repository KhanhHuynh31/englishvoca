"use client";

import { useState, useCallback } from "react";
import FlashcardView from "./components/FlashCardView";
import CompletionScreen from "./components/CompletionScreen";
import { saveVocabHistory } from "@/lib/vocabularyDB";

interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
  phonetic: string;
  image_url: string;
  synonyms?: string[];
  otherMeanings?: string[];
  definition: string;
  partOfSpeech: string;
}

type StatusType = "known" | "new" | "hard";
type ViewState = "studying" | "completed";
type NavigationDirection = "left" | "right";

const TRANSITION_DELAY = 400;

export default function FlashcardClient({ id, vocabData }: { id: string; vocabData: VocabularyItem[] }) {
  const [viewState, setViewState] = useState<ViewState>("studying");
  const [statuses, setStatuses] = useState<(StatusType | null)[]>(Array(vocabData.length).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = useCallback((dir: NavigationDirection) => {
    setCurrentIndex((prev) => (dir === "right" ? (prev + 1) % vocabData.length : (prev - 1 + vocabData.length) % vocabData.length));
    setIsFlipped(false);
  }, [vocabData.length]);

  const handleSetStatus = useCallback(async (newStatus: StatusType) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setStatuses((prev) => {
      const updated = [...prev];
      updated[currentIndex] = newStatus;
      return updated;
    });

    const currentWord = vocabData[currentIndex];
    await saveVocabHistory({
      id: `${id}-${currentWord.word}`,
      word: currentWord.word,
      meaning: currentWord.meaning,
      status: newStatus,
      date: new Date().toISOString(),
    });

    setTimeout(() => {
      if (currentIndex + 1 >= vocabData.length) setViewState("completed");
      else handleNavigate("right");
      setIsTransitioning(false);
    }, TRANSITION_DELAY);
  }, [currentIndex, vocabData, id, isTransitioning, handleNavigate]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setStatuses(Array(vocabData.length).fill(null));
    setIsFlipped(false);
    setViewState("studying");
  }, [vocabData.length]);

  if (viewState === "completed") return <CompletionScreen onRetry={handleRetry} />;

  const currentCard = vocabData[currentIndex];
  if (!currentCard) return <div className="p-6 text-gray-500 text-center">Không tìm thấy thẻ hiện tại.</div>;

  return (
    <FlashcardView
      card={currentCard}
      status={statuses[currentIndex]}
      currentIndex={currentIndex}
      total={vocabData.length}
      isFlipped={isFlipped}
      isTransitioning={isTransitioning}
      onFlip={() => setIsFlipped((v) => !v)}
      onNavigate={handleNavigate}
      onSetStatus={handleSetStatus}
    />
  );
}
