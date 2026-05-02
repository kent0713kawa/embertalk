export type Category = 'らしさ' | '強み' | '挑戦' | '関係性' | '未来';
export type Tab = 'question' | 'coach' | 'reflection';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ReflectionEntry {
  id: string;
  date: string;
  moment: string;
  improvement: string;
  action: string;
}
