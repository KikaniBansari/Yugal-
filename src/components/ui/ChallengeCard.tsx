import React from 'react';
import { Challenge } from '../../types/yugal';
import { PHASE_CONFIG } from '../../data/yugalData';
import { PhaseTag } from './Chips';
import { Check, Lock, Play, Clock, Sparkles } from 'lucide-react';
import { playSoftTap } from '../../utils/audio';

interface ChallengeCardProps {
  challenge: Challenge;
  onClick?: (challenge: Challenge) => void;
  className?: string;
  variantOverride?: 'default' | 'locked' | 'completed';
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({
  challenge,
  onClick,
  className = '',
  variantOverride,
}) => {
  const status = variantOverride || challenge.status;
  const meta = PHASE_CONFIG[challenge.phase] || PHASE_CONFIG.CALM;

  const handleClick = () => {
    playSoftTap();
    if (onClick) onClick(challenge);
  };

  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  return (
    <div
      onClick={handleClick}
      className={`relative w-full rounded-2xl p-4 transition-all duration-200 cursor-pointer overflow-hidden ${
        isCompleted
          ? 'bg-[#0D1030]/90 border border-emerald-500/30 hover:border-emerald-500/50 shadow-gold-halo'
          : isLocked
          ? 'bg-[#090C21]/80 border border-white/5 opacity-70 hover:opacity-85'
          : 'bg-[#0D1030] border border-[#FFB800]/30 hover:border-[#FFB800]/60 shadow-gold-halo'
      } ${className}`}
    >
      {/* Ambient background glow for active/completed */}
      {!isLocked && (
        <div
          className="absolute -top-10 -right-10 w-28 h-28 rounded-full filter blur-xl pointer-events-none opacity-20"
          style={{ backgroundColor: meta.color }}
        />
      )}

      {/* Top Header: Phase Tag & Status Badge */}
      <div className="flex items-center justify-between mb-2.5 relative z-10">
        <PhaseTag
          phase={challenge.phase}
          labelOverride={`${challenge.phase} · Card ${challenge.number}`}
          size="sm"
        />

        <div className="flex items-center gap-1.5">
          {isCompleted ? (
            <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <Check size={12} className="stroke-[2.5]" />
              <span className="font-medium">Done</span>
            </div>
          ) : isLocked ? (
            <div className="flex items-center gap-1 text-[11px] text-[#C9CCE0]/50 bg-white/5 px-2 py-0.5 rounded-full">
              <Lock size={11} />
              <span>Locked</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-[#FFB800] bg-[#FFB800]/10 px-2 py-0.5 rounded-full border border-[#FFB800]/25">
              <Sparkles size={11} />
              <span>Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Title & Short Description */}
      <div className="mb-3 relative z-10">
        <h4 className="text-[15px] font-semibold text-white tracking-tight leading-snug font-['DM_Sans']">
          {challenge.title}
        </h4>
        <p className="text-xs text-[#C9CCE0]/80 mt-1 line-clamp-2 leading-relaxed">
          {challenge.shortDesc}
        </p>
      </div>

      {/* Footer: Expert info & duration */}
      <div className="flex items-center justify-between pt-2.5 border-t border-[rgba(201,204,224,0.08)] text-xs text-[#C9CCE0]/75 relative z-10">
        <div className="flex items-center gap-2">
          <img
            src={challenge.expert.avatar}
            alt={challenge.expert.name}
            className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10"
          />
          <span className="text-[11px] font-medium text-[#DFE0FE] truncate max-w-[120px]">
            {challenge.expert.name}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <Clock size={12} className="text-[#FFB800]" />
          <span>{challenge.duration}</span>
        </div>
      </div>

      {/* Locked hint note */}
      {isLocked && (
        <div className="mt-2 text-[10px] text-[#C9CCE0]/50 italic">
          Scan QR code on physical card #{challenge.number} from your Reset Box to open.
        </div>
      )}
    </div>
  );
};
