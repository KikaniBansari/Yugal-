export type Phase = 'MOVE' | 'CALM' | 'FEEL' | 'UNDERSTAND' | 'CONNECT';

export interface Card {
  id: string;
  number: number;
  phase: Phase;
  title: string;
  mantra: string;
  prompt: string;
  guidance: string;
  sensoryTask: string;
  reflectionQuestion: string;
  durationMinutes: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  completedAt?: string;
  code: string; // 4-digit physical card code e.g. "0114"
}

export type SensoryState = 
  | 'Deep Stillness'
  | 'Grounded Vitality'
  | 'Gentle Ease'
  | 'Restless / Releasing'
  | 'Luminous Clarity';

export interface ReflectionLog {
  id: string;
  cardId: string;
  cardNumber: number;
  cardTitle: string;
  phase: Phase;
  timestamp: string;
  sensoryState: SensoryState;
  energyLevel: number; // 1 to 5
  notes: string;
  somaticLocation: string; // e.g. "Chest & Shoulders", "Belly", "Solar Plexus"
}

export interface SanctuaryUser {
  name: string;
  streakDays: number;
  boxSerial: string;
  isBoxPaired: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  currentDay: number;
}
