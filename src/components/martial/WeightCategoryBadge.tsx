import React from 'react';
import { Scale } from 'lucide-react';

interface WeightCategoryBadgeProps {
  weightKg: number;
  category?: string;
  showIcon?: boolean;
}

export const WeightCategoryBadge: React.FC<WeightCategoryBadgeProps> = ({
  weightKg,
  category,
  showIcon = true
}) => {
  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs shadow-xs">
      {showIcon && <Scale className="w-3.5 h-3.5 text-amber-500" />}
      <span className="font-mono font-bold text-zinc-900 dark:text-white">{weightKg.toFixed(1)} kg</span>
      {category && (
        <>
          <span className="text-zinc-400 dark:text-zinc-600">|</span>
          <span className="text-amber-600 dark:text-amber-400 font-medium">{category}</span>
        </>
      )}
    </div>
  );
};

