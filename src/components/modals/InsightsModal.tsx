import React, { useState } from 'react';
import { HealthMetric } from '../../types/yugal';
import { INITIAL_HEALTH_METRICS } from '../../data/yugalData';
import { X, TrendingUp, TrendingDown, Moon, Smile, Zap, Activity, Calendar } from 'lucide-react';
import { playSoftTap } from '../../utils/audio';

interface InsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
  metrics?: HealthMetric[];
}

export const InsightsModal: React.FC<InsightsModalProps> = ({
  isOpen,
  onClose,
  metrics = INITIAL_HEALTH_METRICS,
}) => {
  const [period, setPeriod] = useState<'Week' | 'Month'>('Week');
  const [showEmptyState, setShowEmptyState] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md select-none">
      <div className="relative w-full max-w-md bg-[#04061A] border border-[rgba(201,204,224,0.15)] rounded-3xl p-5 text-white shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFB800]">
              SOMATIC EQUILIBRIUM
            </span>
            <h3 className="text-base font-semibold text-white">
              Health & Restorative Insights
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

        {/* Week / Month Toggle */}
        <div className="py-3 flex items-center justify-between">
          <div className="p-1 rounded-full bg-[#0D1030] border border-white/10 inline-flex">
            {(['Week', 'Month'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  playSoftTap();
                  setPeriod(p);
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  period === p
                    ? 'bg-spectrum-gradient text-white shadow-coral-halo'
                    : 'text-[#C9CCE0] hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setShowEmptyState(!showEmptyState)}
            className="text-[11px] text-[#C9CCE0]/60 underline hover:text-white"
          >
            {showEmptyState ? 'Show sample trends' : 'Test empty state'}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
          {showEmptyState ? (
            /* EMPTY STATE */
            <div className="p-8 rounded-3xl bg-[#0D1030]/60 border border-white/5 text-center space-y-3 my-6">
              <div className="w-12 h-12 rounded-full bg-[#FFB800]/15 text-[#FFB800] mx-auto flex items-center justify-center">
                <Activity size={22} />
              </div>
              <h4 className="text-sm font-semibold text-white">
                No Trends Yet
              </h4>
              <p className="text-xs text-[#C9CCE0] max-w-xs mx-auto leading-relaxed">
                Check in for a few days and your somatic trends will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* TILE 1: MOOD (1-5 Line representation) */}
              <div className="p-4 rounded-2xl bg-[#0D1030] border border-[rgba(201,204,224,0.1)] shadow-gold-halo space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Smile size={16} className="text-[#FFB800]" />
                    <span className="font-semibold text-white">Mood Attunement</span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <TrendingUp size={12} /> +18% vs last {period.toLowerCase()}
                  </span>
                </div>
                <div className="flex items-end justify-between h-14 pt-2 px-2 border-b border-white/5">
                  {metrics.map((m) => (
                    <div key={m.day} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className="w-2.5 rounded-t-full bg-[#FFB800] transition-all"
                        style={{ height: `${(m.mood / 5) * 44}px` }}
                      />
                      <span className="text-[9px] font-mono text-[#C9CCE0]/60">{m.day}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-[#C9CCE0]/60 italic block">
                  Scale 1 (Low) to 5 (Radiant)
                </span>
              </div>

              {/* TILE 2: ENERGY (Bar % representation) */}
              <div className="p-4 rounded-2xl bg-[#0D1030] border border-[rgba(201,204,224,0.1)] shadow-gold-halo space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Zap size={16} className="text-[#FF7A1A]" />
                    <span className="font-semibold text-white">Vitality Energy</span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <TrendingUp size={12} /> +24% stability
                  </span>
                </div>
                <div className="flex items-end justify-between h-14 pt-2 px-2 border-b border-white/5">
                  {metrics.map((m) => (
                    <div key={m.day} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className="w-2.5 rounded-t-full bg-[#FF7A1A] transition-all"
                        style={{ height: `${(m.energy / 100) * 44}px` }}
                      />
                      <span className="text-[9px] font-mono text-[#C9CCE0]/60">{m.day}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-[#C9CCE0]/60 italic block">
                  Measured post-challenge somatic discharge
                </span>
              </div>

              {/* TILE 3: STRESS % (Line, lower is better) */}
              <div className="p-4 rounded-2xl bg-[#0D1030] border border-[rgba(201,204,224,0.1)] shadow-gold-halo space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[#D6469A]" />
                    <span className="font-semibold text-white">Sympathetic Stress</span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <TrendingDown size={12} /> -40% (Lower is better)
                  </span>
                </div>
                <div className="flex items-end justify-between h-14 pt-2 px-2 border-b border-white/5">
                  {metrics.map((m) => (
                    <div key={m.day} className="flex flex-col items-center gap-1 flex-1">
                      <div
                        className="w-2.5 rounded-t-full bg-[#D6469A] transition-all"
                        style={{ height: `${(m.stress / 100) * 44}px` }}
                      />
                      <span className="text-[9px] font-mono text-[#C9CCE0]/60">{m.day}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-[#C9CCE0]/60 italic block">
                  Downregulated from 62% to 22% this week
                </span>
              </div>

              {/* TILE 4: SLEEP HOURS (Bar with 7-9h band) */}
              <div className="p-4 rounded-2xl bg-[#0D1030] border border-[rgba(201,204,224,0.1)] shadow-gold-halo space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Moon size={16} className="text-[#2FA8F0]" />
                    <span className="font-semibold text-white">Nocturnal Sleep Hours</span>
                  </div>
                  <span className="text-[11px] text-[#2FA8F0] font-mono">
                    Avg 7.8 hrs
                  </span>
                </div>
                <div className="relative h-14 pt-2 px-2 border-b border-white/5 flex items-end justify-between">
                  {/* Target 7-9h Band indicator */}
                  <div className="absolute inset-x-2 top-2 h-4 bg-[#2FA8F0]/10 border-y border-[#2FA8F0]/20 pointer-events-none rounded" />
                  {metrics.map((m) => (
                    <div key={m.day} className="flex flex-col items-center gap-1 flex-1 relative z-10">
                      <div
                        className="w-2.5 rounded-t-full bg-[#2FA8F0] transition-all"
                        style={{ height: `${(m.sleep / 10) * 44}px` }}
                      />
                      <span className="text-[9px] font-mono text-[#C9CCE0]/60">{m.day}</span>
                    </div>
                  ))}
                </div>
                <span className="text-[10px] text-[#2FA8F0] italic block">
                  Highlighted zone marks the optimal 7–9h restorative band
                </span>
              </div>

              {/* TILE 5: PRACTICES THIS WEEK */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0D1030] to-[#171A3F] border border-[#FFB800]/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFB800] block">
                    CONSISTENCY
                  </span>
                  <h4 className="text-sm font-semibold text-white">
                    7 Practices Sealed This Week
                  </h4>
                  <p className="text-[11px] text-[#C9CCE0]/75 mt-0.5">
                    Uninterrupted daily attunement without guilt.
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-spectrum-gradient text-white flex items-center justify-center font-bold text-sm shadow-coral-halo">
                  7/7
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
