import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

export function MainContent({ children, className }: MainContentProps) {
  return (
    <main className={cn("flex-1 bg-slate-50 overflow-auto", className)}>
      <div className="max-w-7xl mx-auto p-8">
        {children}
      </div>
    </main>
  );
}
