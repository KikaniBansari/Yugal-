import React, { useState } from 'react';
import { Badge, Phase } from '../../types/yugal';
import { INITIAL_BADGES, PHASE_CONFIG } from '../../data/yugalData';
import { X, Award, Check, Lock, Sparkles, Footprints, Waves, Eye, Sun, Wind, Coffee, Flame, Heart, Shield, BookMarked, Crown } from 'lucide-react';
import { playSoftTap } from '../../utils/audio';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges?: Badge[];
}

const BADGE_ICONS: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Footprints,
  Waves,
  Eye,
  Sun,
  Wind,
  Coffee,
  Flame,
  Heart,
  Sparkles,
  Shield,
  BookMarked,
  Crown,
};

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  badges = INITIAL_BADGES,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'earned' | 'in_progress' | 'locked'>('ALL');

  if (!isOpen) return null;

  const filteredBadges = badges.filter((b) => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  const earnedCount = badges.filter((b) => b.status === 'earned').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-[#04061A] border border-[rgba(201,204,224,0.15)] rounded-3xl p-5 text-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFB800]">
              RESET BOX REWARDS
            </span>
            <h3 className="text-base font-semibold text-white">
              Badges & Milestones ({earnedCount}/{badges.length})
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0D1030] flex items-center justify-center text-[#C9CCE0]"
          >
            <X size={16} />
          </button>
        </div>

        {/* Filter Chips */}
        <div className="py-2.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {(['ALL', 'earned', 'in_progress', 'locked'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => {
                playSoftTap();
                setFilter(st);
              }}
              className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all cursor-pointer ${
                filter === st
                  ? 'bg-spectrum-gradient text-white font-semibold'
                  : 'bg-[#0D1030] text-[#C9CCE0] border border-white/5'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Badges Grid (12 Badges) */}
        <div className="flex-1 overflow-y-auto py-2 grid grid-cols-2 gap-3 pr-1">
          {filteredBadges.map((badge) => {
            const IconComp = BADGE_ICONS[badge.iconName] || Award;
            const isEarned = badge.status === 'earned';
            const isInProgress = badge.status === 'in_progress';

            return (
              <div
                key={badge.id}
                className={`p-3.5 rounded-2xl flex flex-col justify-between text-left transition-all ${
                  isEarned
                    ? 'bg-[#0D1030] border border-[#FFB800]/40 shadow-gold-halo'
                    : isInProgress
                    ? 'bg-[#0D1030]/80 border border-[#2FA8F0]/40'
                    : 'bg-[#090C21]/60 border border-white/5 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      isEarned
                        ? 'bg-spectrum-gradient text-white shadow-focal-glow'
                        : isInProgress
                        ? 'bg-[#2FA8F0]/20 text-[#2FA8F0]'
                        : 'bg-white/5 text-[#C9CCE0]/40'
                    }`}
                  >
                    <IconComp size={18} />
                  </div>

                  <span
                    className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                      isEarned
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : isInProgress
                        ? 'text-[#FFB800] bg-[#FFB800]/10'
                        : 'text-[#C9CCE0]/40'
                    }`}
                  >
                    {isEarned ? 'EARNED' : isInProgress ? 'IN PROGRESS' : 'LOCKED'}
                  </span>
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-white leading-tight">
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-[#C9CCE0]/75 mt-1 leading-snug line-clamp-2">
                    {badge.description}
                  </p>
                </div>

                {badge.earnedDate && (
                  <span className="text-[9px] text-[#FFB800]/80 font-mono mt-2 block">
                    Earned on {badge.earnedDate}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
