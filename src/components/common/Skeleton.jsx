// src/components/common/Skeleton.jsx

export const QuestionCardSkeleton = () => (
  <div className="card p-5 animate-pulse">
    <div className="flex gap-4">
      <div className="flex flex-col items-center gap-2 flex-shrink-0">
        <div className="skeleton w-8 h-16 rounded" />
      </div>
      <div className="flex-1 space-y-3">
        <div className="skeleton h-5 w-4/5 rounded" />
        <div className="skeleton h-4 w-full rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="flex gap-2 mt-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-5 w-16 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export const PageSkeleton = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, i) => <QuestionCardSkeleton key={i} />)}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="animate-pulse space-y-6">
    <div className="card p-6">
      <div className="flex items-center gap-4">
        <div className="skeleton w-20 h-20 rounded-full" />
        <div className="space-y-2 flex-1">
          <div className="skeleton h-6 w-40 rounded" />
          <div className="skeleton h-4 w-32 rounded" />
        </div>
      </div>
    </div>
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => <QuestionCardSkeleton key={i} />)}
    </div>
  </div>
);
