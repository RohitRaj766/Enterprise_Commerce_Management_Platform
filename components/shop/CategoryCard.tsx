import Link from 'next/link';
import Image from 'next/image';
import { ProductCategory } from '@/types';

interface CategoryCardProps {
  id: ProductCategory;
  name: string;
  icon: string;
  href?: string;
}

export const CategoryCard = ({ id, name, icon, href }: CategoryCardProps) => {
  const pastelBg: Record<ProductCategory, string> = {
    [ProductCategory.FRUITS_VEG]: 'bg-emerald-50 border-emerald-100',
    [ProductCategory.COOKING]: 'bg-amber-50 border-amber-100',
    [ProductCategory.MEAT_FISH]: 'bg-rose-50 border-rose-100',
    [ProductCategory.BAKERY_SNACKS]: 'bg-violet-50 border-violet-100',
    [ProductCategory.DAIRY_EGGS]: 'bg-yellow-50 border-yellow-100',
    [ProductCategory.BEVERAGES]: 'bg-sky-50 border-sky-100',
    [ProductCategory.PULSES]: 'bg-lime-50 border-lime-100',
    [ProductCategory.RICE]: 'bg-orange-50 border-orange-100',
  };

  return (
    <Link
      href={href ?? `/explore?category=${id}`}
      className={`rounded-3xl p-4 flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-shadow ${pastelBg[id] ?? 'bg-white border border-gray-100'}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-sm overflow-hidden">
        <Image
          src={icon}
          alt={name}
          width={64}
          height={64}
          className="object-contain"
        />
      </div>
      <p className="text-sm font-semibold text-gray-800 text-center leading-snug">{name}</p>
    </Link>
  );
};

