import { Calculator, Lightbulb, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
  activeTab: 'calculator' | 'tax-tips';
  onTabChange: (tab: 'calculator' | 'tax-tips') => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ className, activeTab, onTabChange, isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={cn(
        "w-64 bg-slate-900 text-white p-6 flex flex-col fixed lg:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        className
      )}>
        {/* Close button for mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-slate-800 lg:hidden"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>

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
    </>
  );
}
