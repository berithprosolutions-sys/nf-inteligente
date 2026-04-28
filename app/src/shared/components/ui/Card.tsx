// FEATURE: UI Shared Card
// Responsabilidade: Container padronizado visualmente
import React from 'react';

export const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-card text-card-foreground rounded-[2rem] shadow-sm border border-border/50 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};
