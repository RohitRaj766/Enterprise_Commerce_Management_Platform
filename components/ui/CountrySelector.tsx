'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';

export interface Country {
  name: string;
  code: string;
  dialCode: string;
  flag: string; // Flag image URL
}

const countries: Country[] = [
  { name: 'Bangladesh', code: 'BD', dialCode: '+880', flag: 'https://flagcdn.com/w40/bd.png' },
  { name: 'India', code: 'IN', dialCode: '+91', flag: 'https://flagcdn.com/w40/in.png' },
  { name: 'United States', code: 'US', dialCode: '+1', flag: 'https://flagcdn.com/w40/us.png' },
  { name: 'United Kingdom', code: 'GB', dialCode: '+44', flag: 'https://flagcdn.com/w40/gb.png' },
  { name: 'United Arab Emirates', code: 'AE', dialCode: '+971', flag: 'https://flagcdn.com/w40/ae.png' },
];

interface CountrySelectorProps {
  selectedCountry: Country;
  onSelect: (country: Country) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  );

  const handleSelect = (country: Country) => {
    onSelect(country);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Image
          src={selectedCountry.flag}
          alt={selectedCountry.name}
          width={24}
          height={18}
          className="rounded object-cover"
        />
        <span className="text-base font-medium text-gray-700">
          {selectedCountry.dialCode}
        </span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-80 overflow-hidden flex flex-col">
          {/* Search input */}
          <div className="p-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="Search country..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#53B175] text-sm"
              autoFocus
            />
          </div>

          {/* Country list */}
          <div className="overflow-y-auto max-h-64">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className={`w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                    selectedCountry.code === country.code ? 'bg-green-50' : ''
                  }`}
                >
                  <Image
                    src={country.flag}
                    alt={country.name}
                    width={32}
                    height={24}
                    className="rounded object-cover"
                  />
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900">{country.name}</div>
                    <div className="text-sm text-gray-500">{country.dialCode}</div>
                  </div>
                  {selectedCountry.code === country.code && (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      className="text-[#53B175]"
                    >
                      <path
                        d="M16.6667 5L7.50004 14.1667L3.33337 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-center text-gray-500 text-sm">
                No countries found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

