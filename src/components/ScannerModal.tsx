import React, { useState, useRef, useEffect } from 'react';
import { Card, ReflectionLog, SensoryState } from '../types';
import { PHASES } from '../data/cards';
import { X, Camera, Sparkles, Check, ChevronRight, ShieldCheck, RefreshCw, KeyRound } from 'lucide-react';
import { playScanSuccessChime, playSingingBowl, playSoftTap } from '../utils/audio';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  cards: Card[];
  targetCard?: Card | null;
  onCompleteRitual: (log: Omit<ReflectionLog, 'id' | 'timestamp'>) => void;
}

const SENSORY_STATES: SensoryState[] = [
  'Deep Stillness',
  'Grounded Vitality',
  'Gentle Ease',
  'Restless / Releasing',
  'Luminous Clarity',
];

const SOMATIC_LOCATIONS = [
  'Heart & Sternum',
  'Solar Plexus & Belly',
  'Throat & Jaw',
  'Feet & Pelvis (Grounded)',
  'Temples & Third Eye',
  'Whole Vessel',
];

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  cards,
  targetCard,
  onCompleteRitual,
}) => {
  const [step, setStep] = useState<'scanning' | 'reflecting'>('scanning');
  const [matchedCard, setMatchedCard] = useState<Card | null>(targetCard || null);
  const [useCamera, setUseCamera] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [codeError, setCodeError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);

  // Reflection form states
  const [selectedState, setSelectedState] = useState<SensoryState>('Grounded Vitality');
  const [energyLevel, setEnergyLevel] = useState<number>(4);
  const [selectedLocation, setSelectedLocation] = useState<string>('Heart & Sternum');
  const [reflectionText, setReflectionText] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (targetCard) {
      setMatchedCard(targetCard);
    }
  }, [targetCard]);

  // Clean up camera stream when closing
  useEffect(() => {
    if (!isOpen) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setCameraActive(false);
      setStep('scanning');
      setManualCode('');
      setCodeError('');
    }
  }, [isOpen]);

  const startCamera = async () => {
    try {
      playSoftTap();
      setUseCamera(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera not available or denied, falling back to simulated optical scanner', err);
      setUseCamera(false);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
    setUseCamera(false);
  };

  const handleSimulateScan = (card: Card) => {
    playScanSuccessChime();
    setMatchedCard(card);
    setStep('reflecting');
    stopCamera();
  };

  const handleManualCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSoftTap();
    const clean = manualCode.trim();
    const found = cards.find(
      (c) => c.code === clean || String(c.number) === clean || `#${c.number}` === clean
    );
    if (found) {
      playScanSuccessChime();
      setMatchedCard(found);
      setCodeError('');
      setStep('reflecting');
      stopCamera();
    } else {
      setCodeError('Card code not found in physical ritual deck (e.g. 0114, 0414)');
    }
  };

  const handleSaveReflection = () => {
    if (!matchedCard) return;
    playSingingBowl(528, 3.5);
    onCompleteRitual({
      cardId: matchedCard.id,
      cardNumber: matchedCard.number,
      cardTitle: matchedCard.title,
      phase: matchedCard.phase,
      sensoryState: selectedState,
      energyLevel,
      notes: reflectionText.trim() || 'Presence held in silence.',
      somaticLocation: selectedLocation,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-[430px] my-auto bg-[#04061A] border border-[rgba(201,204,224,0.12)] rounded-3xl p-5 text-white shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Background Ambient Glows */}
        <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full bg-[#FFB800]/10 filter blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 rounded-full bg-[#2FA8F0]/10 filter blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-spectrum-gradient flex items-center justify-center text-white">
              <Sparkles size={14} />
            </div>
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#FFB800]">
                Tactile Companion
              </span>
              <h2 className="text-base font-medium text-white leading-tight">
                {step === 'scanning' ? 'Scan Physical Ritual Card' : 'Somatic Seal & Reflection'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#0D1030] hover:bg-white/10 text-[#C9CCE0] hover:text-white flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* SCENARIO 1: SCANNING VIEW */}
        {step === 'scanning' && (
          <div className="flex-1 overflow-y-auto py-3 space-y-4 relative z-10">
            {/* Viewfinder Frame with Target Reticle */}
            <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#090C21] border border-white/10 overflow-hidden flex items-center justify-center">
              {useCamera && (
                <video
                  ref={videoRef}
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover"
                />
              )}

              {/* Viewfinder Target Reticle with Master Spectrum Gradient */}
              <div className="relative w-48 h-48 rounded-2xl border-2 border-white/10 flex items-center justify-center overflow-hidden">
                {/* 4 Corner Spectrum Brackets */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#FFB800]" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#FF7A1A]" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#2FA8F0]" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#D6469A]" />

                {/* Animated Horizontal Scan Laser Beam */}
                <div className="absolute inset-x-0 h-0.5 bg-spectrum-gradient shadow-[0_0_12px_#FFB800] animate-scan-sweep" />

                {/* Center Aperture Crosshair */}
                <div className="w-10 h-10 rounded-full border border-[#FFB800]/40 flex items-center justify-center bg-[#04061A]/40 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFB800] animate-ping" />
                </div>
              </div>

              {/* Viewfinder Status Overlay */}
              <div className="absolute bottom-2.5 inset-x-3 flex items-center justify-between text-[11px] text-[#C9CCE0] bg-[#0D1030]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Align QR or card border
                </span>
                <span className="font-mono text-[#FFB800]">OPTICAL READY</span>
              </div>
            </div>

            {/* Camera Toggle or Quick Scan actions */}
            <div className="flex items-center gap-2">
              {!cameraActive ? (
                <button
                  type="button"
                  onClick={startCamera}
                  className="flex-1 h-[44px] rounded-full bg-[#0D1030] hover:bg-[#171A3F] border border-[rgba(201,204,224,0.2)] text-[#DFE0FE] text-xs font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  <Camera size={15} className="text-[#2FA8F0]" />
                  <span>Launch Live Camera</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={stopCamera}
                  className="flex-1 h-[44px] rounded-full bg-[#0D1030] border border-red-500/30 text-red-300 text-xs font-medium flex items-center justify-center gap-2"
                >
                  <RefreshCw size={14} />
                  <span>Pause Camera</span>
                </button>
              )}
            </div>

            {/* Quick Test Physical Cards (Tactile Simulator) */}
            <div className="bg-[#0D1030]/90 rounded-2xl p-3.5 border border-[rgba(201,204,224,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#FFB800] flex items-center gap-1.5">
                  <ShieldCheck size={13} />
                  Simulate Physical Card Draw
                </span>
                <span className="text-[10px] text-[#C9CCE0]/50">Tap to Authenticate</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {cards.slice(12, 16).map((card) => {
                  const p = PHASES[card.phase];
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => handleSimulateScan(card)}
                      className="p-2.5 rounded-xl bg-[#04061A]/80 border border-white/10 hover:border-[#FFB800]/50 text-left transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="font-semibold" style={{ color: p.color }}>
                          {card.phase}
                        </span>
                        <span className="font-mono text-[#C9CCE0]/60">#{card.code}</span>
                      </div>
                      <div className="text-xs font-medium text-white group-hover:text-[#FFB800] truncate">
                        {card.title}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Manual Code Input Form */}
            <form onSubmit={handleManualCodeSubmit} className="space-y-2">
              <label className="text-[11px] text-[#C9CCE0]/80 font-medium flex items-center gap-1.5">
                <KeyRound size={12} className="text-[#FFB800]" />
                <span>Or Enter 4-Digit Card Stamp Number</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  maxLength={6}
                  placeholder="e.g. 0414 or 14"
                  value={manualCode}
                  onChange={(e) => {
                    setManualCode(e.target.value);
                    setCodeError('');
                  }}
                  className="flex-1 h-[46px] rounded-xl bg-[#0D1030] border border-[rgba(201,204,224,0.14)] focus:border-[#FFB800] px-3.5 text-sm text-white placeholder-[#C9CCE0]/50 outline-none transition-colors font-mono"
                />
                <button
                  type="submit"
                  className="px-5 h-[46px] rounded-xl bg-[#0D1030] hover:bg-[#171A3F] border border-[#FFB800]/40 text-[#FFB800] text-xs font-semibold tracking-wide flex items-center justify-center transition-colors"
                >
                  Verify
                </button>
              </div>
              {codeError && (
                <p className="text-xs text-rose-400 mt-1">{codeError}</p>
              )}
            </form>
          </div>
        )}

        {/* SCENARIO 2: POST-SCAN SOMATIC REFLECTION FLOW */}
        {step === 'reflecting' && matchedCard && (
          <div className="flex-1 overflow-y-auto py-2 space-y-4 pr-1 relative z-10">
            {/* Authenticated Card Badge */}
            <div className="p-3 rounded-2xl bg-[#0D1030] border border-[#FFB800]/30 flex items-start gap-3 shadow-gold-halo">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-semibold font-mono text-xs"
                style={{ backgroundColor: PHASES[matchedCard.phase].bgTint, color: PHASES[matchedCard.phase].color, border: `1px solid ${PHASES[matchedCard.phase].borderColor}` }}
              >
                #{matchedCard.number}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] uppercase font-semibold text-[#FFB800]">
                  <Check size={12} />
                  <span>Card Authenticated: {matchedCard.phase}</span>
                </div>
                <h4 className="text-sm font-semibold text-white truncate">
                  {matchedCard.title}
                </h4>
                <p className="text-xs text-[#DFE0FE]/80 mt-0.5 line-clamp-2">
                  "{matchedCard.prompt}"
                </p>
              </div>
            </div>

            {/* Sensory Radio Selectors (Design Token 5) */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C9CCE0] block mb-2">
                Somatic Nervous System State
              </label>
              <div className="space-y-1.5">
                {SENSORY_STATES.map((state) => {
                  const isSelected = selectedState === state;
                  return (
                    <div
                      key={state}
                      onClick={() => {
                        playSoftTap();
                        setSelectedState(state);
                      }}
                      className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#0D1030] border border-[#FFB800]/40 shadow-gold-halo'
                          : 'bg-[#090C21]/60 border border-white/5 hover:border-white/10'
                      }`}
                    >
                      <span className={`text-xs ${isSelected ? 'text-white font-medium' : 'text-[#C9CCE0]'}`}>
                        {state}
                      </span>

                      {/* Circular 24px Selector with radiating inner dot */}
                      <div className="w-6 h-6 rounded-full border border-[rgba(201,204,224,0.3)] flex items-center justify-center relative transition-colors">
                        {isSelected && (
                          <div className="w-3 h-3 rounded-full bg-[#FFB800] shadow-[0_0_8px_#FFB800]" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Somatic Vessel Location */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C9CCE0] block mb-1.5">
                Primary Physical Anchor
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SOMATIC_LOCATIONS.map((loc) => {
                  const isSel = selectedLocation === loc;
                  return (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        playSoftTap();
                        setSelectedLocation(loc);
                      }}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium transition-all ${
                        isSel
                          ? 'bg-[#FFB800]/15 text-[#FFB800] border border-[#FFB800]/60'
                          : 'bg-[#0D1030] text-[#C9CCE0] border border-white/5 hover:border-white/15'
                      }`}
                    >
                      {loc}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vitality Energy Meter (1-5) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C9CCE0]">
                  Grounded Vitality Gauge
                </span>
                <span className="text-xs font-mono text-[#FFB800]">{energyLevel} / 5</span>
              </div>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => {
                      playSoftTap();
                      setEnergyLevel(lvl);
                    }}
                    className={`flex-1 h-2.5 rounded-full transition-all ${
                      lvl <= energyLevel
                        ? 'bg-spectrum-gradient shadow-[0_0_6px_rgba(255,184,0,0.5)]'
                        : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Reflection Text Input (Design Token 5) */}
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#C9CCE0] block mb-1.5">
                Reflective Inscription
              </label>
              <div className="rounded-2xl bg-[#0D1030] p-1 border border-[rgba(201,204,224,0.12)] focus-within:border-[#FFB800] transition-colors">
                <textarea
                  rows={3}
                  value={reflectionText}
                  onChange={(e) => setReflectionText(e.target.value)}
                  placeholder={`"${matchedCard.reflectionQuestion}"`}
                  className="w-full bg-transparent p-3 text-xs text-white placeholder-[#C9CCE0]/50 outline-none resize-none font-['DM_Sans']"
                />
              </div>
            </div>

            {/* Primary Gradient CTA Button (Design Token 1) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveReflection}
                className="w-full h-[54px] rounded-full bg-spectrum-gradient text-white text-[14px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-coral-halo active:scale-[0.98] transition-transform"
              >
                <span>Seal Ritual & Inscribe Reflection</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
