// ✅ File: app/learn/unit/[id]/components/FlashcardView.tsx
"use client";

import Image from "next/image";
import Listening from "@/components/Listening/Listening";
import { memo, MouseEvent, useState } from "react";

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
type NavigationDirection = "left" | "right";

const STATUS_MAP: Record<StatusType, { label: string; className: string }> = {
  known: {
    label: "✅ Đã biết",
    className: "bg-green-100 text-green-800 border border-green-400",
  },
  new: {
    label: "✨ Từ mới",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-400",
  },
  hard: {
    label: "💡 Từ khó",
    className: "bg-red-100 text-red-800 border border-red-400",
  },
};

interface FlashcardViewProps {
  card: VocabularyItem;
  status: StatusType | null;
  currentIndex: number;
  total: number;
  isFlipped: boolean;
  isTransitioning: boolean;
  onFlip: () => void;
  onNavigate: (dir: NavigationDirection) => void;
  onSetStatus: (status: StatusType) => void;
}

const FlashcardView = memo(
  ({
    card,
    status,
    currentIndex,
    total,
    isFlipped,
    isTransitioning,
    onFlip,
    onNavigate,
    onSetStatus,
  }: FlashcardViewProps) => {
    const [animateDir, setAnimateDir] = useState<"left" | "right" | null>(null);

    const progress = total > 0 ? ((currentIndex + 1) / total) * 100 : 0;
    const cardColorClass = status
      ? STATUS_MAP[status].className
      : "bg-white border border-gray-200";

    const handleStatusClick = (e: MouseEvent, newStatus: StatusType) => {
      e.stopPropagation();
      if (!isTransitioning) {
        onSetStatus(newStatus);
      }
    };

    const handleNavigateWithAnimation = (dir: NavigationDirection) => {
      setAnimateDir(dir);
      setTimeout(() => {
        onNavigate(dir);
        setAnimateDir(null);
      }, 300);
    };

    const animationClass = animateDir
      ? animateDir === "left"
        ? "animate-slide-out-left"
        : "animate-slide-out-right"
      : "animate-fade-in";

    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card Container */}
        <div className={`w-full max-w-md h-[500px] [perspective:1000px] mb-4 ${animationClass}`}>
          <div
            className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
            onClick={onFlip}
          >
            {/* Front of Card */}
            <div
              className={`absolute w-full h-full backface-hidden p-6 rounded-2xl shadow-lg flex flex-col items-center justify-center text-center cursor-pointer ${cardColorClass}`}
            >
              <Image
                width={200}
                height={200}
                src={
                  card.image_url ||
                  `https://placehold.co/300x300/e2e8f0/4a5568?text=${card.word}`
                }
                alt={card.word}
                className="w-48 h-48 object-cover rounded-lg mb-4 shadow-md"
              />
              <h2 className="text-3xl font-bold text-gray-800">{card.word}</h2>
              <p className="text-md text-gray-500 mt-1">
                {card.phonetic} <Listening word={card.word} />
              </p>
              <div className="absolute bottom-6 flex flex-wrap gap-2 justify-center">
                {Object.keys(STATUS_MAP).map((key) => (
                  <button
                    key={key}
                    onClick={(e) => handleStatusClick(e, key as StatusType)}
                    disabled={isTransitioning}
                    className={`text-sm px-4 py-2 rounded-full font-semibold transition ${
                      isTransitioning ? "cursor-wait opacity-50" : "hover:scale-105"
                    } ${
                      status === key
                        ? STATUS_MAP[key as StatusType].className
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {STATUS_MAP[key as StatusType].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Back of Card */}
            <div
              className={`absolute w-full h-full [transform:rotateY(180deg)] backface-hidden p-6 rounded-2xl shadow-lg overflow-y-auto cursor-pointer ${cardColorClass}`}
            >
              <h3 className="text-xl font-bold text-blue-700">📖 {card.meaning}</h3>
              <p className="text-gray-600 mt-2">"{card.example}"</p>
              <div className="w-full h-[1px] bg-gray-200 my-3" />
              <h4 className="font-semibold text-gray-800">Định nghĩa:</h4>
              <p className="text-sm text-gray-600">{card.definition}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between w-full max-w-xs">
          <button
            onClick={() => handleNavigateWithAnimation("left")}
            className="p-4 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <span className="text-xl">←</span>
          </button>
          <span className="text-lg font-semibold text-gray-700">
            {currentIndex + 1} / {total}
          </span>
          <button
            onClick={() => handleNavigateWithAnimation("right")}
            className="p-4 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <span className="text-xl">→</span>
          </button>
        </div>
      </div>
    );
  }
);
FlashcardView.displayName = "FlashcardView";

export default FlashcardView;
