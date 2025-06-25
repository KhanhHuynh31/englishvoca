"use client";
import Link from "next/link";
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  memo,
  ChangeEvent,
  MouseEvent,
} from "react";
import Listening from "@/components/Listening/Listening";
import Pagination from "@/components/Pagination/Pagination";
import { clearVocabHistory, updateVocabStatus } from "@/lib/vocabularyDB";
// import { useGetIndexDB } from "@/components/hooks/useGetIndexDB"; // LOẠI BỎ IMPORT NÀY
import {
  useVocabulary,
} from "@/components/hooks/useVocabulary"; // IMPORT HOOK MỚI VÀ ĐỔI TÊN WORD ĐỂ TRÁNH TRÙNG LẶP
import LoadingWordBook from "./loading";

// =================================================================
// 1. TYPES & CONSTANTS (Định nghĩa kiểu dữ liệu và hằng số)
// =================================================================

// Điều chỉnh Word interface để khớp với Word trong useVocabulary hook
// Hoặc sử dụng trực tiếp VocabularyWord từ hook đã import
export interface Word {
  id: string;
  term: string;
  definition: string;
  status: StatusType;
  lastReviewed: string;
  meaning: string;
  phonetic: string;
  image_url: string | null;
  example?: string | null;
}

export type StatusType = "new" | "known" | "hard";
export type SortType = "date" | "alpha";

const PAGE_SIZE = 10;

const STATUS_CONFIG: Record<
  StatusType,
  {
    label: string;
    changeLabel: string;
    bgColor: string;
    activeColor: string;
    buttonColor: string;
  }
> = {
  new: {
    label: "Từ mới",
    changeLabel: "Chưa thuộc",
    bgColor: "bg-yellow-50",
    activeColor: "bg-yellow-200 text-yellow-800 border-yellow-400",
    buttonColor: "bg-yellow-500 hover:bg-yellow-600",
  },
  known: {
    label: "Đã học",
    changeLabel: "Đã thuộc",
    bgColor: "bg-green-50",
    activeColor: "bg-green-200 text-green-800 border-green-400",
    buttonColor: "bg-green-500 hover:bg-green-600",
  },
  hard: {
    label: "Từ khó",
    changeLabel: "Từ khó",
    bgColor: "bg-red-50",
    activeColor: "bg-red-200 text-red-800 border-red-400",
    buttonColor: "bg-red-500 hover:bg-red-600",
  },
};

// =================================================================
// 2. CHILD COMPONENT (Component con)
// Tách component WordCard ra khỏi logic chính để dễ quản lý và tối ưu với React.memo.
// =================================================================

type WordCardProps = {
  word: Word; // Sử dụng interface Word đã cập nhật
  isRevealed: boolean;
  hideDefinition: boolean;
  onCardClick: (id: string) => void;
  onChangeStatus: (id: string, status: StatusType) => void;
};

