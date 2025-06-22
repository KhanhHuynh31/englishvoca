"use client";

import { useGetIndexDB } from "@/components/hooks/useGetIndexDB";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { BookCheck, BrainCircuit, GraduationCap } from "lucide-react";

export type StatusType = "new" | "known" | "hard";

export interface Word {
  id: string;
  term: string;
  definition: string;
  meaning: string;
  status: StatusType;
  pronunciation: string;
  lastReviewed: string;
}

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: number | string;
  subtitle?: string;
}

export default function ProfileIndexDB() {
  const [vocabData, setVocabData] = useState<Word[]>([]);
  const rawDataFromDB = useGetIndexDB();

  useEffect(() => {
    if (rawDataFromDB.length > 0) {
      setVocabData(rawDataFromDB);
    }
  }, [rawDataFromDB]);

  const stats = useMemo(() => {
    const total = vocabData.length;
    const known = vocabData.filter((v) => v.status === "known").length;
    const learning = vocabData.filter((v) => v.status === "hard").length;
    const newWords = vocabData.filter((v) => v.status === "new").length;
    const completionRate = total > 0 ? Math.round((known / total) * 100) : 0;

    return { total, known, learning, new: newWords, completionRate };
  }, [vocabData]);

  const pieChartData = useMemo(() => {
    return [
      { name: "Đã thuộc", value: stats.known, color: "#22c55e" },
      { name: "Từ khó", value: stats.learning, color: "#3b82f6" },
      { name: "Từ mới", value: stats.new, color: "#f97316" },
    ].filter((item) => item.value > 0);
  }, [stats]);

  const dailyReviewData = useMemo(() => {
    const dailyCounts: { [key: string]: number } = {};
    const today = new Date();

    vocabData.forEach((word) => {
      const reviewDate = new Date(word.lastReviewed);
      const diffDays =
        (today.getTime() - reviewDate.getTime()) / (1000 * 3600 * 24);

      if (diffDays <= 7 && diffDays >= 0) {
        const dateKey = reviewDate.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
        });
        dailyCounts[dateKey] = (dailyCounts[dateKey] || 0) + 1;
      }
    });

    return Object.entries(dailyCounts)
      .map(([date, count]) => ({ date, count }))
      .sort(
        (a, b) =>
          new Date(a.date.split("/").reverse().join("-")).getTime() -
          new Date(b.date.split("/").reverse().join("-")).getTime()
      );
  }, [vocabData]);

  const recentlyReviewed = useMemo(() => {
    return [...vocabData]
      .sort(
        (a, b) =>
          new Date(b.lastReviewed).getTime() -
          new Date(a.lastReviewed).getTime()
      )
      .slice(0, 5);
  }, [vocabData]);

  if (vocabData.length === 0 && rawDataFromDB.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50 text-gray-500">
        <p>Đang tải dữ liệu hoặc chưa có từ vựng nào...</p>
      </div>
    );
  }

  return (
    <div className="">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Bảng điều khiển tiến độ
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={<BookCheck className="w-8 h-8 text-blue-500" />}
            title="Tổng số từ"
            value={stats.total}
          />
          <StatCard
            icon={<GraduationCap className="w-8 h-8 text-green-500" />}
            title="Từ đã thuộc"
            value={stats.known}
            subtitle={`${stats.completionRate}% hoàn thành`}
          />
          <StatCard
            icon={<BrainCircuit className="w-8 h-8 text-orange-500" />}
            title="Từ khó"
            value={stats.learning}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Trạng thái từ vựng
            </h2>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={110}
                    fill="#8884d8"
                    dataKey="value"
                    label={({
                      cx,
                      cy,
                      midAngle,
                      innerRadius,
                      outerRadius,
                      percent,
                    }) => {
                      const radius =
                        innerRadius + (outerRadius - innerRadius) * 0.6;
                      const x =
                        cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                      const y =
                        cy + radius * Math.sin(-midAngle * (Math.PI / 180));

                      return (
                        <text
                          x={x}
                          y={y}
                          fill="#374151"
                          textAnchor="middle"
                          dominantBaseline="central"
                          style={{ pointerEvents: "none" }}
                        >
                          {`${(percent * 100).toFixed(0)}%`}
                        </text>
                      );
                    }}
                  >
                    {pieChartData.map((entry) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} từ`, "Số lượng"]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-bold text-gray-700 mb-4">
              Hoạt động ôn tập (7 ngày qua)
            </h2>
            <div className="w-full h-80">
              <ResponsiveContainer>
                <BarChart
                  data={dailyReviewData}
                  margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#6b7280" }} />
                  <YAxis allowDecimals={false} tick={{ fill: "#6b7280" }} />
                  <Tooltip
                    cursor={{ fill: "rgba(240, 240, 240, 0.5)" }}
                    contentStyle={{
                      background: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ fontWeight: "bold" }}
                    formatter={(value) => [`${value} từ`, "Đã ôn"]}
                  />
                  <Bar
                    dataKey="count"
                    name="Số từ đã ôn"
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            Đã xem gần đây
          </h2>
          <div className="space-y-4">
            {recentlyReviewed.map((word) => (
              <div
                key={word.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div>
                  <p className="font-semibold text-gray-800">{word.term}</p>
                  <p className="text-sm text-gray-500">{word.definition}</p>
                </div>
                <div className="text-right text-sm">
                  <p className="text-gray-600">
                    {new Date(word.lastReviewed).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="text-gray-400">
                    {new Date(word.lastReviewed).toLocaleTimeString("vi-VN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm flex items-start space-x-4">
      <div className="bg-slate-100 p-3 rounded-full">{icon}</div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        {subtitle && <p className="text-sm text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
