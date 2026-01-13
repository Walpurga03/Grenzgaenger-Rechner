import { Calculator, FileText, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("w-64 bg-slate-900 text-white p-6 flex flex-col", className)}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Grenzgänger</h1>
        <p className="text-sm text-slate-400">SG ↔️ AT Rechner</p>
      </div>

      <nav className="flex-1 space-y-2">
        <a
          href="#calculator"
          className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <Calculator className="w-5 h-5" />
          <span>Rechner</span>
        </a>
        <a
          href="#report"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span>PDF-Export</span>
        </a>
        <a
          href="#info"
          className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <Info className="w-5 h-5" />
          <span>Informationen</span>
        </a>
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-700">
        <p className="text-xs text-slate-500">
          Version 1.0.0 • 13.01.2026
        </p>
      </div>
    </aside>
  );
}
