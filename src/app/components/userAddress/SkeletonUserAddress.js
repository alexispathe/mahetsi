// src/app/components/userAddress/SkeletonUserAddress.jsx

import React from 'react';

export default function SkeletonUserAddress() {
  return (
    <div className="user-address-container bg-white p-6 rounded-lg shadow-md animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
      <div className="h-5 bg-gray-300 rounded w-2/4 mb-2"></div>
      <div className="space-y-4">
        {[1, 2, 3].map((item) => (
          <div key={item} className="flex items-center space-x-4">
            <div className="h-4 bg-gray-300 rounded w-12"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
        ))}
      </div>
      <div className="mt-6 h-10 bg-gray-300 rounded w-1/2"></div>
    </div>
  );
}
