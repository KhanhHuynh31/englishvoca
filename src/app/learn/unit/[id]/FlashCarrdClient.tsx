"use client";

import { useState, useCallback } from "react";
import FlashcardView from "./components/FlashCardView";
import CompletionScreen from "./components/CompletionScreen";
import { saveVocabHistory } from "@/lib/vocabularyDB";
import * as Tone from "tone";

interface VocabularyItem {
  id: string;
  word: string;
  meaning: string;
  example: string;
  phonetic: string;
  image_url: string;
  synonyms?: string[];
  otherMeanings?: string[];
  definition: string;
  part_of_speech: string;
}

type StatusType = "known" | "new" | "hard";
type ViewState = "studying" | "completed";
type NavigationDirection = "left" | "right";

const TRANSITION_DELAY = 400;

// 🔊 Âm thanh tạo bằng Tone.js
const playFlipSound = () => {
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease("C5", "8n"); // Âm flip cao
};

const playNavigateSound = () => {
  const synth = new Tone.MembraneSynth().toDestination();
  synth.triggerAttackRelease("C2", "8n"); // Âm chuyển trầm
};

const playStatusSound = () => {
  const synth = new Tone.Synth().toDestination();
  synth.triggerAttackRelease("E4", "16n");
  setTimeout(() => synth.triggerAttackRelease("G4", "16n"), 100); // Âm trạng thái nhẹ
};

export default function FlashcardClient({ vocabData }: { vocabData: VocabularyItem[] }) {
  const [viewState, setViewState] = useState<ViewState>("studying");
  const [statuses, setStatuses] = useState<(StatusType | null)[]>(Array(vocabData.length).fill(null));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleNavigate = useCallback((dir: NavigationDirection) => {
    playNavigateSound(); // 👈 Phát âm
    setCurrentIndex((prev) =>
      dir === "right" ? (prev + 1) % vocabData.length : (prev - 1 + vocabData.length) % vocabData.length
    );
    setIsFlipped(false);
  }, [vocabData.length]);

  const handleSetStatus = useCallback(async (newStatus: StatusType) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    playStatusSound(); // 👈 Phát âm

    setStatuses((prev) => {
      const updated = [...prev];
      updated[currentIndex] = newStatus;
      return updated;
    });

    const currentWord = vocabData[currentIndex];
    await saveVocabHistory({
      id: currentWord.id,
      word: currentWord.word,
      meaning: currentWord.meaning,
      status: newStatus,
      date: new Date().toLocaleString(),
    });

    setTimeout(() => {
      if (currentIndex + 1 >= vocabData.length) setViewState("completed");
      else handleNavigate("right");
      setIsTransitioning(false);
    }, TRANSITION_DELAY);
  }, [currentIndex, vocabData, isTransitioning, handleNavigate]);

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setStatuses(Array(vocabData.length).fill(null));
    setIsFlipped(false);
    setViewState("studying");
  }, [vocabData.length]);

  const handleFlip = useCallback(() => {
    playFlipSound(); // 👈 Phát âm
    setIsFlipped((v) => !v);
  }, []);

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
      onFlip={handleFlip}
      onNavigate={handleNavigate}
      onSetStatus={handleSetStatus}
    />
  );
}
