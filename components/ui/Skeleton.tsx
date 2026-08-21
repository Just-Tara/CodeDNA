export function Skeleton({
  width = "100%",
  height = 14,
  radius = 6,
  className = "",
}: {
  width?: number | string;
  height?: number | string;
  radius?: number;
  className?: string;
}) {
  return (
    <div
      className={`animate-dna-shimmer bg-elevated ${className}`}
      style={{ width, height, borderRadius: radius }}
    />
  );
}

export function GraphSkeleton({ height = 420 }: { height?: number }) {
  return (
    <div
      className="w-full flex items-center justify-center relative overflow-hidden bg-surface border border-border rounded-2xl"
      style={{ height }}
    >
      <div className="animate-dna-shimmer bg-elevated rounded-full" style={{ width: 64, height: 64 }} />
      {[1, 2, 3].map((r) => (
        <div
          key={r}
          className="animate-dna-pulse-ring absolute rounded-full border border-border"
          style={{ width: 90 * r, height: 90 * r, animationDelay: `${r * 0.15}s` }}
        />
      ))}
    </div>
  );
}

export function ProjectPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 pt-12 pb-32">
      <Skeleton width={60} height={12} className="mb-6" />
      <Skeleton width={200} height={12} className="mb-2.5" />
      <Skeleton width={320} height={30} className="mb-3.5" />
      <Skeleton width={380} height={16} className="mb-7" />
      <div className="flex gap-2 mb-10">
        <Skeleton width={110} height={36} radius={8} />
        <Skeleton width={110} height={36} radius={8} />
        <Skeleton width={110} height={36} radius={8} />
        <Skeleton width={90} height={36} radius={8} />
      </div>
      <GraphSkeleton />
      <div className="mt-12 space-y-3">
        <Skeleton width={120} height={12} />
        <div className="flex gap-2 flex-wrap">
          {[0, 1, 2, 3, 4].map((i) => (
            <Skeleton key={i} width={90} height={30} radius={999} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ListPageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 pt-12 pb-32">
      <Skeleton width={60} height={12} className="mb-6" />
      <Skeleton width={220} height={28} className="mb-2.5" />
      <Skeleton width={160} height={14} className="mb-8" />
      <div className="grid sm:grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-xl p-4">
            <Skeleton width="70%" height={14} className="mb-2.5" />
            <Skeleton width="90%" height={11} className="mb-1.5" />
            <Skeleton width="40%" height={11} />
          </div>
        ))}
      </div>
    </div>
  );
}
