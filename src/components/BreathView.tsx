import React, { useState, useEffect, useRef } from 'react';
import { Wind, Play, Pause, RotateCcw, Volume2, Sparkles, Heart } from 'lucide-react';
import { playSingingBowl, playSoftTap } from '../utils/audio';

type BreathMode = 'box' | 'coherence' | '478';

interface PhaseStep {
  name: string;
  duration: number; // in seconds
  prompt: string;
  toneFreq: number;
}

const MODES: Record<BreathMode, { title: string; subtitle: string; phases: PhaseStep[] }> = {
  box: {
    title: 'Box Ocean Breath',
    subtitle: '4s Inhale • 4s Hold • 4s Exhale • 4s Stillness',
    phases: [
      { name: 'INHALE', duration: 4, prompt: 'Inhale cool air through nostrils', toneFreq: 432 },
      { name: 'HOLD', duration: 4, prompt: 'Rest gently at top of breath', toneFreq: 528 },
      { name: 'EXHALE', duration: 4, prompt: 'Release warm breath smoothly', toneFreq: 384 },
      { name: 'STILLNESS', duration: 4, prompt: 'Rest in pure absence of hurry', toneFreq: 432 },
    ],
  },
  coherence: {
    title: 'Heart Coherence',
    subtitle: '5s Inhale • 5s Exhale (0.1 Hz Resonance)',
    phases: [
      { name: 'INHALE', duration: 5, prompt: 'Expand ribcage and solar plexus', toneFreq: 432 },
      { name: 'EXHALE', duration: 5, prompt: 'Softly deflate, dropping shoulders', toneFreq: 384 },
    ],
  },
  '478': {
    title: 'Parasympathetic 4-7-8',
    subtitle: '4s Inhale • 7s Full Retention • 8s Soft Sigh',
    phases: [
      { name: 'INHALE', duration: 4, prompt: 'Inhale quietly through nose', toneFreq: 432 },
      { name: 'HOLD', duration: 7, prompt: 'Suspend breath without clenching throat', toneFreq: 528 },
      { name: 'EXHALE', duration: 8, prompt: 'Whoosh exhale completely through mouth', toneFreq: 320 },
    ],
  },
};

