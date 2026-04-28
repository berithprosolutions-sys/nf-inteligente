// FEATURE: UI Shared Button
// Responsabilidade: Componente padronizado de botão da marca
// NÃO faz: Lógicas de negócio
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'link';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  isLoading, 
  size = 'md',
  children, 
  className = '', 
  ...props 
}) => {
  const baseClasses = 'font-display font-black rounded-2xl transition-all flex items-center justify-center active:scale-95 disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-tighter';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-5 py-3.5 text-xs',
    lg: 'px-8 py-5 text-sm',
  };

  const variants = {
    primary: 'bg-primary text-primary-foreground shadow-xl shadow-primary/20 hover:brightness-110',
    secondary: 'bg-secondary text-secondary-foreground shadow-md hover:bg-secondary/80',
    outline: 'border-2 border-border text-foreground hover:bg-muted bg-transparent',
    danger: 'bg-destructive text-destructive-foreground hover:bg-red-600 shadow-lg shadow-destructive/20',
    ghost: 'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
    link: 'bg-transparent text-primary hover:underline p-0 h-auto font-black underline-offset-4'
  };

  return (
    <button 
      className={`${baseClasses} ${sizeClasses[size]} ${variants[variant]} ${isLoading ? 'opacity-70 cursor-not-allowed' : ''} ${className}`} 
      disabled={isLoading || props.disabled} 
      {...props}
    >
      {isLoading && <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full mr-2"></span>}
      {children}
    </button>
  );
};

