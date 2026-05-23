'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AccountIcon, CartIcon, ExploreIcon, FavoriteIcon, StoreIcon } from '@/components/icons/NavigationIcons';

const tabs = [
  { href: '/home', label: 'Shop', Icon: StoreIcon },
  { href: '/explore', label: 'Explore', Icon: ExploreIcon },
  { href: '/cart', label: 'Cart', Icon: CartIcon },
  { href: '/favorites', label: 'Favorite', Icon: FavoriteIcon },
  { href: '/account', label: 'Account', Icon: AccountIcon },
];

export const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-2xl shadow-black/5">
      <div className="grid grid-cols-5">
        {tabs.map((tab) => {
          const active = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-3 text-xs font-medium ${
                active ? 'text-[#53B175]' : 'text-gray-500'
              }`}
            >
              <div
                className={`w-10 h-10 flex justify-center items-center rounded-full`}
              >
                <tab.Icon color={active ? '#53B175' : '#181725'} />
              </div>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

