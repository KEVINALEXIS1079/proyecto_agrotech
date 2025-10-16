export const TableSkeleton = () => (
  <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
    <div className="w-full animate-pulse">
      <div className="h-12 bg-gray-100"></div>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center justify-between p-4 border-t border-gray-200">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      ))}
    </div>
  </div>
);