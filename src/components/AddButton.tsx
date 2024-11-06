import React from 'react';
import { Plus } from 'lucide-react';

interface AddButtonProps {
  onClick: () => void;
  label: string;
}

export default function AddButton({ onClick, label }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
    >
      <Plus className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
}
