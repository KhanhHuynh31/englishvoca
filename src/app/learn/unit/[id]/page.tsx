"use client";
import Listening from "@/components/Listening/Listening";
import Loading from "@/components/Loading/Loading";
import { saveVocabHistory } from "@/lib/vocabularyDB";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

interface VocabularyItem {
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

const statusMap: Record<StatusType, { label: string; className: string }> = {
  known: {
    label: "✅ Đã biết",
    className: "bg-green-100 text-green-800 border border-green-500",
  },
  new: {
    label: "✨ Từ mới",
    className: "bg-yellow-100 text-yellow-800 border border-yellow-500",
  },
  hard: {
    label: "💡 Từ khó",
    className: "bg-red-100 text-red-800 border border-red-500",
  },
};

export default function FlashcardPage() {
  const [index, setIndex] = useState(0);
  const [vocabData, setVocabData] = useState<VocabularyItem[]>([]);
  const [statuses, setStatuses] = useState<(StatusType | null)[]>([]);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const params = useParams();
  const id = params.id;
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/vocabulary?unit_id=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Lỗi tải dữ liệu");

        setVocabData(data);
        setStatuses(data.map(() => null));
        setIndex(0);
        setIsCompleted(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Lỗi không xác định");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  useEffect(() => {
    if (index >= vocabData.length && vocabData.length > 0) setIndex(0);
  }, [vocabData, index]);

  const current = vocabData[index];
  const progress = vocabData.length
    ? ((index + 1) / vocabData.length) * 100
    : 0;

  const changeCard = (dir: "left" | "right") => {
    setIndex((prev) =>
      dir === "right"
        ? (prev + 1) % vocabData.length
        : (prev - 1 + vocabData.length) % vocabData.length
    );
    setIsFlipped(false);
  };

  const setCardStatus = async  (newStatus: Exclude<StatusType, null>) => {
    const updated = [...statuses];
    updated[index] = newStatus;
    setStatuses(updated);
    const currentWord = vocabData[index];
    const today = new Date().toISOString().split("T")[0]; // yyyy-mm-dd

    await saveVocabHistory({
      id: `${id}-${currentWord.word}`, // unique theo unit + từ
      word: currentWord.word,
      meaning: currentWord.meaning,
      image_url: currentWord.image_url,
      phonetic: currentWord.phonetic,
      status: newStatus,
      date: today,
    });
    setTimeout(() => {
      if (index + 1 >= vocabData.length) setIsCompleted(true);
      else {
        setIndex((prev) => prev + 1);
        setIsFlipped(false);
      }
    }, 700);
  };

  if (loading) return <Loading />;
  if (error)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg text-red-500">{error}</span>
      </div>
    );
  if (!vocabData.length)
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="text-lg text-gray-500">Không có dữ liệu từ vựng.</span>
      </div>
    );
  if (isCompleted)
    return (
      <div className="flex flex-col items-center justify-center h-screen px-4 text-center">
        <h2 className="text-3xl font-bold text-green-600 mb-4">
          🎉 Bạn đã học xong tất cả các từ!
        </h2>
        <p className="text-gray-600 mb-6">
          Chúc mừng! Hãy tiếp tục luyện tập mỗi ngày để ghi nhớ lâu hơn.
        </p>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setIndex(0);
              setStatuses(vocabData.map(() => null));
              setIsCompleted(false);
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            🔁 Học lại
          </button>
          <button
            onClick={() => alert("Chức năng xem sổ từ sẽ được phát triển sau")}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            📚 Xem sổ từ
          </button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* Thanh tiến độ */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      {/*thẻ */}
      <div className={`w-full max-w-md mx-auto rounded-xl  `}>
        <div className="relative w-full h-[500px] [perspective:1000px]">
          {/* Container lật */}
          <div
            className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            {/* Mặt trước */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`absolute w-full h-full backface-hidden p-6 rounded-xl flex flex-col items-center justify-center text-center  ${
                statuses[index]
                  ? statusMap[statuses[index]!].className
                  : "bg-white border border-gray-200"
              }`}
            >
              <Image
                width={200}
                height={200}
                src={current.image_url}
                alt={current.word}
                className="w-48 h-48 object-cover rounded-lg mb-4"
              />
              <h2 className="text-3xl font-bold text-blue-700">
                {current.word}
              </h2>
              <p className="text-sm text-gray-500 italic mt-1">
                ({current.part_of_speech})
              </p>
              <div className="text-gray-500 mt-1 flex items-center justify-center gap-2">
                <span>{current.phonetic}</span>
                <Listening word={current.word} />
              </div>

              <div className="flex flex-wrap gap-2 mt-4 justify-center">
                {Object.entries(statusMap).map(
                  ([key, { label, className }]) => (
                    <button
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCardStatus(key as StatusType);
                      }}
                      className={`text-sm px-4 py-2 rounded-lg font-medium ${
                        statuses[index] === key
                          ? className
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {label}
                    </button>
                  )
                )}
              </div>
              <p className="text-sm text-gray-400 mt-3 italic">
                👆 Nhấn vào thẻ để xem thêm thông tin
              </p>
            </div>

            {/* Mặt sau */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className={`absolute w-full h-full [transform:rotateY(180deg)] backface-hidden p-6 rounded-xl overflow-y-auto ${
                statuses[index]
                  ? statusMap[statuses[index]!].className
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                📘 Định nghĩa
              </h3>
              <p>{current.definition}</p>
              <p className="italic text-sm text-gray-600 mt-1">
                <strong>Dịch nghĩa:</strong> {current.meaning}
              </p>
              <p className="italic text-sm text-gray-600 mt-1">
                <strong>Ví dụ:</strong> &quot;{current.example}&quot;
              </p>

              {(current.otherMeanings?.length ?? 0) > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-blue-700 mt-4 mb-1">
                    📚 Nghĩa khác
                  </h3>
                  <ul className="list-disc list-inside text-gray-800">
                    {current.otherMeanings!.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ul>
                </>
              )}

              {(current.synonyms?.length ?? 0) > 0 && (
                <>
                  <h3 className="text-lg font-semibold text-blue-700 mt-4 mb-1">
                    🔁 Từ đồng nghĩa
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {current.synonyms?.map((syn, i) => (
                      <span
                        key={i}
                        className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Điều hướng thẻ */}
      <div className="flex items-center justify-center w-full pt-2 gap-4">
        <button
          onClick={() => changeCard("left")}
          className="p-3 bg-white rounded-full shadow hover:bg-blue-100"
        >
          ←
        </button>
        <span className="text-sm text-gray-600 font-medium mb-1">
          {index + 1}/{vocabData.length}
        </span>
        <button
          onClick={() => changeCard("right")}
          className="p-3 bg-white rounded-full shadow hover:bg-blue-100"
        >
          →
        </button>
      </div>
    </div>
  );
}
