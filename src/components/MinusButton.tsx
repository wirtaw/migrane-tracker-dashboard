import React from 'react';
import { Minus } from 'lucide-react';

interface MinusButtonProps {
  onClick: () => void;
  label: string;
  id: string;
  className?: string;
}

export default function MinusButton({ onClick, label, id, className }: MinusButtonProps) {
  const classNameJoined = `flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors ${className || ''}`;
  return (
    <button id={id} onClick={onClick} className={classNameJoined}>
      <Minus className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
