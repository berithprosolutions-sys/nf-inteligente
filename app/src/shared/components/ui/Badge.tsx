// FEATURE: UI Shared Badge
// Responsabilidade: Etiqueta de status e destaque
import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'primary' | 'outline';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'info', className = '' }) => {
  const styles: Record<string, string> = {
    success: 'bg-green-100 text-green-800 border-transparent',
    warning: 'bg-yellow-100 text-yellow-800 border-transparent',
    danger: 'bg-red-100 text-red-800 border-transparent',
    info: 'bg-blue-100 text-blue-800 border-transparent',
    primary: 'bg-primary/10 text-primary border-transparent',
    outline: 'bg-transparent border-gray-200 text-gray-600 border'
  };
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 inline-flex items-center justify-center rounded-full border ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
};

