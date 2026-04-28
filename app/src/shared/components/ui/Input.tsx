// FEATURE: UI Shared Input
// Responsabilidade: Input genérico acessível
// NÃO faz: Tratamento explícito de submissões
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const Input: React.FC<InputProps> = React.forwardRef<HTMLInputElement, InputProps>(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground ml-1">{label}</label>
      <input
        ref={ref}
        className={`px-4 py-3.5 border-2 rounded-2xl transition-all focus:outline-none focus:ring-4 focus:ring-primary/10 bg-muted/30 text-foreground font-medium placeholder:text-muted-foreground/50 ${error ? 'border-destructive' : 'border-border focus:border-primary'}`}
        {...props}
      />
      {error && <span className="text-[10px] font-bold text-destructive mt-0.5 ml-1">{error}</span>}
    </div>
  );
});
Input.displayName = 'Input';
