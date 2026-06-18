import { Stall, Review, DailyCheckInData, AITag } from './types';

// Helper to generate past two weeks mock data
const generatePastTwoWeeksData = (baseCount: number, variance: number): DailyCheckInData[] => {
  const data: DailyCheckInData[] = [];
  const today = new Date();
  
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = `${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getDate().toString().padStart(2, '0')}`;
    
    // Weekend drop off (0 is Sunday, 6 is Saturday)
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    let count = baseCount + Math.floor(Math.random() * variance * 2) - variance;
    if (isWeekend) {
      count = Math.floor(count * 0.2); // much fewer people on weekends
    }
    
    data.push({
      date: dateStr,
      count: Math.max(0, count),
    });
  }
  return data;
};

// Common AI Tags
const tagDelicious: AITag = { label: '好吃', sentiment: 'positive' };
const tagFriendly: AITag = { label: '親切', sentiment: 'positive' };
const tagCostEffective: AITag = { label: '划算', sentiment: 'positive' };
const tagWaitTooLong: AITag = { label: '等很久', sentiment: 'negative' };
const tagBadAttitude: AITag = { label: '態度不佳', sentiment: 'negative' };
const tagSmallPortion: AITag = { label: '份量變少', sentiment: 'negative' };

export const mockStalls: Stall[] = [
  {
    id: 's1',
    name: '1號 阿姨乾麵',
    status: 'busy',
    todayCheckIns: 142,
    pastTwoWeeksData: generatePastTwoWeeksData(150, 40),
    reviews: [
      {
        id: 'r1',
        author: '資工系 同學A',
        content: '中午人真的太多了，等太久了！雖然阿姨態度很好，但上課差點遲到。',
        date: '2023-10-15',
        rating: 3,
        aiTags: [tagWaitTooLong, tagFriendly]
      },
      {
        id: 'r2',
        author: '企管系 同學B',
        content: '麻醬麵好吃，CP值高很划算。',
        date: '2023-10-12',
        rating: 5,
        aiTags: [tagDelicious, tagCostEffective]
      },
      {
        id: 'r3',
        author: '機電系 同學C',
        content: '之前點大碗的覺得份量變少了，希望能改進，而且結帳時態度不好。',
        date: '2023-10-10',
        rating: 2,
        aiTags: [tagSmallPortion, tagBadAttitude]
      }
    ]
  },
  {
    id: 's2',
    name: '2號 豪大雞排',
    status: 'normal',
    todayCheckIns: 85,
    pastTwoWeeksData: generatePastTwoWeeksData(80, 20),
    reviews: [
      {
        id: 'r4',
        author: '外語系 同學D',
        content: '剛炸好的雞排真的超級好吃！老闆娘超親切，還送我小份薯條。',
        date: '2023-10-16',
        rating: 5,
        aiTags: [tagDelicious, tagFriendly]
      },
      {
        id: 'r5',
        author: '財金系 同學E',
        content: '人少的時候去不用等，還不錯。',
        date: '2023-10-14',
        rating: 4,
        aiTags: []
      }
    ]
  },
  {
    id: 's3',
    name: '3號 陽光早餐',
    status: 'closed',
    todayCheckIns: 50,
    pastTwoWeeksData: generatePastTwoWeeksData(200, 30),
    reviews: [
      {
        id: 'r6',
        author: '物理系 同學F',
        content: '早餐時段人爆炸多，但阿姨動作很快。卡拉雞腿堡好吃！',
        date: '2023-10-16',
        rating: 4,
        aiTags: [tagDelicious]
      },
      {
        id: 'r7',
        author: '數學系 同學G',
        content: '下午去的時候已經關門了，白跑一趟。希望可以開晚一點。',
        date: '2023-10-15',
        rating: 3,
        aiTags: []
      }
    ]
  },
  {
    id: 's4',
    name: '4號 韓式拌飯',
    status: 'free',
    todayCheckIns: 12,
    pastTwoWeeksData: generatePastTwoWeeksData(40, 15),
    reviews: [
      {
        id: 'r8',
        author: '公衛系 同學H',
        content: '價格有點貴，但是石鍋拌飯真的很好吃。平常人不多不用等。',
        date: '2023-10-11',
        rating: 4,
        aiTags: [tagDelicious]
      },
      {
        id: 'r9',
        author: '醫學系 同學I',
        content: '配菜給得很少，份量變少，而且老闆娘臉很臭態度不佳。',
        date: '2023-10-08',
        rating: 1,
        aiTags: [tagSmallPortion, tagBadAttitude]
      }
    ]
  },
  {
    id: 's5',
    name: '5號 鮮果冰飲',
    status: 'busy',
    todayCheckIns: 210,
    pastTwoWeeksData: generatePastTwoWeeksData(180, 50),
    reviews: [
      {
        id: 'r10',
        author: '社工系 同學J',
        content: '夏天買一杯西瓜汁超爽，便宜又划算！老闆態度親切。',
        date: '2023-10-16',
        rating: 5,
        aiTags: [tagCostEffective, tagFriendly]
      },
      {
        id: 'r11',
        author: '歷史系 同學K',
        content: '中午買飲料要等超級久！整整等了20分鐘！',
        date: '2023-10-15',
        rating: 2,
        aiTags: [tagWaitTooLong]
      }
    ]
  }
];
