import React from 'react';
import { Challenge, Expert } from '../../types/yugal';
import { PHASE_CONFIG } from '../../data/yugalData';
import { PhaseTag, AttributeChip } from '../ui/Chips';
import { GlowingCircles } from '../ui/GlowingCircles';
import { Button } from '../ui/Button';
import { Clock, Shield, Sparkles, CheckCircle2, ChevronLeft, ArrowRight, Play } from 'lucide-react';
import { playSoftTap } from '../../utils/audio';

interface ChallengeUnlockedScreenProps {
  challenge: Challenge;
  onBeginChallenge: () => void;
  onOpenExpertProfile: (expert: Expert) => void;
  onBack: () => void;
}

export const ChallengeUnlockedScreen: React.FC<ChallengeUnlockedScreenProps> = ({
  challenge,
  onBeginChallenge,
  onOpenExpertProfile,
  onBack,
}) => {
  const meta = PHASE_CONFIG[challenge.phase] || PHASE_CONFIG.CALM;

  return (
    <div className="relative min-h-screen bg-[#04061A] text-white flex flex-col justify-between p-4 pb-28 select-none animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="relative z-20 flex items-center justify-between pt-2 pb-1">
        <button
          type="button"
          onClick={() => {
            playSoftTap();
            onBack();
          }}
          className="w-9 h-9 rounded-full bg-[#0D1030] border border-white/10 flex items-center justify-center text-[#C9CCE0] hover:text-white cursor-pointer"
        >
          <ChevronLeft size={18} />
        </button>

        <span className="text-xs font-mono text-[#FFB800] tracking-wider uppercase">
          CARD #{challenge.code}
        </span>

        <div className="w-9 h-9" />
      </div>

      {/* Main Body */}
      <div className="space-y-4 pt-1">
        {/* Phase Tag ("CALM, Phase 2") */}
        <div className="flex justify-center">
          <PhaseTag
            phase={challenge.phase}
            labelOverride={`${challenge.phase}, Phase ${challenge.phaseNumber}`}
          />
        </div>

        {/* Large Glowing Illustration */}
        <div className="relative my-3 flex justify-center items-center">
          <GlowingCircles size={180} pulsing={true} />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-[#0D1030]/80 border-2 border-[#FFB800]/50 flex items-center justify-center text-[#FFB800] shadow-focal-glow">
              <Sparkles size={28} />
            </div>
          </div>
        </div>

        {/* Challenge Name */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight leading-snug font-['DM_Sans']">
            {challenge.title}
          </h1>

          {/* Tappable Expert Photo and Name */}
          <div
            onClick={() => {
              playSoftTap();
              onOpenExpertProfile(challenge.expert);
            }}
            className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-[#0D1030] border border-[rgba(201,204,224,0.12)] hover:border-[#FFB800]/50 cursor-pointer transition-all shadow-gold-halo group"
          >
            <img
              src={challenge.expert.avatar}
              alt={challenge.expert.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20"
            />
            <span className="text-xs text-[#DFE0FE] font-medium group-hover:text-[#FFB800] transition-colors">
              Led by {challenge.expert.name}
            </span>
            <span className="text-[10px] text-[#C9CCE0]/60">· {challenge.expert.role}</span>
          </div>
        </div>

        {/* Short Description (Prominent) */}
        <div className="p-4 rounded-2xl bg-[#0D1030] border border-[rgba(201,204,224,0.12)] shadow-gold-halo">
          <p className="text-sm text-white/95 leading-relaxed font-normal text-center sm:text-left">
            "{challenge.shortDesc}"
          </p>
        </div>

        {/* Chips (12 min, Gentle, No equipment) */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <AttributeChip
            label={challenge.duration}
            icon={<Clock size={13} />}
          />
          <AttributeChip
            label={challenge.intensity}
            icon={<Sparkles size={13} />}
          />
          <AttributeChip
            label={challenge.equipment}
            icon={<Shield size={13} />}
          />
        </div>

        {/* "What you'll work on" list of 3 points */}
        <div className="p-4 rounded-2xl bg-[#0D1030]/80 border border-white/5 space-y-2.5">
          <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#FFB800] block">
            What you'll work on
          </span>
          <div className="space-y-2">
            {challenge.learningPoints.map((point, i) => (
              <div key={i} className="flex items-start gap-2.5 text-xs text-[#DFE0FE]/90">
                <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 size={12} />
                </div>
                <span className="leading-snug">{point}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pinned "Begin Challenge" Button */}
      <div className="fixed bottom-0 inset-x-0 z-40 p-4 pb-safe bg-gradient-to-t from-[#04061A] via-[#04061A]/95 to-transparent flex justify-center">
        <div className="w-full max-w-md">
          <Button
            variant="primary"
            onClick={onBeginChallenge}
            icon={<Play size={16} className="fill-current" />}
          >
            Begin Challenge
          </Button>
        </div>
      </div>
    </div>
  );
};