const WordCardComponent = ({
  word,
  isRevealed,
  hideDefinition,
  onCardClick,
  onChangeStatus,
}: WordCardProps) => {
  const handleStatusChange = (e: MouseEvent, status: StatusType) => {
    e.stopPropagation(); // Ngăn sự kiện click nổi bọt lên card container
    onChangeStatus(word.id, status);
  };

  const cardBg = STATUS_CONFIG[word.status].bgColor;

  return (
    <div
      className={`w-full p-4 rounded-xl border border-gray-200 shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ${cardBg} animate-slide-up cursor-pointer`}
      onClick={() => onCardClick(word.id)}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-bold text-gray-800">{word.term}</h2>
        <Listening word={word.term} />
      </div>

      <div
        className={`transition-all duration-300 ease-in-out ${
          !hideDefinition || isRevealed
            ? "opacity-100 max-h-40"
            : "opacity-0 max-h-0 overflow-hidden"
        }`}
      >
        <p className="text-sm text-gray-700 italic leading-snug">
          {/* Ưu tiên definition, nếu không có thì dùng meaning */}
          {word.definition || word.meaning}
        </p>
        {/* Có thể hiển thị thêm phonetic, image_url, example nếu muốn */}
        {word.phonetic && (
          <p className="text-xs text-gray-600 mt-1">/{word.phonetic}/</p>
        )}
        {word.example && (
          <p className="text-xs text-gray-600 italic mt-1">
            VD: &quot;{word.example}&quot;
          </p>
        )}
      </div>

      {hideDefinition && !isRevealed && (
        <p className="text-sm italic text-gray-500 mt-2">‣ Nhấn để xem nghĩa</p>
      )}

      <p className="text-xs text-gray-600 mt-2">
        Lần ôn: {new Date(word.lastReviewed).toLocaleDateString("vi-VN")}
      </p>

      <div className="mt-3 flex flex-wrap gap-2">
        {(Object.keys(STATUS_CONFIG) as StatusType[]).map((status) =>
          word.status !== status ? (
            <button
              key={status}
              onClick={(e) => handleStatusChange(e, status)}
              className={`px-3 py-1 text-xs font-semibold text-white rounded-full transition-transform duration-200 hover:scale-105 ${STATUS_CONFIG[status].buttonColor}`}
            >
              {STATUS_CONFIG[status].changeLabel}
            </button>
          ) : null
        )}
      </div>
    </div>
  );
};

// Sử dụng React.memo để ngăn component render lại nếu props không thay đổi
const WordCard = memo(WordCardComponent);

// =================================================================
// 3. MAIN COMPONENT (Component chính)
// =================================================================

