'use client';

import type React from 'react';

interface NumericKeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
}

export const NumericKeypad: React.FC<NumericKeypadProps> = ({
  onKeyPress,
  onBackspace,
}) => {
  const keys = [
    ['1', '2 ABC', '3 DEF'],
    ['4 GHI', '5 JKL', '6 MNO'],
    ['7 PQRS', '8 TUV', '9 WXYZ'],
    ['+*#', '0', 'backspace'],
  ];

  const handleKeyClick = (key: string) => {
    if (key === 'backspace') {
      onBackspace();
    } else {
      // Extract the first character (number or +)
      const firstChar = key.split(' ')[0];
      onKeyPress(firstChar);
    }
  };

  return (
    <div className="w-full bg-white border-t border-gray-200 pt-4 pb-8 px-4">
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        {keys.flat().map((key, index) => {
          const isBackspace = key === 'backspace';
          const displayKey = isBackspace ? null : key.split(' ')[0];
          const displayLabel = isBackspace ? null : key.split(' ').slice(1).join(' ');

          return (
            <button
              key={index}
              onClick={() => handleKeyClick(key)}
              className="
                h-14 flex flex-col items-center justify-center
                bg-white rounded-xl border border-gray-200
                text-gray-800 font-semibold text-xl
                active:bg-gray-100 transition-colors
                shadow-sm
              "
            >
              {isBackspace ? (
                <div className="relative w-6 h-6">
                  <div className="absolute inset-0 border-2 border-gray-800 rounded"></div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    className="absolute inset-0 m-auto"
                  >
                    <path
                      d="M4 4L12 12M12 4L4 12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              ) : (
                <>
                  <span className="text-xl font-semibold">{displayKey}</span>
                  {displayLabel && (
                    <span className="text-xs font-normal text-gray-500 mt-0.5">
                      {displayLabel}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

