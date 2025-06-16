import React from "react";

const DuolingoProfile: React.FC = () => {
  return (
    <div className="min-h-screen w-full">
      {/* Main Content */}
      <div className="p-4 ">
        {/* Left Column - Profile Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 lg:mb-0">
          {/* Profile Header */}
          <div className="flex items-center mb-6">
            <div className="relative w-24 h-24 rounded-full bg-blue-200 flex items-center justify-center text-blue-500 text-6xl">
              +
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow">
                <i className="fas fa-pencil-alt text-gray-600 text-sm"></i>{" "}
                {/* Placeholder for edit icon */}
              </button>
            </div>
            <div className="ml-6">
              <h1 className="text-3xl font-bold text-gray-800">Khánh Huỳnh</h1>
              <p className="text-gray-500 text-sm">Khnhhkhunh372797</p>
              <p className="text-gray-500 text-sm">
                Đã tham gia Tháng Chín 2020
              </p>
              <div className="flex items-center mt-2 space-x-4">
                <button className="text-blue-500 font-semibold text-sm">
                  Đang theo dõi 0
                </button>
                <span className="text-gray-400 text-sm">|</span>
                <button className="text-gray-500 text-sm">
                  0 Người theo dõi
                </button>
                <span className="ml-4 text-2xl">🇺🇸</span>{" "}
                {/* Flag next to follow stats */}
              </div>
            </div>
          </div>

          {/* Statistics */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Thống kê
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
              <span className="text-4xl text-yellow-500 mr-4">
                <i className="fas fa-fire"></i>{" "}
                {/* Placeholder for fire icon */}
              </span>
              <div>
                <p className="text-3xl font-bold">0</p>
                <p className="text-gray-600">Ngày streak</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
              <span className="text-4xl text-yellow-500 mr-4">
                <i className="fas fa-bolt"></i>{" "}
                {/* Placeholder for bolt icon */}
              </span>
              <div>
                <p className="text-3xl font-bold">114</p>
                <p className="text-gray-600">Tổng điểm KN</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
              <span className="text-4xl text-gray-400 mr-4">
                <i className="fas fa-trophy"></i>{" "}
                {/* Placeholder for trophy icon */}
              </span>
              <div>
                <p className="text-gray-600">Chưa có xếp hạng</p>
                <p className="text-gray-600 text-sm">Giải đấu hiện tại</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
              <span className="text-4xl text-gray-400 mr-4">
                <i className="fas fa-star"></i>{" "}
                {/* Placeholder for star icon */}
              </span>
              <div>
                <p className="text-3xl font-bold">0</p>
                <p className="text-gray-600">Số lần đạt top 3</p>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Thành tích
          </h2>
          <button className="text-blue-500 font-semibold float-right mb-4">
            XEM TẤT CẢ
          </button>
          <div className="clear-both">
            {/* Achievement 1: Lửa rừng */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm mb-4">
              <div className="w-16 h-16 mr-4 flex-shrink-0">
                <img
                  src="/path/to/lua_rung_icon.png"
                  alt="Lửa rừng"
                  className="w-full h-full object-contain"
                />{" "}
                {/* Placeholder for achievement icon */}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">
                  Lửa rừng
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  Đạt chuỗi 3 ngày streak
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-orange-500 h-2.5 rounded-full"
                    style={{ width: "33.33%" }}
                  ></div>
                </div>
                <p className="text-right text-gray-600 text-sm mt-1">1/3</p>
              </div>
            </div>

            {/* Achievement 2: Cao nhân */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm mb-4">
              <div className="w-16 h-16 mr-4 flex-shrink-0">
                <img
                  src="/path/to/cao_nhan_icon.png"
                  alt="Cao nhân"
                  className="w-full h-full object-contain"
                />{" "}
                {/* Placeholder for achievement icon */}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">
                  Cao nhân
                </h3>
                <p className="text-gray-600 text-sm mb-2">Đạt được 250 KN</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-yellow-500 h-2.5 rounded-full"
                    style={{ width: "45.6%" }}
                  ></div>{" "}
                  {/* (114/250) * 100 */}
                </div>
                <p className="text-right text-gray-600 text-sm mt-1">114/250</p>
              </div>
            </div>

            {/* Achievement 3: Học giả */}
            <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm mb-4">
              <div className="w-16 h-16 mr-4 flex-shrink-0">
                <img
                  src="/path/to/hoc_gia_icon.png"
                  alt="Học giả"
                  className="w-full h-full object-contain"
                />{" "}
                {/* Placeholder for achievement icon */}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-800">Học giả</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Học 1000 từ mới trong một khóa học
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-green-500 h-2.5 rounded-full"
                    style={{ width: "85.6%" }}
                  ></div>{" "}
                  {/* (856/1000) * 100 */}
                </div>
                <p className="text-right text-gray-600 text-sm mt-1">
                  856/1000
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DuolingoProfile;
