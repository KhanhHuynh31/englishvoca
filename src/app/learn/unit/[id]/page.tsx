"use client";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, {
  useEffect,
  useState,
  useCallback,
  memo,
  MouseEvent,
} from "react";
import Listening from "@/components/Listening/Listening";
import Loading from "@/components/Loading/Loading";
import { saveVocabHistory } from "@/lib/vocabularyDB";

// ================================================================
// 1. TYPES & CONSTANTS (Định nghĩa kiểu dữ liệu và hằng số)
// =================================================================

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
type ViewState = "loading" | "error" | "studying" | "completed";
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

const TRANSITION_DELAY = 400; // ms

// =================================================================
// 2. CHILD COMPONENTS (Component con được tối ưu và co-located)
// =================================================================

// Component hiển thị trạng thái (Loading, Error, Empty)
const StatusDisplay = memo(
  ({ message, isError = false }: { message: string; isError?: boolean }) => (
    <div className="flex items-center justify-center h-screen">
      <span className={`text-lg ${isError ? "text-red-500" : "text-gray-500"}`}>
        {message}
      </span>
    </div>
  )
);
StatusDisplay.displayName = "StatusDisplay";

// Component màn hình hoàn thành
const CompletionScreen = memo(({ onRetry }: { onRetry: () => void }) => (
  <div className="flex flex-col items-center justify-center h-screen px-4 text-center animate-fade-in">
    <h2 className="text-4xl font-bold text-green-600 mb-4">🎉 Hoàn thành!</h2>
    <p className="text-gray-600 mb-8">
      Chúc mừng bạn đã hoàn thành bài học. Hãy ôn tập thường xuyên nhé!
    </p>
    <button
      onClick={onRetry}
      className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
    >
      🔁 Học lại
    </button>
  </div>
));
CompletionScreen.displayName = "CompletionScreen";

// --- Component Flashcard chính ---
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

    return (
      <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 animate-fade-in">
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className="bg-blue-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Card Container */}
        <div className="w-full max-w-md h-[500px] [perspective:1000px] mb-4">
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
                      isTransitioning
                        ? "cursor-wait opacity-50"
                        : "hover:scale-105"
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
              <h3 className="text-xl font-bold text-blue-700">
                📖 {card.meaning}
              </h3>
              <p className="text-gray-600 mt-2">&quot;{card.example}&quot;</p>
              <div className="w-full h-[1px] bg-gray-200 my-3" />
              <h4 className="font-semibold text-gray-800">Định nghĩa:</h4>
              <p className="text-sm text-gray-600">{card.definition}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between w-full max-w-xs">
          <button
            onClick={() => onNavigate("left")}
            className="p-4 bg-white rounded-full shadow-md hover:bg-gray-100 transition"
          >
            <span className="text-xl">←</span>
          </button>
          <span className="text-lg font-semibold text-gray-700">
            {currentIndex + 1} / {total}
          </span>
          <button
            onClick={() => onNavigate("right")}
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

// =================================================================
// 3. MAIN PAGE COMPONENT (Component trang chính)
// =================================================================

export default function FlashcardPage() {
  const [viewState, setViewState] = useState<ViewState>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const [vocabData, setVocabData] = useState<VocabularyItem[]>([]);
  const [statuses, setStatuses] = useState<(StatusType | null)[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const params = useParams();
  const id = params.id as string;

  // --- Data Fetching Logic ---
  useEffect(() => {
    if (!id) return;
    const loadData = async () => {
      setViewState("loading");
      try {
        const res = await fetch(`/api/vocabulary?unit_id=${id}`);
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error || "Không thể tải dữ liệu từ vựng.");

        if (data.length === 0) {
          setErrorMessage("Không có từ vựng nào trong bài học này.");
          setViewState("error");
          return;
        }

        setVocabData(data);
        setStatuses(Array(data.length).fill(null));
        setCurrentIndex(0);
        setIsFlipped(false);
        setViewState("studying");
      } catch (err) {
        setErrorMessage(
          err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định."
        );
        setViewState("error");
      }
    };
    loadData();
  }, [id]);

  // --- Event Handlers with useCallback for performance ---
  const handleNavigate = useCallback(
    (direction: NavigationDirection) => {
      if (vocabData.length === 0) return;
      setCurrentIndex((prev) => {
        const newIndex = direction === "right" ? prev + 1 : prev - 1;
        return (newIndex + vocabData.length) % vocabData.length;
      });
      setIsFlipped(false);
    },
    [vocabData.length]
  );

  const handleSetStatus = useCallback(
    async (newStatus: StatusType) => {
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
        if (currentIndex + 1 >= vocabData.length) {
          setViewState("completed");
        } else {
          handleNavigate("right");
        }
        setIsTransitioning(false);
      }, TRANSITION_DELAY);
    },
    [currentIndex, vocabData, id, isTransitioning, handleNavigate]
  );

  const handleRetry = useCallback(() => {
    setCurrentIndex(0);
    setStatuses(Array(vocabData.length).fill(null));
    setIsFlipped(false);
    setViewState("studying");
  }, [vocabData.length]);

  const handleFlip = useCallback(() => setIsFlipped((v) => !v), []);

  // --- Render logic based on viewState ---
  if (viewState === "loading") return <Loading />;
  if (viewState === "error")
    return <StatusDisplay message={errorMessage} isError />;

  if (viewState === "completed")
    return <CompletionScreen onRetry={handleRetry} />;

  const currentCard = vocabData[currentIndex];
  if (!currentCard)
    return <StatusDisplay message="Không tìm thấy thẻ hiện tại." isError />;

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
