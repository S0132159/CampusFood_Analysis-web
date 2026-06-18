import { useState } from 'react';
import { mockStalls } from './data';
import { StallCard } from './components/StallCard';
import { StallModal } from './components/StallModal';
import { Stall } from './types';
import { Store } from 'lucide-react';

export default function App() {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);

  const totalConnectedUsers = Math.floor(Math.random() * 2000) + 1000;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans overflow-hidden text-slate-800">
      
      {/* Navigation Header */}
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <Store className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Campus Food Pulse <span className="text-slate-400 font-normal">| 校園美食人流預測</span>
          </h1>
        </div>
        <div className="flex gap-4 text-sm font-medium items-center">
          <span className="flex items-center gap-1.5 text-green-600">
            <span className="w-2 h-2 rounded-full bg-green-600"></span> 系統正常
          </span>
          <span className="text-slate-400">
            {new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' })}
          </span>
        </div>
      </header>

      {/* Main Content Area (Background Grid) */}
      <main className="flex-1 p-8 relative overflow-y-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">
            今天想吃什麼？
          </h2>
          <p className="text-slate-500">
            查看目前攤位人潮與最新同學評價，避免踩雷與久候。
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {mockStalls.map((stall) => (
            <StallCard 
              key={stall.id} 
              stall={stall} 
              onClick={(s) => setSelectedStall(s)} 
            />
          ))}
        </div>
      </main>

      {/* Modal Overlay */}
      {selectedStall && (
        <StallModal 
          stall={selectedStall} 
          onClose={() => setSelectedStall(null)} 
        />
      )}
      
      {/* Footer Status Bar */}
      <footer className="bg-white border-t border-slate-200 px-8 py-3 text-[11px] text-slate-400 flex justify-between items-center shrink-0">
        <div className="flex gap-6">
          <span>總攤位數: {mockStalls.length}</span>
          <span>當前連線用戶: {totalConnectedUsers.toLocaleString()}</span>
        </div>
        <div>© 2023 Campus Food Management System - Design Preview v1.2</div>
      </footer>
    </div>
  );
}
