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

export const DesktopNav = () => {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center justify-between bg-white border border-gray-100 rounded-2xl shadow-sm px-5 py-3 mb-4">
      {tabs.map((tab) => {
        const active = pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors ${
              active ? 'text-[#53B175] bg-emerald-50' : 'text-gray-700 hover:text-[#53B175] hover:bg-gray-50'
            }`}
          >
            <tab.Icon color={active ? '#53B175' : '#181725'} />
            <span className="text-sm font-semibold">{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
};


