export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto space-y-6">
        {/* 2.1 Top-level Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Căn hộ */}
          <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">50</h2>
              <span className="text-3xl">🏠</span>
            </div>
            <p className="text-gray-500 mt-2">Căn hộ</p>
            <a href="#" className="text-blue-600 mt-2 hover:underline text-sm">Xem tất cả</a>
          </div>

          {/* Card 2: Dân cư */}
          <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">100</h2>
              <span className="text-3xl">👤</span>
            </div>
            <p className="text-gray-500 mt-2">Dân cư</p>
            <a href="#" className="text-blue-600 mt-2 hover:underline text-sm">Xem tất cả</a>
          </div>

          {/* Card 3: Tổng thu */}
          <div className="bg-white p-4 rounded-lg shadow flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                10.000 <span className="text-sm font-normal">k<sup>VND</sup></span>
              </h2>
              <span className="text-3xl">💰</span>
            </div>
            <p className="text-gray-500 mt-2">Tổng thu</p>
            <a href="#" className="text-blue-600 mt-2 hover:underline text-sm">Xem tất cả</a>
          </div>
        </section>

        {/* 2.2 Middle Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart card */}
          <div className="bg-white p-4 rounded-lg shadow lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Biến động dân cư</h3>
            <div className="relative h-64 bg-gray-50 rounded-lg flex items-end justify-between p-4">
              {/* Simple chart bars */}
              <div className="flex w-full justify-between h-full items-end">
                <div className="w-6 bg-blue-500 rounded" style={{ height: '20%' }}></div>
                <div className="w-6 bg-blue-500 rounded" style={{ height: '60%' }}></div>
                <div className="w-6 bg-blue-500 rounded" style={{ height: '40%' }}></div>
                <div className="w-6 bg-blue-500 rounded" style={{ height: '30%' }}></div>
                <div className="w-6 bg-blue-500 rounded" style={{ height: '90%' }}></div>
                <div className="w-6 bg-blue-500 rounded" style={{ height: '50%' }}></div>
              </div>
            </div>
          </div>

          {/* Right side cards */}
          <div className="space-y-6">
            {/* Recent incomes */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Các khoản thu mới cập nhật</h3>
              <ul className="space-y-2">
                <li className="flex justify-between text-gray-700">
                  <span>Tiền điện</span>
                  <span>100.000đ</span>
                </li>
                <li className="flex justify-between text-gray-700">
                  <span>Tiền nước</span>
                  <span>50.000đ</span>
                </li>
                <li className="flex justify-between text-gray-700">
                  <span>Tiền vệ sinh</span>
                  <span>10.000đ</span>
                </li>
              </ul>
            </div>

            {/* Population changes */}
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Biến động dân cư</h3>
              <ul className="space-y-2">
                <li className="flex justify-between text-gray-700">
                  <span>Hộ 102</span>
                  <span className="text-green-600">+1</span>
                </li>
                <li className="flex justify-between text-gray-700">
                  <span>Hộ 301</span>
                  <span className="text-red-600">-2</span>
                </li>
                <li className="flex justify-between text-gray-700">
                  <span>Hộ 406</span>
                  <span className="text-red-600">-1</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* 2.3 Bottom Action Buttons */}
        <section className="flex flex-wrap gap-4">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Tạo khoản thu</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Thu phí</button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition">Xuất báo cáo</button>
        </section>
      </main>
    </div>
  );
}
