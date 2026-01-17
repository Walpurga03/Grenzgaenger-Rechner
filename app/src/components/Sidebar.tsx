import { Calculator, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
  activeTab: 'calculator' | 'tax-tips';
  onTabChange: (tab: 'calculator' | 'tax-tips') => void;
}

export function Sidebar({ className, activeTab, onTabChange }: SidebarProps) {
  return (
    <aside className={cn("w-64 bg-slate-900 text-white p-6 flex flex-col", className)}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Grenzgänger</h1>
        <p className="text-sm text-slate-400">SG ↔️ AT Rechner</p>
      </div>

      <nav className="flex-1 space-y-2">
        <button
          onClick={() => onTabChange('calculator')}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left",
            activeTab === 'calculator' ? 'bg-slate-800 hover:bg-slate-700' : 'hover:bg-slate-800'
          )}
        >
          <Calculator className="w-5 h-5" />
          <span>Rechner</span>
        </button>
        <button
          onClick={() => onTabChange('tax-tips')}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors w-full text-left",
            activeTab === 'tax-tips' ? 'bg-slate-800 hover:bg-slate-700' : 'hover:bg-slate-800'
          )}
        >
          <Lightbulb className="w-5 h-5" />
          <span>Steuer-Tipps</span>
        </button>
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-700">
        <p className="text-xs text-slate-500">
          Version 1.0.0 • 17.01.2026
        </p>
      </div>
    </aside>
  );
}
