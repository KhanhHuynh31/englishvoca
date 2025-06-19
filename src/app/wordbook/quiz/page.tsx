"use client";
import { useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Listening from "@/components/Listening/Listening";
import { useVocabularyQuiz } from "@/components/hooks/useVocabularyQuiz";

// Types for better type safety
interface QuizState {
  index: number;
  score: number;
  selected: string | null;
  finished: boolean;
  showHint: boolean;
  showOnlyWrong: boolean;
  isProcessing: boolean;
  error: string | null;
}

const INITIAL_QUIZ_STATE: QuizState = {
  index: 0,
  score: 0,
  selected: null,
  finished: false,
  showHint: false,
  showOnlyWrong: false,
  isProcessing: false,
  error: null,
};

const ANSWER_DELAY = 1000;
const MIN_QUESTIONS_REQUIRED = 4;

export default function VocabularyQuiz() {
  const [quizState, setQuizState] = useState<QuizState>(INITIAL_QUIZ_STATE);

  const {
    questions,
    setQuestions,
    updateWrongAnswers,
    getWrongQuestionObjects,
  } = useVocabularyQuiz();

  const currentQuestion = useMemo(
    () => questions[quizState.index],
    [questions, quizState.index]
  );
  const wrongQuestions = useMemo(
    () => getWrongQuestionObjects(),
    [getWrongQuestionObjects]
  );
  const hasWrongQuestions = wrongQuestions.length > 1;

  // Async function to handle answer processing
  const processAnswer = useCallback(
    async (answer: string): Promise<void> => {
      if (!currentQuestion) {
        console.error("No current question available");
        return;
      }

      try {
        const isCorrect = answer === currentQuestion.correct;

        // Update wrong answers tracking
        updateWrongAnswers(currentQuestion.word, isCorrect);

        // Update quiz state
        setQuizState((prev) => ({
          ...prev,
          score: prev.score + (isCorrect ? 1 : 0),
          selected: answer,
          isProcessing: true,
          error: null,
        }));

        // Wait for visual feedback before proceeding
        await new Promise((resolve) => setTimeout(resolve, ANSWER_DELAY));

        // Move to next question or finish quiz
        setQuizState((prev) => {
          const isLastQuestion = prev.index + 1 >= questions.length;

          return {
            ...prev,
            index: isLastQuestion ? prev.index : prev.index + 1,
            selected: null,
            showHint: false,
            finished: isLastQuestion,
            isProcessing: false,
          };
        });
      } catch (error) {
        console.error("Error processing answer:", error);
        setQuizState((prev) => ({
          ...prev,
          error: "Có lỗi xảy ra khi xử lý câu trả lời. Vui lòng thử lại.",
          isProcessing: false,
        }));
      }
    },
    [currentQuestion, questions.length, updateWrongAnswers]
  );

  // Handle answer selection
  const handleAnswerSelect = useCallback(
    async (answer: string): Promise<void> => {
      if (quizState.selected || quizState.isProcessing) return;

      await processAnswer(answer);
    },
    [quizState.selected, quizState.isProcessing, processAnswer]
  );

  // Handle "I don't know" button
  const handleDontKnow = useCallback(async (): Promise<void> => {
    if (quizState.selected || quizState.isProcessing) return;

    await processAnswer("Không biết");
  }, [quizState.selected, quizState.isProcessing, processAnswer]);

  // Reset quiz to initial state
  const resetQuiz = useCallback((): void => {
    setQuizState(INITIAL_QUIZ_STATE);
  }, []);

  // Start wrong questions quiz
  const startWrongQuestionsQuiz = useCallback((): void => {
    try {
      if (wrongQuestions.length === 0) {
        console.warn("No wrong questions available");
        return;
      }

      setQuestions(wrongQuestions);
      setQuizState({
        ...INITIAL_QUIZ_STATE,
        showOnlyWrong: true,
      });
    } catch (error) {
      console.error("Error starting wrong questions quiz:", error);
      setQuizState((prev) => ({
        ...prev,
        error: "Không thể bắt đầu luyện tập câu sai. Vui lòng thử lại.",
      }));
    }
  }, [wrongQuestions, setQuestions]);

  // Toggle hint visibility
  const toggleHint = useCallback((): void => {
    setQuizState((prev) => ({
      ...prev,
      showHint: !prev.showHint,
    }));
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setQuizState((prev) => ({
      ...prev,
      error: null,
    }));
  }, []);

  // Render insufficient questions message
  if (questions.length < MIN_QUESTIONS_REQUIRED && !quizState.showOnlyWrong) {
    return (
      <div className="p-6 text-center text-lg text-gray-600">
        ⚠️ Bạn cần học thêm ít nhất {MIN_QUESTIONS_REQUIRED} từ để bắt đầu luyện
        tập.
        <br />
        <Link
          href="/unit"
          className="text-blue-600 underline mt-2 inline-block"
        >
          📘 Học từ vựng ngay
        </Link>
      </div>
    );
  }

  // Render completion screen
  if (quizState.finished) {
    return (
      <div className="text-center space-y-4 p-6">
        {quizState.showOnlyWrong && (
          <p className="text-sm text-yellow-600">
            🔁 Bạn đã hoàn thành luyện lại các câu đã trả lời sai
          </p>
        )}

        <h2 className="text-3xl font-bold text-green-600">🎉 Hoàn thành!</h2>

        <p>
          Bạn trả lời đúng <strong>{quizState.score}</strong>/{questions.length}{" "}
          câu.
        </p>

        {quizState.error && (
          <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
            {quizState.error}
            <button
              onClick={clearError}
              className="ml-2 text-sm underline hover:no-underline"
            >
              Đóng
            </button>
          </div>
        )}

        <div className="flex justify-center gap-4 flex-wrap">
          <button
            onClick={resetQuiz}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            🔁 Làm lại
          </button>

          {hasWrongQuestions && (
            <button
              onClick={startWrongQuestionsQuiz}
              className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors"
            >
              🔁 Làm lại câu sai
            </button>
          )}

          <Link href="/unit">
            <span className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer transition-colors inline-block">
              📚 Học thêm từ mới
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Render quiz interface
  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col gap-6">
      {/* Progress bar */}
      <div>
        <div className="text-sm text-gray-600 mb-1 flex justify-between">
          <span>Tiến độ</span>
          <span>
            Câu {quizState.index + 1} / {questions.length}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{
              width: `${((quizState.index + 1) / questions.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Error display */}
      {quizState.error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700">
          {quizState.error}
          <button
            onClick={clearError}
            className="ml-2 text-sm underline hover:no-underline"
          >
            Đóng
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        {/* Question section */}
        <div className="flex-1 space-y-4">
          <div className="text-3xl font-bold text-blue-700 text-center">
            <div className="flex items-center justify-center gap-2">
              {currentQuestion?.word}
            </div>
            <span className="text-xl text-gray-500">
              {currentQuestion?.phonetic}
            </span>
            {currentQuestion && <Listening word={currentQuestion.word} />}
          </div>

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-4">
            {currentQuestion?.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerSelect(option)}
                disabled={!!quizState.selected || quizState.isProcessing}
                className={`p-4 rounded-xl font-semibold transition-all duration-200
                  ${
                    quizState.selected
                      ? option === currentQuestion.correct
                        ? "bg-green-100 border border-green-500 text-green-700"
                        : option === quizState.selected
                        ? "bg-red-100 border border-red-500 text-red-700"
                        : "bg-white border border-gray-300"
                      : quizState.isProcessing
                      ? "bg-gray-100 border border-gray-300 cursor-not-allowed"
                      : "hover:bg-blue-100 border border-gray-300 cursor-pointer"
                  }`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Controls */}
          <div className="flex justify-between items-center pt-2">
            <label className="text-sm flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={quizState.showHint}
                onChange={toggleHint}
                disabled={quizState.isProcessing}
              />
              💡 Hiện hình minh hoạ
            </label>

            <button
              onClick={handleDontKnow}
              disabled={!!quizState.selected || quizState.isProcessing}
              className="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ❓ Không biết
            </button>
          </div>
        </div>

        {/* Hint section */}
        <div className="flex-1 flex items-center justify-center min-h-[250px]">
          {quizState.showHint && currentQuestion ? (
            <Image
              src={`https://placehold.co/300x300.png?text=${currentQuestion.word}`}
              width={300}
              height={300}
              alt={currentQuestion.word}
              className="rounded shadow-lg"
              onError={() => {
                console.error(
                  "Failed to load hint image for:",
                  currentQuestion.word
                );
                // You could set a fallback image here
              }}
            />
          ) : (
            <div className="text-gray-400 italic text-center px-4">
              Chọn &quot;Hiện hình minh hoạ&quot; để xem hình gợi ý
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
