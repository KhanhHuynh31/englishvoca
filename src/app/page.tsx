"use client";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white px-6 md:px-12 py-12">
      {/* HERO SECTION */}
      <section className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-purple-700">
          Chào mừng bạn đến với <span className="text-pink-500">EnglishUp!</span>
        </h1>
        <p className="mt-4 text-lg text-gray-700">
          Học từ mới dễ nhớ – luyện quiz thú vị – quản lý từ vựng thông minh.
        </p>
        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            href="/vocab"
            className="bg-purple-600 text-white px-6 py-3 rounded-full text-base font-semibold hover:bg-purple-700 transition"
          >
            Bắt đầu học ngay
          </Link>
          <Link
            href="/quiz"
            className="bg-white text-purple-700 border border-purple-300 px-6 py-3 rounded-full font-semibold hover:bg-purple-50 transition"
          >
            Luyện Quiz
          </Link>
        </div>
      </section>

      {/* FUNCTION FEATURES */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Feature 1: Học từ mới */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-purple-400 hover:shadow-xl transition">
          <div className="text-purple-600 text-3xl mb-3">📘</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Học từ mới</h3>
          <p className="text-gray-600 text-sm">
            Từ vựng theo chủ đề, có hình ảnh, phát âm và trạng thái học. Dễ nhớ, dễ học.
          </p>
          <Link
            href="/vocab"
            className="inline-block mt-4 text-sm font-medium text-purple-600 hover:underline"
          >
            Vào học →
          </Link>
        </div>

        {/* Feature 2: Luyện quiz */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-pink-400 hover:shadow-xl transition">
          <div className="text-pink-500 text-3xl mb-3">🧠</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Luyện quiz</h3>
          <p className="text-gray-600 text-sm">
            Kiểm tra kiến thức qua bài quiz trắc nghiệm, phân tích kết quả để ghi nhớ lâu hơn.
          </p>
          <Link
            href="/quiz"
            className="inline-block mt-4 text-sm font-medium text-pink-500 hover:underline"
          >
            Luyện quiz →
          </Link>
        </div>

        {/* Feature 3: Sổ từ cá nhân */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-green-400 hover:shadow-xl transition">
          <div className="text-green-600 text-3xl mb-3">📒</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Sổ từ cá nhân</h3>
          <p className="text-gray-600 text-sm">
            Quản lý từ đã học, từ chưa thuộc, ôn lại từ khó và theo dõi tiến trình học tập.
          </p>
          <Link
            href="/wordbook"
            className="inline-block mt-4 text-sm font-medium text-green-600 hover:underline"
          >
            Xem sổ từ →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mt-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800">Sẵn sàng bắt đầu hành trình học tiếng Anh?</h2>
        <Link
          href="/vocab"
          className="mt-4 inline-block bg-purple-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-purple-700 transition"
        >
          Bắt đầu ngay
        </Link>
      </section>
    </div>
  );
}
