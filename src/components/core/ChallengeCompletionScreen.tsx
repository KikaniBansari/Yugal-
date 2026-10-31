import React from 'react';
import { Challenge, Badge } from '../../types/yugal';
import { PHASE_CONFIG } from '../../data/yugalData';
import { GlowingCircles } from '../ui/GlowingCircles';
import { Button } from '../ui/Button';
import { Sparkles, CheckCircle2, Award, ArrowRight, Shuffle, Bookmark, Share2 } from 'lucide-react';
import { playSingingBowl, playSoftTap } from '../../utils/audio';

interface ChallengeCompletionScreenProps {
  challenge: Challenge;
  badge?: Badge;
  onSeeProgress: () => void;
  onPickAnotherCard: () => void;
}

export const ChallengeCompletionScreen: React.FC<ChallengeCompletionScreenProps> = ({
  challenge,
  badge,
  onSeeProgress,
  onPickAnotherCard,
}) => {
  const meta = PHASE_CONFIG[challenge.phase] || PHASE_CONFIG.CALM;

  return (
    <div className="relative min-h-screen bg-[#04061A] text-white flex flex-col justify-between p-5 pb-10 select-none animate-in fade-in duration-500">
      {/* Background Radiance */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-[#FFB800]/15 rounded-full filter blur-3xl pointer-events-none" />

      {/* Main Celebratory Container */}
      <div className="text-center my-auto space-y-5">
        {/* Glowing Circle Reward Aura */}
        <div className="relative flex justify-center items-center my-4">
          <GlowingCircles size={200} pulsing={true} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full bg-[#0D1030] border-2 border-[#FFB800] flex items-center justify-center text-[#FFB800] shadow-focal-glow">
              <Award size={36} />
            </div>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#FFB800] block mb-1">
            SACRED SEAL COMPLETED
          </span>
          <h1 className="text-3xl font-semibold text-white tracking-tight leading-snug font-['DM_Sans']">
            Challenge completed
          </h1>
          <p className="text-xs text-[#C9CCE0] mt-1">
            Card #{challenge.number}: {challenge.title}
          </p>
        </div>

        {/* Closing Affirmation Card */}
        <div className="p-5 rounded-3xl bg-[#0D1030] border-[1.5px] border-[#FFB800]/40 shadow-card-active max-w-sm mx-auto">
          <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFB800] block mb-1.5">
            CLOSING AFFIRMATION
          </span>
          <p className="text-base font-medium text-white italic leading-relaxed font-['DM_Sans']">
            "{challenge.closingAffirmation}"
          </p>
          <span className="text-[10px] text-[#C9CCE0]/60 mt-2 block">
            Anchor this truth into your somatic memory.
          </span>
        </div>

        {/* Reward Badge Unlocked */}
        {badge && (
          <div className="p-3.5 rounded-2xl bg-[#0D1030]/80 border border-emerald-500/30 max-w-sm mx-auto flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 block">
                BADGE UNLOCKED
              </span>
              <h4 className="text-xs font-semibold text-white">
                {badge.title}
              </h4>
              <p className="text-[11px] text-[#C9CCE0]/75 line-clamp-1">
                {badge.description}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Buttons: "See Progress" and "Pick another card" */}
      <div className="space-y-2.5 pt-4 max-w-md mx-auto w-full">
        <Button
          variant="primary"
          onClick={onSeeProgress}
          icon={<ArrowRight size={16} />}
        >
          See Progress
        </Button>

        <Button
          variant="outline"
          onClick={onPickAnotherCard}
          icon={<Shuffle size={15} className="text-[#FFB800]" />}
        >
          Pick another card
        </Button>
      </div>
    </div>
  );
};
