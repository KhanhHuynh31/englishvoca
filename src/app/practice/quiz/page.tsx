"use client";
import Pagination from "@/components/Pagination/Pagination";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

type Quiz = {
  id: number;
  title: string;
  description: string;
  image: string;
  correct: number;
  total: number;
  topic: string;
};

export default function QuizTopics() {
  const [filterTopic, setFilterTopic] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const quizzesPerPage = 3;

  const allQuizzes: Quiz[] = [
    {
      id: 1,
      title: "Quiz 1: Sentence Overview",
      description: "Kiểm tra kiến thức tổng quan về câu.",
      image: "https://source.unsplash.com/150x150/?english,sentence",
      correct: 12,
      total: 15,
      topic: "Câu",
    },
    {
      id: 2,
      title: "Quiz 2: Verb Tenses",
      description: "Thử thách về các thì trong tiếng Anh.",
      image: "https://source.unsplash.com/150x150/?english,tense",
      correct: 10,
      total: 20,
      topic: "Ngữ pháp",
    },
    {
      id: 3,
      title: "Quiz 3: Modal Verbs",
      description: "Động từ khiếm khuyết và ứng dụng.",
      image: "https://source.unsplash.com/150x150/?english,modal",
      correct: 14,
      total: 15,
      topic: "Ngữ pháp",
    },
    {
      id: 4,
      title: "Quiz 4: Vocabulary Practice",
      description: "Luyện tập từ vựng phổ biến.",
      image: "https://source.unsplash.com/150x150/?english,vocabulary",
      correct: 7,
      total: 10,
      topic: "Từ vựng",
    },
  ];

  const specialQuiz = {
    id: "custom",
    title: "🌟 Quiz Tổng Hợp Từ Đã Học",
    description: "Luyện tập lại những từ vựng bạn đã học gần đây.",
    image: "https://source.unsplash.com/150x150/?vocabulary,brain",
    route: "/practice/quiz/custom",
  };

  const topics = ["Tất cả", "Ngữ pháp", "Từ vựng", "Câu"];
  const filteredQuizzes =
    filterTopic === "Tất cả"
      ? allQuizzes
      : allQuizzes.filter((q) => q.topic === filterTopic);

  const totalPages = Math.ceil(filteredQuizzes.length / quizzesPerPage);
  const paginatedQuizzes = filteredQuizzes.slice(
    (currentPage - 1) * quizzesPerPage,
    currentPage * quizzesPerPage
  );

  const handleFilterChange = (topic: string) => {
    setFilterTopic(topic);
    setCurrentPage(1);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-5">
      {/* Filter */}
      <div className="flex flex-wrap gap-3 justify-center mb-10">
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => handleFilterChange(topic)}
            className={`px-4 py-2 rounded-full font-medium border transition ${
              filterTopic === topic
                ? "bg-purple-600 text-white border-purple-700"
                : "bg-white text-purple-700 border-purple-300 hover:bg-purple-50"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      <div className="flex flex-col  gap-6 ">
        {/* SPECIAL QUIZ */}
        {currentPage === 1 && (
          <Link
            href={specialQuiz.route}
            className="p-5 rounded-2xl bg-gradient-to-br from-yellow-400 to-pink-500 text-white shadow-xl border-4 border-yellow-300 hover:scale-[1.02] transition"
          >
            <div className="flex flex-col items-center text-center">
              <Image
                width={64}
                height={64}
                src={`https://placehold.co/300x300.png?text=${specialQuiz.id}`}
                alt="Special Quiz"
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg mb-4 object-cover"
              />
              <h2 className="text-xl font-extrabold">{specialQuiz.title}</h2>
              <p className="text-sm mt-2">{specialQuiz.description}</p>
              <div className="mt-4 px-4 py-2 bg-white text-yellow-800 font-semibold rounded-full shadow hover:bg-yellow-50 transition">
                Luyện tập ngay
              </div>
            </div>
          </Link>
        )}

        {/* REGULAR QUIZZES */}
        {paginatedQuizzes.map((quiz) => {
          const percent = Math.round((quiz.correct / quiz.total) * 100);
          let barColor = "bg-red-400";
          if (percent >= 80) barColor = "bg-green-500";
          else if (percent >= 60) barColor = "bg-yellow-500";

          return (
            <div
              key={quiz.id}
              className="bg-white min-h-[250] rounded-xl p-5 shadow hover:shadow-lg transition flex flex-col justify-between"
            >
              <div className="flex items-center gap-4">
                <Image
                  width={64}
                  height={64}
                  src={`https://placehold.co/300x300.png?text=${quiz.topic}`}
                  alt={quiz.title}
                  className="w-16 h-16 rounded-md object-cover border border-gray-300"
                />
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {quiz.title}
                  </h3>
                  <p className="text-sm text-gray-600">{quiz.description}</p>
                  <span className="text-xs font-medium mt-1 inline-block text-purple-600">
                    📚 Chủ đề: {quiz.topic}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <div className="w-full bg-gray-200 h-2 rounded-full">
                  <div
                    className={`${barColor} h-2 rounded-full transition-all duration-700`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm text-gray-700 mt-1 inline-block">
                  {quiz.correct}/{quiz.total} câu đúng ({percent}%)
                </span>
              </div>

              <Link
                href={`/quiz/${quiz.id}`}
                className="mt-4 w-full max-w-[300px]  bg-purple-600 text-white py-2 text-center rounded-lg font-medium hover:bg-purple-700 transition"
              >
                Bắt đầu
              </Link>
            </div>
          );
        })}
      </div>
      <Pagination
        totalPages={totalPages}
        page={currentPage}
        setPage={setCurrentPage}
      />
    </div>
  );
}
