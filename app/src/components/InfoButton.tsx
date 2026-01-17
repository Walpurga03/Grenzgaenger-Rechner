import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface InfoButtonProps {
  onClick: () => void;
  className?: string;
}

export function InfoButton({ onClick, className }: InfoButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 rounded-full",
        "bg-blue-100 text-blue-600 hover:bg-blue-200",
        "transition-colors duration-200",
        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
        className
      )}
      aria-label="Weitere Informationen"
    >
      <Info className="w-3.5 h-3.5" />
    </button>
  );
}
