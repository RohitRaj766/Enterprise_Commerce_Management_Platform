interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-gray-200 rounded';
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };
  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-pulse',
    none: '',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
    />
  );
}

// Pre-built skeleton components
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
      <Skeleton variant="rectangular" height={120} className="w-full mb-3 rounded-xl" />
      <Skeleton variant="text" width="70%" className="mb-2" />
      <Skeleton variant="text" width="50%" className="mb-3" />
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={60} height={20} />
        <Skeleton variant="circular" width={32} height={32} />
      </div>
    </div>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <Skeleton variant="circular" width={60} height={60} className="mx-auto mb-3" />
      <Skeleton variant="text" width="80%" className="mx-auto" />
    </div>
  );
}

export function CartItemSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-3">
      <div className="flex gap-4">
        <Skeleton variant="rectangular" width={80} height={80} className="rounded-xl flex-shrink-0" />
        <div className="flex-1">
          <Skeleton variant="text" width="70%" className="mb-2" />
          <Skeleton variant="text" width="50%" className="mb-3" />
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width={80} height={24} />
            <Skeleton variant="rectangular" width={100} height={32} className="rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="px-5 pt-4 pb-6 bg-white shadow-sm">
        <Skeleton variant="rectangular" height={50} className="w-full mb-4 rounded-2xl" />
        <Skeleton variant="rectangular" height={40} className="w-full rounded-2xl" />
      </div>
      <div className="px-4 space-y-8 mt-4">
        <Skeleton variant="rectangular" height={120} className="w-full rounded-2xl" />
        <div className="space-y-3">
          <Skeleton variant="text" width={150} height={24} />
          <div className="grid grid-cols-2 gap-3">
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

