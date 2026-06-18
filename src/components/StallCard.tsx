import React from 'react';
import { Stall } from '../types';
import { cn } from '../lib/utils';

interface StallCardProps {
  key?: React.Key;
  stall: Stall;
  onClick: (stall: Stall) => void;
}

export function StallCard({ stall, onClick }: StallCardProps) {
  const getStatusConfig = () => {
    switch (stall.status) {
      case 'busy':
        return { 
          bg: 'bg-rose-50', 
          border: 'border-rose-400 ring-4 ring-rose-100',
          badgeText: 'text-white',
          badgeBg: 'bg-rose-500',
          label: '忙碌中'
        };
      case 'normal':
        return { 
          bg: 'bg-amber-50', 
          border: 'border-amber-200',
          badgeText: 'text-white',
          badgeBg: 'bg-amber-400',
          label: '普通'
        };
      case 'free':
        return { 
          bg: 'bg-emerald-50', 
          border: 'border-emerald-200',
          badgeText: 'text-white',
          badgeBg: 'bg-emerald-500',
          label: '空閒'
        };
      case 'closed':
        return { 
          bg: 'bg-white', 
          border: 'border-slate-200',
          badgeText: 'text-slate-500',
          badgeBg: 'bg-slate-100',
          label: '休息中'
        };
    }
  };

  const config = getStatusConfig();

  return (
    <div
      onClick={() => onClick(stall)}
      className={cn(
        "aspect-square rounded-2xl flex flex-col items-center justify-center gap-3 shadow-sm cursor-pointer transition-all hover:-translate-y-1 relative group",
        config.bg,
        config.border ? `border-2 ${config.border}` : ''
      )}
    >
      <span className="text-lg font-bold text-slate-800">{stall.name}</span>
      <span className={cn("px-3 py-1 rounded-full text-xs font-semibold", config.badgeBg, config.badgeText)}>
        {config.label}
      </span>
    </div>
  );
}
