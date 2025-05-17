import React from 'react';
const SkeletonLoader = () => (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="p-4 bg-gray-200 rounded-xl animate-pulse h-24"></div>
      ))}
    </div>
  );
  export default SkeletonLoader;