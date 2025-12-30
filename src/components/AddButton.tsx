import React from 'react';
import { Plus } from 'lucide-react';

interface IAddButtonProps {
  onClick: () => void;
  label: string;
  id: string;
  className?: string;
  icon?: React.ReactNode;
}

export default function AddButton({ onClick, label, id, className, icon }: IAddButtonProps) {
  const classNameJoined = `flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors ${className || ''}`;
  return (
    <button id={id} onClick={onClick} className={classNameJoined}>
      {icon ? icon : <Plus className="w-4 h-4" />}
      <span>{label}</span>
    </button>
  );
}