const WordBook = () => {
  // --- Data Fetching with useVocabulary hook ---
  const { words: fetchedWords, loading, error } = useVocabulary(); // Đổi tên 'words' thành 'fetchedWords' để tránh xung đột

  // --- State Management ---
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [filter, setFilter] = useState<StatusType>("new");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortType>("date");
  const [hideDefinition, setHideDefinition] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());

  // Cập nhật state allWords khi fetchedWords từ hook thay đổi
  useEffect(() => {
    // Đảm bảo kiểu dữ liệu khớp, vì Word từ hook useVocabulary có nhiều trường hơn Word hiện tại
    // Cần ánh xạ nếu Word trong file này không khớp hoàn toàn
    setAllWords(fetchedWords as Word[]);
  }, [fetchedWords]);

  // --- Performance Optimization with useMemo ---
  const wordsByStatus = useMemo(() => {
    return allWords.reduce(
      (acc, word) => {
        acc[word.status]++;
        return acc;
      },
      { new: 0, known: 0, hard: 0 } as Record<StatusType, number>
    );
  }, [allWords]);

  const sortedWords = useMemo(() => {
    const filtered = allWords.filter((w) => w.status === filter);
    return [...filtered].sort((a, b) =>
      sort === "alpha"
        ? a.term.localeCompare(b.term)
        : new Date(b.lastReviewed).getTime() -
          new Date(a.lastReviewed).getTime()
    );
  }, [allWords, filter, sort]);

  // --- Derived State ---
  const paginatedWords = sortedWords.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );
  const totalPages = Math.ceil(sortedWords.length / PAGE_SIZE);

  // --- Event Handlers with useCallback ---
  const handleFilterChange = useCallback((newFilter: StatusType) => {
    setFilter(newFilter);
    setPage(1);
    setRevealedIds(new Set());
  }, []);

  const changeStatus = useCallback(
    async (id: string, newStatus: StatusType) => {
      const newTimestamp = new Date().toISOString();
      setAllWords((prev) =>
        prev.map((word) =>
          word.id === id
            ? { ...word, status: newStatus, lastReviewed: newTimestamp }
            : word
        )
      );
      // Gọi hàm updateVocabStatus từ IndexedDB hoặc API nếu cần đồng bộ lên server
      // Hiện tại, updateVocabStatus chỉ tương tác với IndexedDB, điều này ổn.
      await updateVocabStatus(id, newStatus, newTimestamp);
    },
    []
  );

  const handleClearHistory = useCallback(async () => {
    if (
      window.confirm(
        "Bạn có chắc chắn muốn xoá TOÀN BỘ từ vựng đã lưu không? Thao tác này không thể hoàn tác."
      )
    ) {
      await clearVocabHistory();
      setAllWords([]); // Xóa tất cả từ trong state
    }
  }, []);

  const handleCardClick = useCallback(
    (id: string) => {
      if (hideDefinition) {
        setRevealedIds((prev) => {
          const newSet = new Set(prev);
          if (newSet.has(id)) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          return newSet;
        });
      }
    },
    [hideDefinition]
  );

  const handleHideDefinitionToggle = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setHideDefinition(e.target.checked);
      if (e.target.checked) {
        setRevealedIds(new Set());
      }
    },
    []
  );

  // --- Render JSX ---
  if (loading) {
    return <LoadingWordBook />;
  }

  if (error) {
    return (
      <div className="w-full min-h-[450px] flex items-center justify-center bg-[#fdf6e3]">
        <div className="text-center text-red-600">
          <p className="text-xl font-semibold mb-2">Đã xảy ra lỗi!</p>
          <p className="text-lg">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            Vui lòng thử tải lại trang hoặc kiểm tra kết nối mạng của bạn.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-full px-4 py-4 bg-[#fdf6e3] text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="sticky top-0 z-10 bg-[#fdf6e3]/90 backdrop-blur-md rounded-b-xl p-4 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold">📘 Sổ từ</h1>
              <div className="px-2.5 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-semibold shadow-lg">
                {allWords.length} từ
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/wordbook/quiz"
                className="px-4 py-2 text-white font-semibold rounded-full bg-gradient-to-r from-orange-500 to-pink-500 hover:scale-105 transition-transform duration-300 shadow-md"
              >
                🧠 Ôn tập
              </Link>
              <button
                onClick={handleClearHistory}
                className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors shadow-md"
                title="Xoá tất cả từ đã lưu"
              >
                🗑️
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 md:justify-start justify-between items-center">
            <div className="flex gap-2">
              {(Object.keys(STATUS_CONFIG) as StatusType[]).map((status) => (
                <button
                  key={status}
                  onClick={() => handleFilterChange(status)}
                  className={`px-4 py-1.5 rounded-full font-semibold transition-all duration-300 border-2 text-sm ${
                    filter === status
                      ? `${STATUS_CONFIG[status].activeColor} shadow-md scale-105`
                      : "bg-white/70 text-gray-600 hover:bg-gray-100 border-transparent"
                  }`}
                >
                  {STATUS_CONFIG[status].label} ({wordsByStatus[status]})
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4 ml-auto">
              <button
                onClick={() =>
                  setSort((prev) => (prev === "date" ? "alpha" : "date"))
                }
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition"
                title="Thay đổi sắp xếp"
              >
                <span className="text-sm font-medium">
                  {sort === "date" ? "Mới nhất" : "A-Z"}
                </span>
              </button>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hideDefinition}
                  onChange={handleHideDefinitionToggle}
                  className="accent-pink-500 w-4 h-4"
                />
                <span className="text-sm font-semibold">Ẩn nghĩa</span>
              </label>
            </div>
          </div>
        </header>

        <main>
          {sortedWords.length === 0 ? (
            <div className="w-full py-16 text-center">
              <div className="text-7xl mb-4 animate-[bookFloat_3s_ease-in-out_infinite]">
                📖
              </div>
              <div className="flex flex-col items-center justify-center  text-gray-600 space-y-4">
                <p className="text-lg font-medium">Bạn chưa học từ vựng nào!</p>
                <Link
                  href="/learn/unit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg shadow hover:bg-purple-700 transition"
                >
                  🚀 Bắt đầu học ngay
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
                {paginatedWords.map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    isRevealed={revealedIds.has(word.id)}
                    hideDefinition={hideDefinition}
                    onCardClick={handleCardClick}
                    onChangeStatus={changeStatus}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <Pagination
                  totalPages={totalPages}
                  page={page}
                  setPage={setPage}
                />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default WordBook;
