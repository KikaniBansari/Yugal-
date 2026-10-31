import React, { useState } from 'react';
import { Card } from '../types';
import { PHASES } from '../data/cards';
import { X, QrCode, RotateCcw, Sparkles, CheckCircle2, Clock, BookOpen } from 'lucide-react';
import { playSoftTap } from '../utils/audio';

interface CardDetailModalProps {
  card: Card | null;
  onClose: () => void;
  onOpenScanner: (card: Card) => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  onClose,
  onOpenScanner,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  if (!card) return null;
  const phaseInfo = PHASES[card.phase];

  const handleFlip = () => {
    playSoftTap();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-[390px] my-auto bg-[#04061A] border border-[rgba(201,204,224,0.14)] rounded-3xl p-5 text-white shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Ambient Top Glow */}
        <div
          className="absolute -top-16 -right-16 w-44 h-44 rounded-full filter blur-3xl pointer-events-none opacity-25"
          style={{ backgroundColor: phaseInfo.color }}
        />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: phaseInfo.bgTint,
                color: phaseInfo.color,
                border: `1px solid ${phaseInfo.borderColor}`,
              }}
            >
              {card.phase}
            </span>
            <span className="text-xs font-mono text-[#C9CCE0]/70">
              #{card.code}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleFlip}
              className="px-2.5 py-1 rounded-full bg-white/5 hover:bg-white/10 text-xs text-[#C9CCE0] hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw size={12} />
              <span>Flip</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#0D1030] hover:bg-white/10 text-[#C9CCE0] hover:text-white flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Card Body with 3D Flip */}
        <div className="flex-1 overflow-y-auto py-3 relative z-10" style={{ perspective: '1000px' }}>
          <div
            className={`relative w-full rounded-2xl transition-transform duration-700 ease-in-out ${
              isFlipped ? '[transform:rotateY(180deg)]' : ''
            }`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* FRONT OF CARD */}
            <div
              className="w-full aspect-[3/3.9] rounded-2xl p-5 flex flex-col justify-between bg-[#0D1030] border-[1.5px] border-[#FFB800]/40 shadow-card-active relative overflow-hidden"
              style={{ backfaceVisibility: 'hidden' }}
            >
              {/* Sacred Corner Halos */}
              <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#FFB800]/40" />
              <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#FFB800]/40" />
              <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#FFB800]/40" />
              <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#FFB800]/40" />

              <div className="flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFB800]">
                  DAY {card.number} OF 21
                </span>
                <span className="text-[11px] text-[#C9CCE0]/70 flex items-center gap-1">
                  <Clock size={12} /> {card.durationMinutes} min
                </span>
              </div>

              <div className="my-auto py-3 text-center flex flex-col items-center">
                <div className="w-10 h-10 rounded-full border border-[#FFB800]/30 flex items-center justify-center mb-2 bg-[#04061A]/50 text-[#FFB800]">
                  <Sparkles size={18} />
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-white/90 leading-relaxed font-['DM_Sans']">
                  "{card.prompt}"
                </p>
                <div className="mt-3 text-xs italic text-[#C9CCE0]/80">
                  — {card.mantra}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-[#C9CCE0]/60">Physical Deck Stamp</span>
                <div className="flex items-center gap-1.5 text-[#FFB800]">
                  <QrCode size={13} />
                  <span className="font-mono text-[11px]">QR VERIFIED</span>
                </div>
              </div>
            </div>

            {/* BACK OF CARD */}
            <div
              className="absolute inset-0 w-full aspect-[3/3.9] rounded-2xl p-5 flex flex-col justify-between bg-[#0D1030] border-[1.5px] border-[#FFB800]/40 shadow-card-active [transform:rotateY(180deg)] overflow-y-auto"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="border-b border-white/10 pb-1.5 flex items-center justify-between text-xs">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-[#FFB800]">
                  Ritual Instructions
                </span>
                <span className="text-[10px] text-[#C9CCE0]/50">Box Edition 01</span>
              </div>

              <div className="space-y-2.5 my-auto py-1 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C9CCE0]/60 font-semibold block mb-0.5">
                    Somatic Action
                  </span>
                  <p className="text-white/90 leading-relaxed">
                    {card.guidance}
                  </p>
                </div>

                <div className="bg-[#04061A]/60 rounded-xl p-2.5 border border-[#FFB800]/20">
                  <span className="text-[10px] uppercase tracking-wider text-[#FFB800] font-semibold block mb-0.5">
                    Sensory Focus
                  </span>
                  <p className="text-[#DFE0FE]/90">
                    {card.sensoryTask}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider text-[#C9CCE0]/60 font-semibold block mb-0.5">
                    Contemplation
                  </span>
                  <p className="text-white/80 italic">
                    "{card.reflectionQuestion}"
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 text-center text-[10px] text-[#C9CCE0]/60">
                Tap 'Flip' to return to card front
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 relative z-10">
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenScanner(card);
            }}
            className="w-full h-[52px] rounded-full bg-spectrum-gradient text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-coral-halo active:scale-[0.98] transition-transform"
          >
            <QrCode size={16} />
            <span>Authenticate Physical Card #{card.number}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
