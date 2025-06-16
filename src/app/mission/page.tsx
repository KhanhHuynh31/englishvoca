"use client";

import React from "react";

type Mission = {
  id: number;
  title: string;
  icon: string;
  current: number;
  total: number;
  rewardIcon: string;
};

const sampleMissions: Mission[] = [
  {
    id: 1,
    title: "Kiếm 10 KN",
    icon: "⚡",
    current: 0,
    total: 10,
    rewardIcon: "📦",
  },
  {
    id: 2,
    title: "Học 1 Unit",
    icon: "📘",
    current: 1,
    total: 1,
    rewardIcon: "🎁",
  },
  {
    id: 3,
    title: "Làm 1 Quiz",
    icon: "🧠",
    current: 0,
    total: 1,
    rewardIcon: "💎",
  },
  {
    id: 4,
    title: "Nghe 3 từ vựng",
    icon: "🔊",
    current: 2,
    total: 3,
    rewardIcon: "🪙",
  },
];

const MissionPage: React.FC = () => {
  return (
    <div className="min-h-screen p-4 font-sans w-full">
      {/* Completed Missions Statistics Section */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200 text-center">
            <p className="text-4xl font-bold text-green-600">15</p>
            <p className="text-gray-600">Nhiệm vụ hoàn thành tuần này</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 text-center">
            <p className="text-4xl font-bold text-blue-600">75</p>
            <p className="text-gray-600">Tổng số nhiệm vụ hoàn thành</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 text-center">
            <p className="text-4xl font-bold text-purple-600">300 KN</p>
            <p className="text-gray-600">Tổng điểm KN kiếm được</p>
          </div>
        </div>
      </div>
      {/* Daily Missions Section */}
      <div className="p-4 mb-6 pt-0">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Nhiệm vụ hôm nay
        </h2>
        <div className="space-y-4">
          {sampleMissions.map((mission) => {
            const progressPercent = Math.min(
              (mission.current / mission.total) * 100,
              100
            );

            return (
              <div
                key={mission.id}
                className="flex items-center bg-white p-4 rounded-lg border border-gray-200"
              >
                <div className="text-yellow-500 text-3xl mr-4">
                  {mission.icon}
                </div>
                <div className="flex-grow">
                  <p className="text-lg font-medium text-gray-700 mb-1">
                    {mission.title}
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progressPercent}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {mission.current} / {mission.total}
                  </p>
                </div>
                <div className="ml-4 p-2 bg-gray-200 rounded-md text-xl text-gray-600">
                  {mission.rewardIcon}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MissionPage;
