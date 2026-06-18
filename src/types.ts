export type CrowdStatus = 'busy' | 'normal' | 'free' | 'closed';

export type Sentiment = 'positive' | 'negative' | 'neutral';

export interface AITag {
  label: string;
  sentiment: Sentiment;
}

export interface Review {
  id: string;
  author: string;
  content: string;
  date: string;
  rating: number; // 1-5
  aiTags: AITag[];
}

export interface DailyCheckInData {
  date: string; // e.g. "06/01"
  count: number;
}

export interface Stall {
  id: string;
  name: string;
  status: CrowdStatus;
  todayCheckIns: number;
  pastTwoWeeksData: DailyCheckInData[];
  reviews: Review[];
}
