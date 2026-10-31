import React from 'react';
import { Card, ReflectionLog, SanctuaryUser } from '../types';
import { PHASES } from '../data/cards';
import { 
  Sparkles, 
  ShieldCheck, 
  Flame, 
  Wind, 
  BookMarked, 
  RotateCcw, 
  Layers, 
  Volume2, 
  Check, 
  HeartHandshake,
  Compass
} from 'lucide-react';
import { playSingingBowl, playSoftTap } from '../utils/audio';

interface ProfileViewProps {
  user: SanctuaryUser;
  cards: Card[];
  reflections: ReflectionLog[];
  onResetData: () => void;
  onJumpToDay: (day: number) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  cards,
  reflections,
  onResetData,
  onJumpToDay,
}) => {
  const completedCards = cards.filter((c) => !!c.completedAt);
  const completedCount = completedCards.length;

  return (
    <div className="space-y-6 pb-28">
      {/* Profile Header Card */}
      <div className="p-5 rounded-3xl bg-[#0D1030]/95 border border-[rgba(201,204,224,0.14)] relative overflow-hidden shadow-gold-halo">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFB800]/10 rounded-full filter blur-2xl pointer-events-none" />

        <div className="flex items-center gap-3.5 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-spectrum-gradient p-0.5 shadow-focal-glow">
            <div className="w-full h-full rounded-[14px] bg-[#04061A] flex items-center justify-center text-[#FFB800]">
              <Sparkles size={24} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-white tracking-tight font-['DM_Sans']">
                {user.name}’s Sanctuary
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-[#FFB800]/15 text-[#FFB800] text-[10px] font-semibold">
                SEEKER
              </span>
            </div>
            <p className="text-xs text-[#C9CCE0]/80 mt-0.5">
              21-Day Mindful Reset Companion
            </p>
          </div>
        </div>

        {/* Physical Box Link info */}
        <div className="mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-[#C9CCE0]">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Physical Box Edition 01:</span>
          </div>
          <span className="font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 text-[11px]">
            {user.boxSerial} (Active)
          </span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 rounded-2xl bg-[#0D1030]/80 border border-white/5 text-center">
          <div className="w-7 h-7 mx-auto rounded-full bg-[#FFB800]/10 text-[#FFB800] flex items-center justify-center mb-1">
            <Flame size={14} />
          </div>
          <span className="text-lg font-semibold text-white font-mono block">
            {user.streakDays}
          </span>
          <span className="text-[10px] text-[#C9CCE0]/60 uppercase tracking-wider">
            Day Streak
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0D1030]/80 border border-white/5 text-center">
          <div className="w-7 h-7 mx-auto rounded-full bg-[#2FA8F0]/10 text-[#2FA8F0] flex items-center justify-center mb-1">
            <Layers size={14} />
          </div>
          <span className="text-lg font-semibold text-white font-mono block">
            {completedCount}/21
          </span>
          <span className="text-[10px] text-[#C9CCE0]/60 uppercase tracking-wider">
            Cards Sealed
          </span>
        </div>

        <div className="p-3 rounded-2xl bg-[#0D1030]/80 border border-white/5 text-center">
          <div className="w-7 h-7 mx-auto rounded-full bg-[#D6469A]/10 text-[#D6469A] flex items-center justify-center mb-1">
            <BookMarked size={14} />
          </div>
          <span className="text-lg font-semibold text-white font-mono block">
            {reflections.length}
          </span>
          <span className="text-[10px] text-[#C9CCE0]/60 uppercase tracking-wider">
            Reflections
          </span>
        </div>
      </div>

      {/* Phase Spectrum Balance Matrix */}
      <div className="p-4 rounded-2xl bg-[#0D1030]/90 border border-[rgba(201,204,224,0.1)] space-y-3">
        <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#FFB800] block">
          Phase Spectrum Balance
        </span>
        <div className="space-y-2">
          {Object.entries(PHASES).map(([phaseKey, pInfo]) => {
            const phaseCards = cards.filter((c) => c.phase === phaseKey);
            const done = phaseCards.filter((c) => !!c.completedAt).length;
            const pct = Math.round((done / phaseCards.length) * 100);

            return (
              <div key={phaseKey} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-white flex items-center gap-1.5">
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: pInfo.color }}
                    />
                    {phaseKey} ({pInfo.sublabel})
                  </span>
                  <span className="font-mono text-[#C9CCE0]/70 text-[11px]">
                    {done} / {phaseCards.length}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: pInfo.color,
                      boxShadow: `0 0 6px ${pInfo.color}`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Box Calibration & Quick Jump Testing */}
      <div className="p-4 rounded-2xl bg-[#0D1030]/90 border border-white/10 space-y-3">
        <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#C9CCE0] block">
          Ritual Simulation & Quick State Jump
        </span>
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onJumpToDay(1);
            }}
            className="py-2 px-1 rounded-xl bg-[#04061A] hover:bg-[#171A3F] border border-white/10 text-[11px] text-[#C9CCE0] hover:text-white transition-colors"
          >
            Day 01 (MOVE)
          </button>
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onJumpToDay(14);
            }}
            className="py-2 px-1 rounded-xl bg-[#FFB800]/15 border border-[#FFB800]/50 text-[11px] text-[#FFB800] font-semibold"
          >
            Day 14 (Active)
          </button>
          <button
            type="button"
            onClick={() => {
              playSingingBowl(528, 2);
              onJumpToDay(21);
            }}
            className="py-2 px-1 rounded-xl bg-[#04061A] hover:bg-[#171A3F] border border-white/10 text-[11px] text-[#C9CCE0] hover:text-white transition-colors"
          >
            Day 21 (Complete)
          </button>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onResetData();
            }}
            className="w-full py-2.5 rounded-xl bg-transparent hover:bg-white/5 border border-white/10 text-xs text-[#C9CCE0]/70 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <RotateCcw size={13} />
            <span>Reset To Default Companion State</span>
          </button>
        </div>
      </div>

      {/* Philosophy Statement */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0D1030] to-[#090C21] border border-[#FFB800]/20 text-center space-y-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#FFB800]">
          Sacred Design Canon
        </span>
        <p className="text-xs text-white/90 italic font-['DM_Sans']">
          "Harmony held in balance. The digital sanctuary serves the tactile physical ritual, drawing awareness away from daylight noise into deep somatic coherence."
        </p>
      </div>
    </div>
  );
};
