export type Tab = 'check' | 'result' | 'reflect';

export interface CheckAnswers {
  q1: number | null;
  q2: number | null;
  q3: number | null;
}

export interface DiagnosisResult {
  type: string;
  message: string;
  action: string;
}

export interface ReflectEntry {
  id: string;
  date: string;
  memo: string;
}