export const BreathView: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<BreathMode>('box');
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [secondsRemaining, setSecondsRemaining] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const modeConfig = MODES[selectedMode];
  const currentPhase = modeConfig.phases[phaseIndex];

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Next phase
            const nextIdx = (phaseIndex + 1) % modeConfig.phases.length;
            if (nextIdx === 0) {
              setCompletedCycles((c) => c + 1);
            }
            setPhaseIndex(nextIdx);
            const nextPhase = modeConfig.phases[nextIdx];
            if (soundEnabled) {
              playSingingBowl(nextPhase.toneFreq, 2.0);
            }
            return nextPhase.duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phaseIndex, modeConfig, soundEnabled]);

  const handleTogglePlay = () => {
    playSoftTap();
    if (!isActive) {
      if (soundEnabled) {
        playSingingBowl(currentPhase.toneFreq, 2.5);
      }
    }
    setIsActive(!isActive);
  };

  const handleReset = () => {
    playSoftTap();
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemaining(modeConfig.phases[0].duration);
    setCompletedCycles(0);
  };

  const handleChangeMode = (mode: BreathMode) => {
    playSoftTap();
    setSelectedMode(mode);
    setIsActive(false);
    setPhaseIndex(0);
    setSecondsRemaining(MODES[mode].phases[0].duration);
    setCompletedCycles(0);
  };

  // Determine expansion scale for circle
  const progressInPhase = (currentPhase.duration - secondsRemaining + 1) / currentPhase.duration;
  let scale = 1;
  if (currentPhase.name === 'INHALE') {
    scale = 1 + progressInPhase * 0.45;
  } else if (currentPhase.name === 'HOLD') {
    scale = 1.45;
  } else if (currentPhase.name === 'EXHALE') {
    scale = 1.45 - progressInPhase * 0.45;
  } else {
    scale = 1;
  }

  return (
    <div className="space-y-6 pb-28 text-center">
      {/* Title */}
      <div className="pt-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0D1030] border border-[#2FA8F0]/30 text-[11px] font-medium text-[#2FA8F0] mb-2">
          <Wind size={12} />
          <span>Somatic Breath Sanctuary</span>
        </div>
        <h1 className="text-2xl font-semibold text-white tracking-tight font-['DM_Sans']">
          Sacred Geometric Pacer
        </h1>
        <p className="text-xs text-[#C9CCE0] max-w-xs mx-auto mt-1 leading-relaxed">
          Calibrate heart-rate variability through rhythmic pulmonary expansion.
        </p>
      </div>

      {/* Mode Selectors */}
      <div className="flex items-center justify-center gap-2">
        {(['box', 'coherence', '478'] as BreathMode[]).map((mode) => {
          const isSelected = selectedMode === mode;
          return (
            <button
              key={mode}
              type="button"
              onClick={() => handleChangeMode(mode)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all ${
                isSelected
                  ? 'bg-[#2FA8F0]/15 text-[#2FA8F0] border border-[#2FA8F0]/70 shadow-[0_0_12px_rgba(47,168,240,0.2)]'
                  : 'bg-[#0D1030] text-[#C9CCE0] border border-white/5 hover:border-white/15'
              }`}
            >
              {MODES[mode].title.split(' ')[0]}
            </button>
          );
        })}
      </div>

      {/* Sacred Breath Orb Animation Container */}
      <div className="relative w-72 h-72 mx-auto flex items-center justify-center my-4">
        {/* Living Ambient Aura Overlays */}
        <div
          className="absolute inset-0 rounded-full transition-transform duration-1000 ease-in-out pointer-events-none filter blur-2xl"
          style={{
            transform: `scale(${scale * 1.1})`,
            background:
              currentPhase.name === 'INHALE'
                ? 'radial-gradient(circle, rgba(47,168,240,0.35) 0%, transparent 70%)'
                : currentPhase.name === 'HOLD'
                ? 'radial-gradient(circle, rgba(255,184,0,0.3) 0%, transparent 70%)'
                : 'radial-gradient(circle, rgba(214,70,154,0.3) 0%, transparent 70%)',
          }}
        />

        {/* Concentric Geometry Rings */}
        <div
          className="absolute w-64 h-64 rounded-full border border-white/5 transition-transform duration-1000 ease-in-out pointer-events-none"
          style={{ transform: `scale(${scale})` }}
        />
        <div
          className="absolute w-52 h-52 rounded-full border border-[#FFB800]/20 transition-transform duration-1000 ease-in-out pointer-events-none"
          style={{ transform: `scale(${scale * 0.9})` }}
        />
        <div
          className="absolute w-40 h-40 rounded-full border border-[#2FA8F0]/30 transition-transform duration-1000 ease-in-out pointer-events-none"
          style={{ transform: `scale(${scale * 0.8})` }}
        />

        {/* Center Focal Core Orb */}
        <div
          className="relative z-10 w-36 h-36 rounded-full bg-[#0D1030]/90 backdrop-blur-xl border border-[#FFB800]/40 flex flex-col items-center justify-center p-3 text-center transition-all duration-700 shadow-gold-halo"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          <span className="text-[11px] font-bold tracking-[0.14em] uppercase text-[#FFB800]">
            {currentPhase.name}
          </span>
          <span className="text-3xl font-semibold text-white font-mono mt-0.5">
            {secondsRemaining}s
          </span>
          <span className="text-[9px] text-[#C9CCE0]/60 mt-1 uppercase tracking-wider">
            {selectedMode.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Somatic Prompt Caption */}
      <div className="max-w-xs mx-auto px-4 py-2 rounded-2xl bg-[#0D1030]/60 border border-white/5 min-h-[48px] flex items-center justify-center">
        <p className="text-xs text-[#DFE0FE]/90 italic font-['DM_Sans']">
          "{currentPhase.prompt}"
        </p>
      </div>

      {/* Control Actions */}
      <div className="flex items-center justify-center gap-4 pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="w-12 h-12 rounded-full bg-[#0D1030] border border-white/10 hover:border-white/20 text-[#C9CCE0] hover:text-white flex items-center justify-center transition-colors"
          title="Reset breath session"
        >
          <RotateCcw size={16} />
        </button>

        {/* Primary Gradient Play CTA */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className="px-8 h-[54px] rounded-full bg-spectrum-gradient text-white text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-coral-halo active:scale-[0.98] transition-transform min-w-[170px]"
        >
          {isActive ? (
            <>
              <Pause size={18} />
              <span>Pause Session</span>
            </>
          ) : (
            <>
              <Play size={18} />
              <span>Begin Breathing</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            playSoftTap();
            setSoundEnabled(!soundEnabled);
          }}
          className={`w-12 h-12 rounded-full border flex items-center justify-center transition-colors ${
            soundEnabled
              ? 'bg-[#0D1030] border-[#FFB800]/40 text-[#FFB800]'
              : 'bg-[#0D1030]/60 border-white/10 text-[#C9CCE0]/40'
          }`}
          title={soundEnabled ? 'Singing bowl bell enabled' : 'Bell muted'}
        >
          <Volume2 size={16} />
        </button>
      </div>

      {/* Cycle Metrics */}
      <div className="pt-2 text-xs text-[#C9CCE0]/70 flex items-center justify-center gap-4">
        <span>Completed Cycles: <strong className="text-white font-mono">{completedCycles}</strong></span>
        <span>•</span>
        <span>Coherence: <strong className="text-emerald-400 font-mono">Synchronized</strong></span>
      </div>
    </div>
  );
};
