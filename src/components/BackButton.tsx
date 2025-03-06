import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  to?: string;
  label?: string;
}

function BackButton({ to, label = 'Back to Dashboard' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-accent-purple transition-all duration-300 mb-6"
    >
      <ArrowLeft className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" />
      <span>{label}</span>
    </button>
  );
}

export default BackButton;