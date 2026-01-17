import { type ReactNode } from 'react';
import { Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MainContentProps {
  children: ReactNode;
  className?: string;
  onMenuClick?: () => void;
}

export function MainContent({ children, className, onMenuClick }: MainContentProps) {
  return (
    <main className={cn("flex-1 bg-slate-50 overflow-auto", className)}>
      {/* Mobile Header with Hamburger Menu */}
      <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6 text-slate-700" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-slate-900">Grenzgänger</h1>
          <p className="text-xs text-slate-600">SG ↔️ AT Rechner</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </div>
    </main>
  );
}
