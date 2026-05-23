'use client';
import { useRouter } from 'next/navigation';

interface NavbarProps {
  showBack?: boolean;
  showLogo?: boolean;
  title?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  showBack = false,
  showLogo = false,
  title,
}) => {
  const router = useRouter();

  return (
    <nav className="w-full py-4 px-4 flex items-center relative z-20">
      {showBack && (
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-white transition-colors z-30"
          aria-label="Go back"
          type="button"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-900"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      {title && (
        <h1 className="text-lg font-semibold text-gray-900 ml-4">
          {title}
        </h1>
      )}
      {showLogo && (
        <div className="flex items-center gap-2 mx-auto">
          <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
            <span className="text-[#53B175] text-3xl">🥕</span>
          </div>
        </div>
      )}
    </nav>
  );
};

