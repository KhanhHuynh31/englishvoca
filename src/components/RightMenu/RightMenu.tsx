import React from "react";

export default function RightMenu() {
  return (
    <aside className="col-span-12 pt-5  md:col-span-3">
      {/* điểm thưởng góc phải */}
     
      <div className="space-y-6">
        {/* Card: Thử Super miễn phí */}
        <section className="rounded-xl border-2 border-gray-200 p-4 text-center">
          <h3 className="font-bold text-purple-600">SUPER</h3>
          <h4 className="my-2 text-xl font-bold text-gray-800">
            Thử Super miễn phí
          </h4>
          <p className="mb-4 text-sm text-gray-600">
            Không quảng cáo, bài luyện tập cá nhân hóa, và không giới hạn số lần
            chinh phục Huyền thoại!
          </p>
          <button className="w-full rounded-xl bg-purple-600 py-3 font-bold text-white shadow-lg transition hover:bg-purple-700">
            THỬ 2 TUẦN MIỄN PHÍ
          </button>
        </section>

        {/* Card: Mở khóa Bảng xếp hạng */}
        <section className="rounded-xl border-2 border-gray-200 p-4">
          <h3 className="mb-2 font-bold text-gray-800">
            Mở khóa Bảng xếp hạng!
          </h3>
          <div className="flex items-center">
            <div className="mr-4 text-4xl" aria-hidden="true">
              🔒
            </div>
            <p className="text-sm text-gray-600">
              Hoàn thành thêm 8 bài học để bắt đầu thi đua
            </p>
          </div>
        </section>

        {/* Card: Nhiệm vụ hằng ngày */}
        <section className="rounded-xl border-2 border-gray-200 p-4">
          <header className="mb-2 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Nhiệm vụ hằng ngày</h3>
            <a
              href="#"
              className="text-sm font-bold uppercase text-blue-500 hover:underline"
            >
              Xem tất cả
            </a>
          </header>
          <div className="flex items-center">
            <div className="mr-4 text-4xl" aria-hidden="true">
              💪
            </div>
            <p className="text-sm text-gray-600">Kiếm 10 KN</p>
          </div>
        </section>
      </div>
    </aside>
  );
}
