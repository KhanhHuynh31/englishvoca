"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpenCheck,
  BrainCircuit,
  NotebookText,
  Target,
  MoveRight,
  Sparkles,
  Zap,
  TrendingUp,
  Star,
  ArrowDown,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
} from "lucide-react";

export default function LandingPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const fadeInUp = (delay = 0) =>
    `transition-all duration-1000 ease-out ${
      isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
    }` +
    `` +
    (delay ? ` transition-delay-[${delay}ms]` : "");

  return (
    <div className="bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 text-slate-800 overflow-hidden">
      {/* Floating Elements Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div
          className="absolute top-96 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <div className="container mx-auto px-6 pt-6 relative">
        {/* ======================= HERO SECTION ======================= */}
        <section className="grid md:grid-cols-2 gap-12 items-center mb-32 min-h-[80vh] relative">
          <div className="text-center md:text-left space-y-8">
            <div style={{ transitionDelay: "200ms" }} className={fadeInUp()}>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6 animate-bounce">
                <Star className="w-4 h-4 text-yellow-500" />
                Miễn phí 100% - Không quảng cáo
              </div>
            </div>

            <h1
              style={{ transitionDelay: "300ms" }}
              className={`${fadeInUp()} text-5xl lg:text-7xl font-black bg-gradient-to-r from-purple-800 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight`}
            >
              Học Từ Vựng
              <br />
              <span className="relative inline-block">
                Siêu Thông Minh
                <div className="absolute -bottom-2 left-0 w-full h-3 bg-gradient-to-r from-purple-400/40 to-pink-400/40 blur-sm"></div>
              </span>
            </h1>

            <p
              style={{ transitionDelay: "400ms" }}
              className={`${fadeInUp()} text-xl text-slate-600 max-w-2xl leading-relaxed`}
            >
              Biến việc học từ vựng thành một trải nghiệm{" "}
              <span className="font-semibold text-purple-600">ma thuật</span>.
              Ghi nhớ sâu hơn với AI cá nhân hóa, flashcard tương tác và hệ
              thống ôn tập thông minh.
            </p>

            <div
              style={{ transitionDelay: "500ms" }}
              className={`${fadeInUp()} flex justify-center md:justify-start gap-6 flex-wrap`}
            >
              <Link
                href="/register"
                className="group bg-gradient-to-r from-purple-600 to-pink-600 text-white px-10 py-4 rounded-full text-lg font-bold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Bắt đầu học miễn phí
                  <Zap className="w-5 h-5 group-hover:animate-pulse" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>

              <Link
                href="#how-it-works"
                className="group bg-white/80 backdrop-blur-sm text-purple-700 border-2 border-purple-200 px-8 py-4 rounded-full font-bold hover:bg-purple-50 hover:border-purple-300 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Khám phá ngay
                <ArrowDown className="w-4 h-4 group-hover:animate-bounce" />
              </Link>
            </div>

            <div
              style={{ transitionDelay: "600ms" }}
              className={`${fadeInUp()} flex items-center gap-8 pt-8`}
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">10K+</div>
                <div className="text-sm text-slate-500">Từ vựng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-pink-600">50+</div>
                <div className="text-sm text-slate-500">Chủ đề</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">95%</div>
                <div className="text-sm text-slate-500">Hiệu quả</div>
              </div>
            </div>
          </div>

          <div
            style={{ transitionDelay: "400ms" }}
            className={`${fadeInUp()} hidden md:block relative`}
          >
            <div className="relative bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 shadow-2xl border border-white/50 backdrop-blur-sm hover:scale-105 transition-transform duration-700">
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">
                    Flashcard Thông Minh
                  </h3>
                  <p className="text-purple-100">
                    AI học theo cách bạn ghi nhớ
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-100 rounded-xl p-4 text-center hover:scale-105 transition-transform">
                    <TrendingUp className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-blue-800">Tiến độ</p>
                  </div>
                  <div className="bg-green-100 rounded-xl p-4 text-center hover:scale-105 transition-transform">
                    <Target className="w-8 h-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-green-800">
                      Mục tiêu
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= HOW IT WORKS ======================= */}
        <section id="how-it-works" className="mb-32">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-4">
              <Zap className="w-4 h-4" />
              Quy trình học tập
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Chỉ cần{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                3 bước đơn giản
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Được thiết kế để bạn có thể bắt đầu ngay lập tức và đạt kết quả
              tối ưu
            </p>
          </div>

          <div className="relative max-w-6xl mx-auto">
            {/* Connecting Lines */}
            <div className="hidden lg:block absolute top-32 left-0 w-full h-1 bg-gradient-to-r from-purple-200 via-pink-200 to-green-200"></div>
            <div className="hidden lg:block absolute top-32 left-1/3 w-4 h-4 bg-pink-400 rounded-full transform -translate-x-2"></div>
            <div className="hidden lg:block absolute top-32 right-1/3 w-4 h-4 bg-pink-400 rounded-full transform translate-x-2"></div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
              {[
                {
                  icon: BookOpenCheck,
                  title: "Chọn & Học",
                  description:
                    "Khám phá hàng nghìn từ vựng được phân loại theo chủ đề. Học với flashcard tương tác, hình ảnh sinh động và phát âm chuẩn bản ngữ.",
                  steps: [
                    "📚 Chọn chủ đề yêu thích",
                    "👀 Xem flashcard với hình ảnh",
                    "🔊 Nghe phát âm chuẩn",
                    "📝 Ghi chú từ khó nhớ",
                  ],
                  color: "purple",
                  delay: "100ms",
                },
                {
                  icon: BrainCircuit,
                  title: "Luyện & Ghi nhớ",
                  description:
                    "AI tạo quiz cá nhân hóa theo khả năng của bạn. Hệ thống nhắc nhở thông minh giúp bạn không bao giờ quên từ đã học.",
                  steps: [
                    "🎯 Làm quiz thông minh",
                    "🧠 AI điều chỉnh độ khó",
                    "⏰ Ôn tập theo lịch trình",
                    "🔄 Lặp lại từ khó",
                  ],
                  color: "pink",
                  delay: "200ms",
                },
                {
                  icon: Target,
                  title: "Theo dõi & Phát triển",
                  description:
                    "Dashboard cá nhân với biểu đồ tiến độ chi tiết. Đặt mục tiêu và nhận thành tích khi hoàn thành các cột mốc quan trọng.",
                  steps: [
                    "📊 Xem biểu đồ tiến độ",
                    "🎯 Thiết lập mục tiêu",
                    "🏆 Nhận thành tích",
                    "📈 Cải thiện liên tục",
                  ],
                  color: "green",
                  delay: "300ms",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  style={{ transitionDelay: step.delay }}
                  className={`${fadeInUp()} group relative h-full`}
                >
                  {/* Step Number Circle */}
                  <div
                    className={`absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black text-white z-10 ${
                      step.color === "purple"
                        ? "bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg shadow-purple-500/30"
                        : step.color === "pink"
                        ? "bg-gradient-to-br from-pink-500 to-pink-600 shadow-lg shadow-pink-500/30"
                        : "bg-gradient-to-br from-green-500 to-green-600 shadow-lg shadow-green-500/30"
                    } group-hover:scale-110 transition-transform duration-300`}
                  >
                    {index + 1}
                  </div>

                  {/* Main Card */}
                  <div
                    className={`bg-white rounded-2xl p-8 pt-12 shadow-lg border-2 border-transparent hover:border-${
                      step.color === "purple"
                        ? "purple"
                        : step.color === "pink"
                        ? "pink"
                        : "green"
                    }-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 group-hover:bg-gradient-to-br ${
                      step.color === "purple"
                        ? "group-hover:from-purple-50/50 group-hover:to-white"
                        : step.color === "pink"
                        ? "group-hover:from-pink-50/50 group-hover:to-white"
                        : "group-hover:from-green-50/50 group-hover:to-white"
                    } h-full flex flex-col`}
                  >
                    {/* Icon */}
                    <div
                      className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-6 ${
                        step.color === "purple"
                          ? "bg-purple-100 text-purple-600"
                          : step.color === "pink"
                          ? "bg-pink-100 text-pink-500"
                          : "bg-green-100 text-green-600"
                      } group-hover:scale-110 transition-transform duration-300`}
                    >
                      <step.icon size={28} />
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-slate-600 leading-relaxed mb-6 flex-grow">
                      {step.description}
                    </p>

                    {/* Step-by-step List */}
                    <div className="space-y-3 mb-6">
                      <h4
                        className={`text-lg font-semibold ${
                          step.color === "purple"
                            ? "text-purple-700"
                            : step.color === "pink"
                            ? "text-pink-600"
                            : "text-green-700"
                        } mb-3`}
                      >
                        Các bước thực hiện:
                      </h4>
                      <ul className="space-y-2">
                        {step.steps.map((stepItem, stepIndex) => (
                          <li
                            key={stepIndex}
                            className="flex items-center gap-3 text-slate-600"
                          >
                            <span
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                step.color === "purple"
                                  ? "bg-purple-400"
                                  : step.color === "pink"
                                  ? "bg-pink-400"
                                  : "bg-green-400"
                              }`}
                            >
                              {stepIndex + 1}
                            </span>
                            {stepItem.split(" ").slice(1).join(" ")}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                          step.color === "purple"
                            ? "bg-purple-50 text-purple-700 hover:bg-purple-100"
                            : step.color === "pink"
                            ? "bg-pink-50 text-pink-600 hover:bg-pink-100"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        } hover:scale-105`}
                      >
                        Bắt đầu bước này
                        <MoveRight size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Summary */}
            <div className="mt-16 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 via-pink-100 to-green-100 px-6 py-3 rounded-full">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-slate-700 font-medium">
                  Chỉ cần 15 phút/ngày để thấy kết quả rõ rệt
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= FEATURES ======================= */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-cyan-100 px-4 py-2 rounded-full text-sm font-medium text-blue-700 mb-4">
              <Sparkles className="w-4 h-4" />
              Tính năng nổi bật
            </div>
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Mọi thứ bạn cần để{" "}
              <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                thành công
              </span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Bộ công cụ học tập toàn diện được thiết kế để tối ưu hóa hiệu quả
              học tập của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 h-full">
            {[
              {
                icon: BookOpenCheck,
                title: "Flashcard AI",
                description:
                  "Học từ theo chủ đề với hình ảnh HD, phát âm chuẩn và ví dụ thực tế. AI điều chỉnh độ khó theo tiến độ của bạn.",
                color: "purple",
                colorClasses: {
                  bg: "bg-gradient-to-br from-white to-purple-50/50",
                  border: "border-purple-400",
                  shadow: "hover:shadow-purple-500/20",
                  icon: "text-purple-600",
                  accent: "bg-purple-500",
                  link: "text-purple-600 hover:text-purple-700",
                },
                link: "/vocab",
                linkText: "Vào học ngay",
              },
              {
                icon: BrainCircuit,
                title: "Quiz Thông Minh",
                description:
                  "Hệ thống tạo câu hỏi cá nhân hóa, áp dụng thuật toán lặp lại ngắt quãng để tối ưu hóa khả năng ghi nhớ lâu dài.",
                color: "pink",
                colorClasses: {
                  bg: "bg-gradient-to-br from-white to-pink-50/50",
                  border: "border-pink-400",
                  shadow: "hover:shadow-pink-500/20",
                  icon: "text-pink-500",
                  accent: "bg-pink-500",
                  link: "text-pink-500 hover:text-pink-600",
                },
                link: "/quiz",
                linkText: "Luyện quiz",
              },
              {
                icon: NotebookText,
                title: "Sổ Từ Thông Minh",
                description:
                  "Quản lý toàn bộ từ vựng đã học với phân loại thông minh, thống kê chi tiết và tính năng tìm kiếm nâng cao.",
                color: "green",
                colorClasses: {
                  bg: "bg-gradient-to-br from-white to-green-50/50",
                  border: "border-green-400",
                  shadow: "hover:shadow-green-500/20",
                  icon: "text-green-600",
                  accent: "bg-green-500",
                  link: "text-green-600 hover:text-green-700",
                },
                link: "/wordbook",
                linkText: "Xem sổ từ",
              },
            ].map((feature, index) => (
              <div key={index} className="group relative h-full">
                <div
                  className={`${feature.colorClasses.bg} p-8 rounded-3xl shadow-xl border-t-4 ${feature.colorClasses.border} ${feature.colorClasses.shadow} hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 hover:scale-105 relative overflow-hidden h-full flex flex-col`}
                >
                  <div
                    className={`absolute top-4 right-4 w-20 h-20 rounded-full opacity-10 ${feature.colorClasses.accent} group-hover:scale-150 transition-transform duration-700`}
                  ></div>

                  <feature.icon
                    className={`${feature.colorClasses.icon} mb-4 group-hover:scale-110 transition-transform duration-300`}
                    size={40}
                  />

                  <h3 className="text-2xl font-bold text-slate-800 mb-4">
                    {feature.title}
                  </h3>

                  <p className="text-slate-600 mb-6 leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  <Link
                    href={feature.link}
                    className={`inline-flex items-center gap-2 font-bold text-lg ${feature.colorClasses.link} hover:gap-3 transition-all duration-300 mt-auto`}
                  >
                    {feature.linkText}
                    <MoveRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ======================= CTA Section ======================= */}
        <section className="text-center mb-24">
          <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 py-20 px-8 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: "60px 60px",
                }}
              ></div>
            </div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium text-white mb-6">
                <Star className="w-4 h-4" />
                Tham gia cộng đồng 50,000+ học viên
              </div>

              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Bắt đầu hành trình chinh phục
                <br />
                <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  từ vựng tiếng Anh
                </span>
              </h2>

              <p className="text-xl text-purple-100 max-w-2xl mx-auto mb-8">
                Tạo tài khoản miễn phí ngay hôm nay và trải nghiệm phương pháp
                học tập cách mạng cùng EnglishVoca
              </p>

              <Link
                href="/register"
                className="group inline-flex items-center gap-3 bg-white text-purple-700 px-10 py-4 rounded-full text-xl font-bold hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:-translate-y-1 shadow-xl"
              >
                Bắt đầu ngay - 100% Miễn phí
                <div className="bg-purple-600 text-white p-2 rounded-full group-hover:rotate-12 transition-transform duration-300">
                  <MoveRight size={20} />
                </div>
              </Link>

              <p className="text-purple-200 text-sm mt-4">
                ✓ Không cần thẻ tín dụng • ✓ Hủy bất cứ lúc nào • ✓ Hỗ trợ 24/7
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* ======================= FOOTER ======================= */}
      <footer className="mt-32 bg-white rounded-t-3xl border-t border-gray-200 shadow-2xl shadow-gray-900/10 relative overflow-hidden">
        {/* 3D Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50/30 to-purple-50/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-purple-100/30 to-transparent rounded-full blur-3xl transform -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-radial from-pink-100/30 to-transparent rounded-full blur-2xl transform translate-y-1/2"></div>

        <div className="relative container mx-auto px-6 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-2xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
                  EnglishVoca
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Nền tảng học từ vựng tiếng Anh thông minh với công nghệ AI
                  tiên tiến, giúp bạn chinh phục ngôn ngữ một cách hiệu quả
                  nhất.
                </p>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {[
                  { icon: Facebook, color: "hover:bg-blue-600", link: "#" },
                  { icon: Twitter, color: "hover:bg-blue-400", link: "#" },
                  { icon: Instagram, color: "hover:bg-pink-600", link: "#" },
                  { icon: Youtube, color: "hover:bg-red-600", link: "#" },
                ].map((social, index) => (
                  <Link
                    key={index}
                    href={social.link}
                    className={`w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 ${social.color} hover:text-white transition-all duration-300 hover:scale-110 hover:-translate-y-2 hover:shadow-lg hover:border-transparent transform-gpu`}
                  >
                    <social.icon size={18} />
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-6">
                Liên kết nhanh
              </h4>
              <ul className="space-y-3">
                {[
                  { label: "Trang chủ", link: "/" },
                  { label: "Học từ vựng", link: "/vocab" },
                  { label: "Luyện quiz", link: "/quiz" },
                  { label: "Sổ từ cá nhân", link: "/wordbook" },
                  { label: "Thống kê tiến độ", link: "/progress" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.link}
                      className="text-gray-600 hover:text-purple-600 transition-all duration-300 hover:translate-x-2 hover:scale-105 inline-block transform-gpu"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-6">Hỗ trợ</h4>
              <ul className="space-y-3">
                {[
                  { label: "Trung tâm trợ giúp", link: "/help" },
                  { label: "Câu hỏi thường gặp", link: "/faq" },
                  { label: "Hướng dẫn sử dụng", link: "/guide" },
                  { label: "Báo cáo lỗi", link: "/report" },
                  { label: "Liên hệ", link: "/contact" },
                ].map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.link}
                      className="text-gray-600 hover:text-pink-600 transition-all duration-300 hover:translate-x-2 hover:scale-105 inline-block transform-gpu"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="text-lg font-bold text-gray-800 mb-6">Liên hệ</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 transform-gpu">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Email hỗ trợ</p>
                    <a
                      href="mailto:support@englishup.com"
                      className="text-gray-800 font-medium hover:text-purple-600 transition-colors"
                    >
                      support@englishup.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 transform-gpu">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Hotline</p>
                    <a
                      href="tel:+84123456789"
                      className="text-gray-800 font-medium hover:text-green-600 transition-colors"
                    >
                      +84 123 456 789
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 transform-gpu">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">Địa chỉ</p>
                    <p className="text-gray-800 font-medium">
                      TP. Hồ Chí Minh, Việt Nam
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
