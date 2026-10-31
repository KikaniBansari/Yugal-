import React, { useState } from 'react';
import { Card, Phase } from '../types';
import { PHASES } from '../data/cards';
import { PhysicalCard } from './PhysicalCard';
import { Search, Filter, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { playSoftTap } from '../utils/audio';

interface DeckViewProps {
  cards: Card[];
  onSelectCard: (card: Card) => void;
  onOpenScanner: (card?: Card) => void;
}

type FilterOption = 'ALL' | Phase;

export const DeckView: React.FC<DeckViewProps> = ({
  cards,
  onSelectCard,
  onOpenScanner,
}) => {
  const [selectedPhase, setSelectedPhase] = useState<FilterOption>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filterPhases: FilterOption[] = ['ALL', 'MOVE', 'CALM', 'FEEL', 'UNDERSTAND', 'CONNECT'];

  const filteredCards = cards.filter((card) => {
    const matchesPhase = selectedPhase === 'ALL' || card.phase === selectedPhase;
    const matchesSearch =
      card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.code.includes(searchQuery) ||
      String(card.number) === searchQuery;
    return matchesPhase && matchesSearch;
  });

  const completedCount = cards.filter((c) => !!c.completedAt).length;

  return (
    <div className="space-y-5 pb-28">
      {/* Deck Header */}
      <div className="pt-2">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-[0.14em] font-semibold text-[#FFB800]">
              Tactile Ritual Deck
            </span>
            <h1 className="text-2xl font-semibold text-white tracking-tight font-['DM_Sans']">
              21 Physical Affirmations
            </h1>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono text-[#FFB800] block">
              {completedCount}/21 Completed
            </span>
            <span className="text-[10px] text-[#C9CCE0]/60">Physical Box Edition 01</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#C9CCE0]/50">
          <Search size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by title, prompt, or #number..."
          className="w-full h-[44px] rounded-2xl bg-[#0D1030] pl-10 pr-4 text-xs text-white placeholder-[#C9CCE0]/50 border border-[rgba(201,204,224,0.12)] focus:border-[#FFB800] outline-none transition-colors"
        />
      </div>

      {/* Phase Filter Chips (Design Token 5) */}
      {/* Height 34px, rounded-full. Resting #0D1030 with muted text. Active: 15% opacity phase color, solid phase border, bright phase text */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterPhases.map((phase) => {
          const isActive = selectedPhase === phase;
          let activeStyles = {
            backgroundColor: 'rgba(255, 184, 0, 0.15)',
            borderColor: '#FFB800',
            color: '#FFB800',
          };

          if (phase !== 'ALL') {
            const pInfo = PHASES[phase as Phase];
            activeStyles = {
              backgroundColor: pInfo.bgTint,
              borderColor: pInfo.color,
              color: pInfo.color,
            };
          }

          return (
            <button
              key={phase}
              type="button"
              onClick={() => {
                playSoftTap();
                setSelectedPhase(phase);
              }}
              style={isActive ? activeStyles : {}}
              className={`h-[34px] px-3.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'border shadow-[0_0_10px_rgba(255,184,0,0.1)] font-semibold'
                  : 'bg-[#0D1030] text-[#C9CCE0] border border-[rgba(201,204,224,0.1)] hover:border-white/20'
              }`}
            >
              {phase !== 'ALL' && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: PHASES[phase as Phase].color,
                  }}
                />
              )}
              <span>{phase}</span>
            </button>
          );
        })}
      </div>

      {/* Cards Count / Description */}
      <div className="flex items-center justify-between text-xs text-[#C9CCE0]/70 px-1">
        <span>
          Showing {filteredCards.length} of 21 ritual cards
        </span>
        <span className="text-[11px] italic">
          Tap card to inspect & flip
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {filteredCards.map((card) => {
          return (
            <div key={card.id} className="relative group">
              <PhysicalCard
                card={card}
                isActive={card.number === 14}
                onSelect={onSelectCard}
                onScanClick={onOpenScanner}
                showActions={false}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
