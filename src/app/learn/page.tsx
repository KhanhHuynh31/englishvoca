"use client";
import React, { useRef, useState } from "react";

interface VocabularyItem {
  word: string;
  meaning: string;
  example: string;
  phonetic: string;
  imageUrl: string;
  audioUrl: string;
  synonyms: string[];
  otherMeanings: string[];
  definition: string;
  partOfSpeech: string;
}

type StatusType = "known" | "new" | "hard" | null;

const statusLabels = {
  known: "✅ Đã biết",
  new: "✨ Từ mới",
  hard: "💡 Từ khó",
};

const statusClasses = {
  known: "bg-green-100 text-green-800 border border-green-500",
  new: "bg-yellow-100 text-yellow-800 border border-yellow-500",
  hard: "bg-red-100 text-red-800 border border-red-500",
};

const statusContainerColor = {
  known: "bg-green-100 text-green-700 border-green-400",
  new: "bg-yellow-100 text-yellow-700 border-yellow-400",
  hard: "bg-red-100 text-red-700 border-red-400",
};

export default function FlashcardPage() {
  const mockVocabularyData: VocabularyItem[] = [
    {
      word: "happy",
      phonetic: "/ˈhæpi/",
      partOfSpeech: "adjective",
      meaning: "vui vẻ, hạnh phúc",
      example: "She felt happy after passing the exam.",
      definition: "Feeling or showing pleasure or contentment.",
      otherMeanings: ["A happy coincidence", "Happy to help"],
      imageUrl:
        "https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_960_720.jpg",
      audioUrl:
        "https://www.oxfordlearnersdictionaries.com/media/english/us_pron/h/hap/happy/happy__us_1.mp3",
      synonyms: ["cheerful", "joyful", "content", "pleased"],
    },
    {
      word: "happy 2",
      phonetic: "/ˈhæpi/",
      partOfSpeech: "adjective",
      meaning: "vui vẻ, hạnh phúc",
      example: "She felt happy after passing the exam.",
      definition: "Feeling or showing pleasure or contentment.",
      otherMeanings: ["A happy coincidence", "Happy to help"],
      imageUrl:
        "https://cdn.pixabay.com/photo/2017/11/09/21/41/cat-2934720_960_720.jpg",
      audioUrl:
        "https://www.oxfordlearnersdictionaries.com/media/english/us_pron/h/hap/happy/happy__us_1.mp3",
      synonyms: ["cheerful", "joyful", "content", "pleased"],
    },
  ];

  const [index, setIndex] = useState(0);
  const [statuses, setStatuses] = useState<StatusType[]>(
    mockVocabularyData.map(() => null)
  );
  const [isFlipped, setIsFlipped] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const current = mockVocabularyData[index];
  const progress = ((index + 1) / mockVocabularyData.length) * 100;
  const [isCompleted, setIsCompleted] = useState(false);

  const changeCard = (dir: "left" | "right") => {
    setIndex((prev) =>
      dir === "right"
        ? (prev + 1) % mockVocabularyData.length
        : (prev - 1 + mockVocabularyData.length) % mockVocabularyData.length
    );
    setIsFlipped(false);
  };

  const setCardStatus = (newStatus: Exclude<StatusType, null>) => {
    const updated = [...statuses];
    updated[index] = newStatus;
    setStatuses(updated);

    setTimeout(() => {
      if (index + 1 >= mockVocabularyData.length) {
        setIsCompleted(true); // hoàn thành
      } else {
        setIndex((prev) => prev + 1);
        setIsFlipped(false);
      }
    }, 700);
  };
  if (isCompleted) {
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
              setStatuses(mockVocabularyData.map(() => null));
              setIsCompleted(false);
            }}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            🔁 Học lại
          </button>
          <button
            onClick={() => {
              // Bạn có thể thay đổi URL hoặc điều hướng đến sổ từ
              alert("Chức năng xem sổ từ sẽ được phát triển sau");
            }}
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
          >
            📚 Xem sổ từ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center w-full p-4">
      {/* Thanh tiến độ */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4 overflow-hidden">
        <div
          className="bg-blue-500 h-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div
        className={`w-full rounded-xl shadow-lg border ${
          statuses[index]
            ? statusContainerColor[statuses[index]!]
            : "border-gray-200"
        }`}
      >
        <div className="relative md:flex gap-4 w-full h-full [perspective:1000px]">
          {/* Mặt trước */}
          <div
            className={`relative w-full md:flex-1 h-[500px] md:h-auto transition-transform duration-500 [transform-style:preserve-3d] md:transform-none ${
              isFlipped ? "[transform:rotateY(180deg)]" : ""
            }`}
          >
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="absolute md:static w-full h-full md:h-auto backface-hidden p-5 rounded-xl"
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={current.imageUrl}
                  alt={current.word}
                  className="w-full max-w-xs h-52 object-cover rounded-lg mb-4"
                />
                <h2 className="text-3xl font-bold text-blue-700">
                  {current.word}
                </h2>
                <p className="text-sm text-gray-500 mt-1 italic">
                  ({current.partOfSpeech})
                </p>
                <div className="text-gray-500 mt-1 flex items-center justify-center gap-2">
                  <span>{current.phonetic}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      audioRef.current?.play();
                    }}
                    className="p-1 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700 transition"
                  >
                    🔊
                  </button>
                  <audio ref={audioRef} src={current.audioUrl} />
                </div>
                <p className="mt-4 text-lg text-gray-800">
                  <strong>Ý nghĩa:</strong> {current.meaning}
                </p>
                <div className="flex gap-2 mt-4 flex-wrap justify-center">
                  {Object.entries(statusLabels).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCardStatus(key as keyof typeof statusLabels);
                      }}
                      className={`text-sm px-4 py-2 rounded-lg font-medium ${
                        statuses[index] === key
                          ? statusClasses[key as keyof typeof statusClasses]
                          : "bg-gray-100 text-gray-600 hover:bg-opacity-80"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                  <p className="text-sm text-gray-400 mt-2 block md:hidden italic">
                    👆 Nhấn vào thẻ để xem thêm thông tin
                  </p>
                </div>
              </div>
            </div>

            {/* Mặt sau (mobile) */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="absolute md:hidden w-full h-full [transform:rotateY(180deg)] backface-hidden p-5 rounded-xl overflow-y-auto"
            >
              <h3 className="text-lg font-semibold text-blue-700 mb-2">
                📘 Định nghĩa
              </h3>
              <p>{current.definition}</p>
              <p className="italic text-sm text-gray-600 mt-1">
                <strong>Ví dụ:</strong> &quot;{current.example}&quot;
              </p>
              <h3 className="text-lg font-semibold text-blue-700 mt-4 mb-1">
                📚 Nghĩa khác
              </h3>
              <ul className="list-disc list-inside">
                {current.otherMeanings.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
              <h3 className="text-lg font-semibold text-blue-700 mt-4 mb-1">
                🔁 Từ đồng nghĩa
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                {current.synonyms.map((syn, i) => (
                  <span
                    key={i}
                    className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mặt phải (PC) */}
          <div className="hidden md:block flex-1 text-gray-800 p-5">
            <h3 className="text-lg font-semibold text-blue-700 mb-2">
              📘 Định nghĩa
            </h3>
            <p>{current.definition}</p>
            <p className="italic text-sm text-gray-600 mt-1">
              <strong>Ví dụ:</strong> &quot;{current.example}&quot;
            </p>
            <h3 className="text-lg font-semibold text-blue-700 mt-4 mb-1">
              📚 Nghĩa khác
            </h3>
            <ul className="list-disc list-inside">
              {current.otherMeanings.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold text-blue-700 mt-4 mb-1">
              🔁 Từ đồng nghĩa
            </h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {current.synonyms.map((syn, i) => (
                <span
                  key={i}
                  className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {syn}
                </span>
              ))}
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
          {index + 1}/{mockVocabularyData.length}
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
