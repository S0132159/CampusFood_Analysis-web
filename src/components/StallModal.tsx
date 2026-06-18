import { Stall } from '../types';
import { AIBadge } from './AIBadge';
import { X, TrendingUp, Users, Send, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface StallModalProps {
  stall: Stall;
  onClose: () => void;
}

export function StallModal({ stall, onClose }: StallModalProps) {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localCheckIns, setLocalCheckIns] = useState(stall.todayCheckIns);
  const [localReviews, setLocalReviews] = useState(stall.reviews);

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

  const handleCheckIn = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/checkins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stallId: stall.id })
      });
      if (!res.ok) throw new Error('打卡失敗');
      setLocalCheckIns(prev => prev + 1);
      alert('打卡成功！');
    } catch (err) {
      console.error(err);
      alert('無法連線到後端，打卡失敗。');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitReview = async () => {
    if (!newComment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stallId: stall.id, content: newComment })
      });
      if (!res.ok) throw new Error('評論失敗');
      const r = await res.json();
      
      let tagSentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      if (r.sentiment.includes('positive')) tagSentiment = 'positive';
      if (r.sentiment.includes('negative')) tagSentiment = 'negative';
      
      const newReviewObj = {
        id: String(r.id),
        author: "匿名同學 (你)",
        content: r.content,
        date: new Date(r.createdAt).toLocaleDateString(),
        rating: tagSentiment === 'positive' ? 5 : (tagSentiment === 'negative' ? 1 : 3),
        aiTags: [{ label: r.sentiment.split(' ')[0], sentiment: tagSentiment }]
      };
      
      setLocalReviews(prev => [newReviewObj, ...prev]);
      setNewComment('');
    } catch (err) {
      console.error(err);
      alert('無法連線到後端，留言失敗。');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Prevent scrolling on the body when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-12">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative flex flex-col lg:flex-row w-full max-w-5xl h-[85vh] max-h-[800px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-white/20 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Left Column: Data & Prediction */}
        <div className="w-full lg:w-1/2 bg-slate-50 p-6 sm:p-10 border-r border-slate-200 flex flex-col overflow-y-auto">
          <div className="mb-8 flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-6 h-6 text-rose-600" />
                <h2 className="text-2xl font-bold text-slate-900">
                  {stall.name}
                </h2>
              </div>
              <p className="text-slate-500">人流預測與打卡數據追蹤</p>
            </div>
            <button 
              onClick={handleCheckIn}
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm hover:bg-indigo-700 disabled:opacity-50 transition-colors shrink-0"
            >
              <MapPin className="w-4 h-4" />
              我要打卡
            </button>
          </div>

          {/* Check-in Chart */}
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col min-h-[300px]">
             <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-6">過去兩週人流量趨勢</h3>
             <div className="flex-1 relative -ml-4">
                 <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stall.pastTwoWeeksData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="date" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#94a3b8', fontSize: 10, fontFamily: 'monospace' }}
                      dx={-10}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                      labelStyle={{ color: '#64748b', marginBottom: '4px' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      name="打卡人次"
                      stroke="#6366f1" 
                      strokeWidth={3}
                      dot={{ r: 0 }}
                      activeDot={{ r: 6, strokeWidth: 0, fill: '#6366f1' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Big Number Stat */}
          <div className="mt-8 flex items-end justify-between">
            <div>
              <div className="text-5xl font-black text-slate-900 tracking-tighter">{localCheckIns}</div>
              <div className="text-sm text-slate-500 font-medium">今日打卡人次</div>
            </div>
            <div className="bg-rose-500 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              數據活躍
            </div>
          </div>
        </div>

        {/* Right Column: Comments & AI Analysis */}
        <div className="w-full lg:w-1/2 p-6 sm:p-10 flex flex-col justify-between overflow-hidden bg-white">
          <div className="flex justify-between items-center mb-8 shrink-0">
            <h3 className="text-xl font-bold text-slate-900">食客評論</h3>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Scrollable Comment List */}
          <div className="flex-1 space-y-6 overflow-y-auto pr-4">
             {localReviews.length === 0 ? (
               <div className="text-center text-slate-400 py-12">目前還沒有評論喔！</div>
             ) : (
               localReviews.map((review) => (
                  <div key={review.id} className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative group">
                    <div className="flex justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900">{review.author}</span>
                      <span className="text-xs text-slate-400">{review.date}</span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {review.content}
                    </p>
                    {/* AI Tags */}
                    {review.aiTags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {review.aiTags.map((tag, idx) => (
                          <AIBadge key={idx} tag={tag} />
                        ))}
                      </div>
                    )}
                  </div>
               ))
             )}
          </div>

          {/* Input Bar */}
          <div className="mt-6 flex gap-3 shrink-0">
            <input 
              type="text" 
              placeholder="我也想留言..." 
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-slate-800 placeholder-slate-400 outline-none"
            />
            <button 
              onClick={handleSubmitReview}
              disabled={isSubmitting || !newComment.trim()}
              className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send className="w-5 h-5 -rotate-45 mb-1 ml-1" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
