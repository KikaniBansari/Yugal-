import { Card, ReflectionLog, SanctuaryUser } from '../types';
import { INITIAL_CARDS, INITIAL_REFLECTIONS } from '../data/cards';

const STORAGE_KEYS = {
  CARDS: 'ethereal_cards_v1',
  REFLECTIONS: 'ethereal_reflections_v1',
  USER: 'ethereal_user_v1',
};

const DEFAULT_USER: SanctuaryUser = {
  name: 'Banu',
  streakDays: 8,
  boxSerial: 'SANCTUARY-BOX-21-0842',
  isBoxPaired: true,
  soundEnabled: true,
  hapticEnabled: true,
  currentDay: 14,
};

export function loadCards(): Card[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CARDS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load cards from storage', e);
  }
  return INITIAL_CARDS;
}

export function saveCards(cards: Card[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save cards', e);
  }
}

export function loadReflections(): ReflectionLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REFLECTIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load reflections', e);
  }
  return INITIAL_REFLECTIONS;
}

export function saveReflections(reflections: ReflectionLog[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.REFLECTIONS, JSON.stringify(reflections));
  } catch (e) {
    console.error('Failed to save reflections', e);
  }
}

export function loadUser(): SanctuaryUser {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load user', e);
  }
  return DEFAULT_USER;
}

export function saveUser(user: SanctuaryUser): void {
  try {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  } catch (e) {
    console.error('Failed to save user', e);
  }
}

export function resetAllData(): { cards: Card[]; reflections: ReflectionLog[]; user: SanctuaryUser } {
  localStorage.removeItem(STORAGE_KEYS.CARDS);
  localStorage.removeItem(STORAGE_KEYS.REFLECTIONS);
  localStorage.removeItem(STORAGE_KEYS.USER);
  return {
    cards: INITIAL_CARDS,
    reflections: INITIAL_REFLECTIONS,
    user: DEFAULT_USER,
  };
}
