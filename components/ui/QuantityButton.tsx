import type React from 'react';

interface QuantityButtonProps {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export const QuantityButton: React.FC<QuantityButtonProps> = ({
  quantity,
  onIncrement,
  onDecrement,
}) => {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDecrement}
        className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center"
        aria-label="Decrease quantity"
      >
        -
      </button>
      <span className="w-6 text-center text-sm font-semibold">{quantity}</span>
      <button
        type="button"
        onClick={onIncrement}
        className="w-8 h-8 rounded-full bg-[#53B175] text-white flex items-center justify-center"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
};

