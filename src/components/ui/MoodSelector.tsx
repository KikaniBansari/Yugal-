import React from 'react';
import { MoodType } from '../../types/yugal';
import { playSoftTap } from '../../utils/audio';

interface MoodOption {
  type: MoodType;
  emoji: string;
  label: string;
  color: string;
}

const MOODS: MoodOption[] = [
  { type: 'Low', emoji: '🌧️', label: 'Low', color: '#9B4FB5' },
  { type: 'Tired', emoji: '🌙', label: 'Tired', color: '#2FA8F0' },
  { type: 'Okay', emoji: '🌿', label: 'Okay', color: '#68D391' },
  { type: 'Good', emoji: '☀️', label: 'Good', color: '#FFB800' },
  { type: 'Radiant', emoji: '✨', label: 'Radiant', color: '#D6469A' },
];

interface MoodSelectorProps {
  selectedMood: MoodType | null;
  onSelectMood: (mood: MoodType) => void;
  className?: string;
  compact?: boolean;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  className = '',
  compact = false,
}) => {
  return (
    <div className={`flex items-center justify-between gap-1.5 w-full ${className}`}>
      {MOODS.map((m) => {
        const isSelected = selectedMood === m.type;
        return (
          <button
            key={m.type}
            type="button"
            onClick={() => {
              playSoftTap();
              onSelectMood(m.type);
            }}
            className={`flex-1 flex flex-col items-center justify-center rounded-2xl transition-all cursor-pointer ${
              compact ? 'py-2 px-1' : 'py-3 px-1.5'
            } ${
              isSelected
                ? 'bg-[#0D1030] border border-[#FFB800]/50 shadow-[0_0_16px_rgba(255,184,0,0.18)] scale-[1.03]'
                : 'bg-[#0D1030]/60 border border-[rgba(201,204,224,0.08)] hover:border-white/20 hover:bg-[#0D1030]'
            }`}
          >
            <span className={compact ? 'text-lg mb-0.5' : 'text-2xl mb-1'}>
              {m.emoji}
            </span>
            <span
              className={`text-[11px] font-medium tracking-wide transition-colors ${
                isSelected ? 'text-white font-semibold' : 'text-[#C9CCE0]/75'
              }`}
            >
              {m.label}
            </span>
            {isSelected && (
              <span
                className="w-1 h-1 rounded-full mt-1"
                style={{ backgroundColor: m.color }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
