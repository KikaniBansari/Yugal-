import React from 'react';
import { Card, ReflectionLog } from '../types';
import { PHASES } from '../data/cards';
import { RadialProgressRing } from './RadialProgressRing';
import { PhysicalCard } from './PhysicalCard';
import { QrCode, Wind, Sparkles, BookOpen, Clock, HeartHandshake } from 'lucide-react';
import { playSoftTap } from '../utils/audio';

interface JourneyViewProps {
  cards: Card[];
  reflections: ReflectionLog[];
  currentCard: Card;
  userName: string;
  onOpenScanner: (card?: Card) => void;
  onSelectCard: (card: Card) => void;
  onNavigateTab: (tab: 'deck' | 'breath') => void;
}

export const JourneyView: React.FC<JourneyViewProps> = ({
  cards,
  reflections,
  currentCard,
  userName,
  onOpenScanner,
  onSelectCard,
  onNavigateTab,
}) => {
  const completedCount = cards.filter((c) => !!c.completedAt).length;
  const currentPhaseInfo = PHASES[currentCard.phase];

  // Phase completion stats
  const phaseStats = Object.keys(PHASES).map((key) => {
    const phaseKey = key as keyof typeof PHASES;
    const phaseCards = cards.filter((c) => c.phase === phaseKey);
    const completedPhaseCards = phaseCards.filter((c) => !!c.completedAt);
    return {
      phase: phaseKey,
      info: PHASES[phaseKey],
      completed: completedPhaseCards.length,
      total: phaseCards.length,
    };
  });

  return (
    <div className="space-y-7 pb-28">
      {/* 1. Header Greeting Section */}
      <section className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1030] border border-[#FFB800]/25 text-[11px] font-medium text-[#FFB800] mb-2 shadow-[0_0_12px_rgba(255,184,0,0.1)]">
          <Sparkles size={12} />
          <span>Nocturnal Sanctuary Session</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight font-['DM_Sans']">
          Harmony held in balance
        </h1>
        <p className="text-xs sm:text-sm text-[#C9CCE0] max-w-xs mx-auto mt-1 leading-relaxed">
          Welcome back, {userName}. Unplug from daylight velocity into somatic stillness.
        </p>
      </section>

      {/* 2. Radial Journey Progress Ring (0-21 Reset Meter) */}
      <section className="flex flex-col items-center">
        <RadialProgressRing
          completed={completedCount}
          total={21}
          currentPhaseColor={currentPhaseInfo.color}
          size={210}
          strokeWidth={8}
        />

        {/* Phase Spectrum Balance Pills */}
        <div className="w-full max-w-sm mt-3 px-2 grid grid-cols-5 gap-1.5 text-center">
          {phaseStats.map((item) => {
            const isCurrent = item.phase === currentCard.phase;
            return (
              <div
                key={item.phase}
                className={`p-1.5 rounded-xl border transition-all ${
                  isCurrent
                    ? 'bg-[#0D1030] border-[#FFB800]/50 shadow-[0_0_10px_rgba(255,184,0,0.15)]'
                    : 'bg-[#090C21]/70 border-white/5'
                }`}
              >
                <div
                  className="text-[9px] font-bold tracking-wider uppercase truncate"
                  style={{ color: item.info.color }}
                >
                  {item.phase}
                </div>
                <div className="text-[11px] font-mono text-white/90 mt-0.5">
                  {item.completed}/{item.total}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Today's Active Affirmation Card */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div>
            <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#FFB800] block">
              Active Challenge Card
            </span>
            <h2 className="text-lg font-medium text-white tracking-tight">
              Day {currentCard.number} of 21: {currentCard.phase}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onNavigateTab('deck');
            }}
            className="text-xs text-[#C9CCE0] hover:text-[#FFB800] flex items-center gap-1 transition-colors"
          >
            <span>All 21 Cards</span>
            <BookOpen size={13} />
          </button>
        </div>

        {/* The Tarot-proportioned physical card */}
        <PhysicalCard
          card={currentCard}
          isActive={true}
          onSelect={onSelectCard}
          onScanClick={() => onOpenScanner(currentCard)}
          showActions={true}
        />
      </section>

      {/* 4. Quick Somatic Practices Widget */}
      <section className="grid grid-cols-2 gap-3">
        <div
          onClick={() => {
            playSoftTap();
            onNavigateTab('breath');
          }}
          className="p-4 rounded-2xl bg-[#0D1030]/85 border border-[rgba(201,204,224,0.1)] hover:border-[#2FA8F0]/40 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#2FA8F0]/10 rounded-full filter blur-xl pointer-events-none" />
          <div className="w-8 h-8 rounded-xl bg-[#2FA8F0]/15 text-[#2FA8F0] flex items-center justify-center mb-2">
            <Wind size={18} />
          </div>
          <h3 className="text-xs font-semibold text-white group-hover:text-[#2FA8F0] transition-colors">
            Geometric Breath
          </h3>
          <p className="text-[11px] text-[#C9CCE0]/75 mt-0.5 leading-snug">
            4-count ocean pacer to reset heart coherence.
          </p>
        </div>

        <div
          onClick={() => {
            playSoftTap();
            onOpenScanner();
          }}
          className="p-4 rounded-2xl bg-[#0D1030]/85 border border-[rgba(201,204,224,0.1)] hover:border-[#FFB800]/40 transition-all cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#FFB800]/10 rounded-full filter blur-xl pointer-events-none" />
          <div className="w-8 h-8 rounded-xl bg-[#FFB800]/15 text-[#FFB800] flex items-center justify-center mb-2">
            <QrCode size={18} />
          </div>
          <h3 className="text-xs font-semibold text-white group-hover:text-[#FFB800] transition-colors">
            Scan Box Card
          </h3>
          <p className="text-[11px] text-[#C9CCE0]/75 mt-0.5 leading-snug">
            Align physical card stamp to log today’s seal.
          </p>
        </div>
      </section>

      {/* 5. Recent Somatic Reflections Stream */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#FFB800]">
            Recent Inscriptions
          </span>
          <span className="text-[11px] text-[#C9CCE0]/60">
            {reflections.length} Reflections
          </span>
        </div>

        {reflections.length === 0 ? (
          <div className="p-5 rounded-2xl bg-[#0D1030]/60 border border-white/5 text-center text-xs text-[#C9CCE0]/60">
            No reflections inscribed yet. Scan today's card to log your somatic observation.
          </div>
        ) : (
          <div className="space-y-2.5">
            {reflections.slice(0, 3).map((ref) => {
              const p = PHASES[ref.phase];
              return (
                <div
                  key={ref.id}
                  className="p-3.5 rounded-2xl bg-[#0D1030]/90 border border-[rgba(201,204,224,0.1)] hover:border-white/20 transition-all"
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase"
                        style={{ backgroundColor: p.bgTint, color: p.color }}
                      >
                        {ref.phase} #{ref.cardNumber}
                      </span>
                      <span className="font-medium text-white truncate max-w-[150px]">
                        {ref.cardTitle}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#C9CCE0]/60 flex items-center gap-1 font-mono">
                      <Clock size={10} />
                      {ref.timestamp}
                    </span>
                  </div>

                  <p className="text-xs text-[#DFE0FE]/90 italic font-['DM_Sans'] leading-relaxed">
                    "{ref.notes}"
                  </p>

                  <div className="mt-2 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-[#C9CCE0]">
                    <span className="flex items-center gap-1 text-[#FFB800]/90">
                      <HeartHandshake size={11} />
                      <span>{ref.sensoryState}</span>
                    </span>
                    <span className="font-mono text-[10px] text-[#C9CCE0]/60">
                      Anchor: {ref.somaticLocation}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
