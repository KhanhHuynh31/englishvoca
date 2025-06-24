
export default function LoadingProfileDashboard() {
  return (
    <div className="max-w-7xl mx-auto animate-pulse px-4 py-8 text-gray-800 space-y-8">
      <div className="h-8 w-1/3 bg-gray-300 rounded-lg" />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl shadow-sm flex items-start space-x-4"
          >
            <div className="bg-slate-100 p-3 rounded-full w-10 h-10" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-24 bg-gray-300 rounded" />
              <div className="h-6 w-16 bg-gray-400 rounded" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Pie Chart Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm space-y-4">
          <div className="h-5 w-1/2 bg-gray-300 rounded" />
          <div className="w-full h-80 bg-gray-100 rounded-lg" />
        </div>

        {/* Bar Chart Placeholder */}
        <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-sm space-y-4">
          <div className="h-5 w-2/3 bg-gray-300 rounded" />
          <div className="w-full h-80 bg-gray-100 rounded-lg" />
        </div>
      </div>

      {/* Recently Reviewed Placeholder */}
      <div className="bg-white p-6 rounded-xl shadow-sm space-y-4">
        <div className="h-5 w-1/3 bg-gray-300 rounded" />
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
          >
            <div className="space-y-1">
              <div className="h-4 w-32 bg-gray-300 rounded" />
              <div className="h-3 w-48 bg-gray-200 rounded" />
            </div>
            <div className="space-y-1 text-right">
              <div className="h-3 w-20 bg-gray-200 rounded" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
