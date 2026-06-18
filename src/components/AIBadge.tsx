import React from 'react';
import { AITag } from '../types';
import { cn } from '../lib/utils';

interface AIBadgeProps {
  key?: React.Key;
  tag: AITag;
}

export function AIBadge({ tag }: AIBadgeProps) {
  const isPositive = tag.sentiment === 'positive';
  const isNegative = tag.sentiment === 'negative';

  return (
    <span
      className={cn(
        "px-2 py-1 text-[10px] font-bold rounded uppercase flex items-center",
        isPositive && "bg-emerald-100 text-emerald-600",
        isNegative && "bg-rose-100 text-rose-600",
        !isPositive && !isNegative && "bg-blue-100 text-blue-600"
      )}
    >
      {isPositive ? 'AI 正面:' : isNegative ? 'AI 負面:' : 'AI 標籤:'} {tag.label}
    </span>
  );
}
