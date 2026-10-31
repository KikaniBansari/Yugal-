import React, { useState } from 'react';
import { Card } from '../types';
import { PHASES } from '../data/cards';
import { QrCode, Sparkles, CheckCircle2, Lock, Clock, RotateCcw } from 'lucide-react';
import { playSoftTap } from '../utils/audio';

interface PhysicalCardProps {
  card: Card;
  isActive?: boolean;
  onSelect?: (card: Card) => void;
  onScanClick?: (card: Card) => void;
  showActions?: boolean;
}

export const PhysicalCard: React.FC<PhysicalCardProps> = ({
  card,
  isActive = false,
  onSelect,
  onScanClick,
  showActions = true,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const phaseInfo = PHASES[card.phase];

  const handleFlip = (e: React.MouseEvent) => {
    e.stopPropagation();
    playSoftTap();
    setIsFlipped(!isFlipped);
  };

  const handleCardClick = () => {
    playSoftTap();
    if (onSelect) {
      onSelect(card);
    }
  };

  return (
    <div 
      className={`relative w-full max-w-[340px] mx-auto select-none transition-all duration-300 ${
        isActive ? 'scale-[1.01]' : 'hover:scale-[1.008]'
      }`}
      style={{ perspective: '1000px' }}
      onClick={handleCardClick}
    >
      <div 
        className={`relative w-full transition-transform duration-700 ease-in-out cursor-pointer ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* FRONT OF CARD */}
        <div 
          className={`w-full aspect-[3/4.2] rounded-2xl p-5 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl transition-all duration-300 ${
            card.isUnlocked
              ? isActive
                ? 'bg-[#0D1030]/95 border-[1.5px] border-[#FFB800]/40 shadow-card-active'
                : 'bg-[#0D1030]/90 border border-[rgba(201,204,224,0.14)] hover:border-[#FFB800]/30 shadow-gold-halo'
              : 'bg-[#090C21]/90 border border-white/5 opacity-70'
          }`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Ambient phase glow gradient in top corner */}
          <div 
            className="absolute -top-12 -right-12 w-36 h-36 rounded-full filter blur-2xl pointer-events-none opacity-20"
            style={{ backgroundColor: phaseInfo.color }}
          />

          {/* Sacred subtle watermarks & corner trims */}
          <div className="absolute top-2.5 left-2.5 w-2 h-2 border-t border-l border-[#FFB800]/30 pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 border-t border-r border-[#FFB800]/30 pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-2 h-2 border-b border-l border-[#FFB800]/30 pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-2 h-2 border-b border-r border-[#FFB800]/30 pointer-events-none" />

          {/* Top Header: Phase Badge & Card Number */}
          <div className="relative z-10 flex items-center justify-between">
            <div 
              className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-[0.08em] uppercase flex items-center gap-1.5 transition-all"
              style={{
                backgroundColor: phaseInfo.bgTint,
                borderColor: phaseInfo.borderColor,
                borderWidth: '1px',
                color: phaseInfo.color,
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: phaseInfo.color }} />
              {card.phase}
            </div>

            <div className="flex items-center gap-2">
              {card.completedAt ? (
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  <CheckCircle2 size={11} />
                  <span>Done</span>
                </div>
              ) : card.isUnlocked ? (
                <span className="text-[11px] font-mono tracking-wider text-[#FFB800]/80">
                  #{String(card.number).padStart(2, '0')}
                </span>
              ) : (
                <div className="flex items-center gap-1 text-[11px] text-[#C9CCE0]/50">
                  <Lock size={12} />
                  <span>Locked</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleFlip}
                title="Flip card for ritual guidance"
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/10 text-[#C9CCE0] hover:text-white transition-colors"
              >
                <RotateCcw size={12} />
              </button>
            </div>
          </div>

          {/* Card Center: Sacred Mantra & Prompt */}
          <div className="relative z-10 my-auto py-2 text-center flex flex-col items-center">
            {/* Sacred geometry symbol */}
            <div className="w-9 h-9 rounded-full border border-[#FFB800]/25 flex items-center justify-center mb-3 bg-[#04061A]/40 text-[#FFB800]">
              <Sparkles size={16} />
            </div>

            <h3 className="text-xl font-semibold text-white tracking-tight leading-snug font-['DM_Sans'] mb-2">
              {card.title}
            </h3>

            <p className="text-[14px] text-white/90 leading-relaxed max-w-[270px] font-normal font-['DM_Sans']">
              "{card.prompt}"
            </p>

            <div className="mt-3 text-[12px] italic text-[#C9CCE0]/75 max-w-[260px]">
              — {card.mantra}
            </div>
          </div>

          {/* Card Bottom: Duration & Verification Indicator */}
          <div className="relative z-10 pt-3 border-t border-[rgba(201,204,224,0.08)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#C9CCE0]/70">
              <Clock size={12} />
              <span className="text-[11px] font-medium">{card.durationMinutes} min ritual</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-[#C9CCE0]/40 tracking-wider">
                CARD {card.code}
              </span>
              <div 
                className="w-6 h-6 rounded border border-[#FFB800]/30 bg-[#04061A]/60 flex items-center justify-center text-[#FFB800]/70"
                title="Tactile QR verification stamp"
              >
                <QrCode size={13} />
              </div>
            </div>
          </div>
        </div>

        {/* BACK OF CARD (Ritual & Somatic Guidance) */}
        <div 
          className="absolute inset-0 w-full aspect-[3/4.2] rounded-2xl p-5 flex flex-col justify-between bg-[#0D1030] border-[1.5px] border-[#FFB800]/35 shadow-gold-halo backdrop-blur-xl [transform:rotateY(180deg)] overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Subtle background ornamentation */}
          <div className="absolute inset-0 bg-radial-gradient pointer-events-none opacity-10" />

          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#FFB800]">
              Ritual Box Guidance
            </span>
            <button
              type="button"
              onClick={handleFlip}
              className="p-1 rounded-full bg-white/5 hover:bg-white/10 text-[#C9CCE0]"
            >
              <RotateCcw size={12} />
            </button>
          </div>

          <div className="space-y-3 my-auto py-1 text-left">
            <div>
              <span className="text-[10px] uppercase tracking-[0.08em] text-[#C9CCE0]/60 block mb-1 font-semibold">
                Somatic Practice
              </span>
              <p className="text-[13px] text-white/90 leading-relaxed font-normal">
                {card.guidance}
              </p>
            </div>

            <div className="bg-[#04061A]/50 rounded-xl p-2.5 border border-[#FFB800]/15">
              <span className="text-[10px] uppercase tracking-[0.08em] text-[#FFB800] block mb-0.5 font-semibold">
                Sensory Task
              </span>
              <p className="text-[12px] text-[#DFE0FE]/80">
                {card.sensoryTask}
              </p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-[0.08em] text-[#C9CCE0]/60 block mb-1 font-semibold">
                Journaling Query
              </span>
              <p className="text-[12px] text-white/80 italic">
                "{card.reflectionQuestion}"
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-[#C9CCE0]/60">Physical Deck Ref.</span>
            <span className="text-[11px] font-mono text-[#FFB800]">#{card.code}</span>
          </div>
        </div>
      </div>

      {/* Optional action buttons below card if it's the active challenge */}
      {showActions && isActive && (
        <div className="mt-3 flex items-center gap-2">
          {card.completedAt ? (
            <div className="w-full py-2.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 size={14} />
              <span>Ritual Completed for Today</span>
            </div>
          ) : (
            <>
              {onScanClick && (
                <button
                  type="button"
                  onClick={() => onScanClick(card)}
                  className="flex-1 h-[48px] rounded-full bg-spectrum-gradient text-white text-[13px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-focal-glow active:scale-[0.98] transition-transform"
                >
                  <QrCode size={16} />
                  <span>Scan Physical Card</span>
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};
