import { useState, useEffect } from 'react';
import { mockStalls } from './data';
import { StallCard } from './components/StallCard';
import { StallModal } from './components/StallModal';
import { Stall } from './types';
import { Store } from 'lucide-react';

export default function App() {
  const [selectedStall, setSelectedStall] = useState<Stall | null>(null);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // VITE_API_URL 可以在 .env 設定，若無則預設為本地端
  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stallsRes = await fetch(`${API_BASE_URL}/stalls`);
        if (!stallsRes.ok) throw new Error('API fetch failed');
        const stallsData = await stallsRes.json();
        
        const fullStalls = await Promise.all(stallsData.map(async (stall: any) => {
          // 1. 抓取擁擠度
          const crowdRes = await fetch(`${API_BASE_URL}/stalls/${stall.id}/crowd-level`);
          const crowdData = await crowdRes.json();
          let status: 'busy' | 'normal' | 'free' | 'closed' = 'normal';
          if (crowdData.crowdLevel.includes('非常忙碌') || crowdData.crowdLevel.includes('忙碌')) status = 'busy';
          else if (crowdData.crowdLevel.includes('空閒')) status = 'free';

          // 2. 抓取評論
          const reviewsRes = await fetch(`${API_BASE_URL}/stalls/${stall.id}/reviews`);
          const reviewsData = await reviewsRes.json();
          const mappedReviews = reviewsData.map((r: any) => {
             let tagSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
             if (r.sentiment.includes('positive')) tagSentiment = 'positive';
             if (r.sentiment.includes('negative')) tagSentiment = 'negative';
             return {
               id: String(r.id),
               author: "匿名同學",
               content: r.content,
               date: new Date(r.createdAt).toLocaleDateString(),
               rating: tagSentiment === 'positive' ? 5 : (tagSentiment === 'negative' ? 1 : 3),
               aiTags: [{ label: r.sentiment.split(' ')[0], sentiment: tagSentiment }] // 簡單取情緒標籤
             };
          });

          // 保留 mockStalls 裡面的假資料圖表與狀態（依據使用者要求，SQL 缺少人流數據時改用假資料）
          const mockMatch = mockStalls.find(m => m.name === stall.name);

          return {
            id: String(stall.id),
            name: stall.name,
            status: mockMatch ? mockMatch.status : 'normal', // 強制使用前端假資料狀態
            todayCheckIns: mockMatch ? mockMatch.todayCheckIns : Math.floor(Math.random() * 100),
            pastTwoWeeksData: mockMatch ? mockMatch.pastTwoWeeksData : [], // 強制使用前端假資料圖表
            reviews: mappedReviews.length > 0 ? mappedReviews : (mockMatch ? mockMatch.reviews : [])
          };
        }));

        setStalls(fullStalls);
        setIsLoading(false);
      } catch (err) {
        console.error('無法連線到後端，改用本地假資料測試 UI:', err);
        setStalls(mockStalls); // 斷線時自動退回使用假資料
        setIsLoading(false);
      }
    };

    fetchData();
  }, [API_BASE_URL]);

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
          {isLoading ? (
            <div className="col-span-full flex justify-center py-12 text-slate-500">載入中...</div>
          ) : stalls.length > 0 ? (
            stalls.map((stall) => (
              <StallCard 
                key={stall.id} 
                stall={stall} 
                onClick={(s) => setSelectedStall(s)} 
              />
            ))
          ) : (
            <div className="col-span-full flex justify-center py-12 text-slate-500">找不到攤位資料或無法連線到伺服器</div>
          )}
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
          <span>總攤位數: {isLoading ? '...' : stalls.length}</span>
          <span>當前連線用戶: {totalConnectedUsers.toLocaleString()}</span>
        </div>
        <div>© 2023 Campus Food Management System - Design Preview v1.2</div>
      </footer>
    </div>
  );
}
