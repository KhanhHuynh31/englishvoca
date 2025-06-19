"use client";

import Listening from "@/components/Listening/Listening";
import Pagination from "@/components/Pagination/Pagination";
import { useEffect, useState } from "react";
import { clearVocabHistory, updateVocabStatus } from "@/lib/vocabularyDB";
import { useGetIndexDB, Word } from "@/components/hooks/useGetIndexDB";
import Link from "next/link";

type StatusType = "known" | "new" | "hard";

const bgColorMap: Record<StatusType, string> = {
  new: "bg-yellow-100",
  known: "bg-green-100",
  hard: "bg-red-100",
};

const WordBook = () => {
  const [allWords, setAllWords] = useState<Word[]>([]);
  const [filter, setFilter] = useState<StatusType>("new");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<"date" | "alpha">("date");
  const [hideDefinition, setHideDefinition] = useState(false);
  const [revealedIds, setRevealedIds] = useState<string[]>([]);

  // Call the hook at the top level
  const vocabData = useGetIndexDB();

  useEffect(() => {
    setAllWords(vocabData);
  }, [vocabData]);

  const filteredWords = allWords.filter((w) => w.status === filter);
  const sortedWords = [...filteredWords].sort((a, b) =>
    sort === "alpha"
      ? a.term.localeCompare(b.term)
      : new Date(b.lastReviewed).getTime() - new Date(a.lastReviewed).getTime()
  );

  const pageSize = 10;
  const paginatedWords = sortedWords.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const totalPages = Math.ceil(sortedWords.length / pageSize);

  const changeStatus = async (id: string, newStatus: StatusType) => {
    setAllWords((prev) =>
      prev.map((word) =>
        word.id === id
          ? {
              ...word,
              status: newStatus,
              lastReviewed: new Date().toISOString(),
            }
          : word
      )
    );

    await updateVocabStatus(id, newStatus, new Date().toISOString());
  };

  return (
    <div className="w-full min-h-screen px-4 py-8 bg-[#fdf6e3] text-gray-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="sticky top-0 z-10 bg-[#fdf6e3]/90 backdrop-blur-md rounded-b-xl p-4 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold">📘 Sổ từ</h1>
              <div className="px-2 py-0.5 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 text-white text-xs font-medium shadow-md animate-[popUp_0.6s_ease-out]">
                {allWords.length} từ
              </div>
            </div>
            <Link
              href={"/wordbook/quiz"}
              className="px-4 py-1.5 text-white font-semibold rounded-full bg-gradient-to-r from-orange-400 to-pink-400 hover:scale-105 transition-transform duration-300"
            >
              🧠 Ôn tập
            </Link>
          </div>
          <button
            onClick={async () => {
              await clearVocabHistory();
              alert("Đã xoá toàn bộ từ vựng khỏi máy.");
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            🗑️ Xoá tất cả từ đã lưu
          </button>
          {/* Bộ lọc và tuỳ chọn */}
          <div className="mt-4 flex flex-wrap gap-2 md:justify-start justify-between items-center">
            {/* Mobile dropdown */}
            <select
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value as StatusType);
                setPage(1);
              }}
              className="px-2 py-2 rounded-xl border font-semibold md:hidden"
            >
              <option value="new">Từ mới</option>
              <option value="known">Từ đã học</option>
              <option value="hard">Từ khó</option>
            </select>

            {/* Desktop buttons */}
            <div className="hidden md:flex gap-2">
              {(["new", "known", "hard"] as StatusType[]).map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setFilter(status);
                    setPage(1);
                  }}
                  className={`px-3 py-1 rounded-full font-semibold transition-all duration-300 border ${
                    filter === status
                      ? `${bgColorMap[status]} text-black border-black shadow-md scale-105`
                      : "bg-white text-black hover:bg-gray-100"
                  }`}
                >
                  {
                    {
                      new: "Từ mới",
                      known: "Từ đã học",
                      hard: "Từ khó",
                    }[status]
                  }{" "}
                  ({allWords.filter((w) => w.status === status).length})
                </button>
              ))}
            </div>

            {/* Tuỳ chọn sort + ẩn nghĩa */}
            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() =>
                  setSort((prev) => (prev === "date" ? "alpha" : "date"))
                }
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-200"
                title="Thay đổi sắp xếp"
              >
                <span className="text-sm font-medium">
                  {sort === "date" ? "Mới nhất" : "A-Z"}
                </span>
              </button>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={hideDefinition}
                  onChange={(e) => {
                    setHideDefinition(e.target.checked);
                    setRevealedIds([]);
                  }}
                  className="accent-pink-500"
                />
                <span className="text-sm">Ẩn nghĩa</span>
              </label>
            </div>
          </div>
        </div>
        {paginatedWords.length === 0 ? (
          <div className="w-full py-16 text-center">
            <div className="text-6xl mb-4 animate-[bookFloat_3s_ease-in-out_infinite]">
              📖
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Chưa có từ nào ở mục này
            </h2>
            <p className="text-gray-600 mb-4">
              Bắt đầu học ngay để bổ sung thêm từ vào sổ của bạn!
            </p>
            <button
              onClick={() => alert("Chuyển đến học từ mới")}
              className="px-6 py-2 text-white font-semibold rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 hover:scale-105 transition-transform duration-300"
            >
              🚀 Bắt đầu học
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedWords.map((word) => {
              const isRevealed = revealedIds.includes(word.id);
              return (
                <div
                  key={word.id}
                  className={`w-full p-3 rounded-xl border border-gray-200 shadow hover:shadow-lg transition-all duration-300 ${
                    bgColorMap[word.status]
                  } animate-slide-up`}
                  onClick={() => {
                    if (hideDefinition && !isRevealed) {
                      setRevealedIds([...revealedIds, word.id]);
                    }
                  }}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-semibold">{word.term}</h2>
                    <Listening word={word.term} />
                  </div>

                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      !hideDefinition || isRevealed
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-95 h-0 overflow-hidden"
                    }`}
                  >
                    <p className="text-sm text-gray-700 italic leading-snug">
                      {word.definition}
                    </p>
                  </div>

                  {hideDefinition && !isRevealed && (
                    <p className="text-sm italic text-gray-400 cursor-pointer">
                      ‣ Nhấn để hiện nghĩa
                    </p>
                  )}

                  <p className="text-xs text-gray-600 mt-1">
                    Lần ôn: {new Date(word.lastReviewed).toLocaleDateString()}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {["known", "new", "hard"].map(
                      (status) =>
                        word.status !== status && (
                          <button
                            key={status}
                            onClick={(e) => {
                              e.stopPropagation();
                              changeStatus(word.id, status as StatusType);
                            }}
                            className={`px-3 py-1 text-xs text-white rounded transition ${
                              {
                                known: "bg-green-500 hover:bg-green-600",
                                new: "bg-yellow-500 hover:bg-yellow-600",
                                hard: "bg-red-500 hover:bg-red-600",
                              }[status]
                            }`}
                          >
                            {
                              {
                                known: "Đã thuộc",
                                new: "Chưa thuộc",
                                hard: "Từ khó",
                              }[status]
                            }
                          </button>
                        )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {totalPages > 1 && (
          <Pagination totalPages={totalPages} page={page} setPage={setPage} />
        )}
      </div>
    </div>
  );
};

export default WordBook;
