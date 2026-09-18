import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface TechniqueItem {
  id: string;
  name: string;
  category: string;
  isMastered: boolean;
}

interface TechniqueChecklistProps {
  title: string;
  subtitle?: string;
  techniques: TechniqueItem[];
  onToggle?: (id: string) => void;
  readOnly?: boolean;
}

export const TechniqueChecklist: React.FC<TechniqueChecklistProps> = ({
  title,
  subtitle,
  techniques,
  onToggle,
  readOnly = false
}) => {
  const masteredCount = techniques.filter(t => t.isMastered).length;
  const percentage = Math.round((masteredCount / (techniques.length || 1)) * 100);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="font-bold text-zinc-900 dark:text-white text-sm">{title}</h4>
          {subtitle && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className="text-right">
          <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
            {masteredCount}/{techniques.length} ({percentage}%)
          </span>
        </div>
      </div>

      <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mb-4">
        <div
          className="bg-amber-500 h-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {techniques.map(t => (
          <button
            key={t.id}
            type="button"
            disabled={readOnly}
            onClick={() => onToggle && onToggle(t.id)}
            className={`flex items-center justify-between p-2.5 rounded-xl border text-left text-xs transition ${
              t.isMastered
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200'
                : 'bg-zinc-50 dark:bg-zinc-950/60 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
            } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          >
            <div className="flex items-center gap-2">
              {t.isMastered ? (
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0" />
              ) : (
                <Circle className="w-4 h-4 text-zinc-400 dark:text-zinc-600 shrink-0" />
              )}
              <span className={t.isMastered ? 'font-semibold text-zinc-900 dark:text-white' : ''}>{t.name}</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-400">
              {t.category}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

