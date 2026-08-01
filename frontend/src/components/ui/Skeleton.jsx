import React from 'react';

export default function Skeleton({ className = '' }) {
  return (
    <div className={`animate-pulse bg-gray-200 dark:bg-gray-800 rounded-xl ${className}`} />
  );
}

export function ArticleSkeleton() {
  return (
    <div className="glass rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row gap-8">
      {/* Image Skeleton */}
      <div className="md:w-1/3 aspect-video md:aspect-square">
        <Skeleton className="w-full h-full rounded-2xl" />
      </div>

      {/* Content Skeleton */}
      <div className="md:w-2/3 flex flex-col justify-center">
        <div className="flex items-center gap-4 mb-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-20 w-full mb-6" />
        <div className="flex items-center gap-4 mt-auto">
          <Skeleton className="w-10 h-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      </div>
    </div>
  );
}
