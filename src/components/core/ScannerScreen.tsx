import React, { useState, useRef, useEffect } from 'react';
import { Challenge, Phase } from '../../types/yugal';
import { PHASE_CONFIG } from '../../data/yugalData';
import { Button } from '../ui/Button';
import { 
  X, 
  Camera, 
  Zap, 
  ZapOff, 
  Shuffle, 
  KeyRound, 
  RotateCcw, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles,
  Settings
} from 'lucide-react';
import { playScanSuccessChime, playSoftTap } from '../../utils/audio';

interface ScannerScreenProps {
  challenges: Challenge[];
  targetChallenge?: Challenge | null;
  onCardFound: (challenge: Challenge) => void;
  onClose: () => void;
  onPickRandom: () => void;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({
  challenges,
  targetChallenge,
  onCardFound,
  onClose,
  onPickRandom,
}) => {
  const [torchOn, setTorchOn] = useState(false);
  const [manualCode, setManualCode] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [scannerState, setScannerState] = useState<'scanning' | 'success' | 'error' | 'blocked'>('scanning');
  const [foundCard, setFoundCard] = useState<Challenge | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera or fallback
  useEffect(() => {
    let active = true;

    async function initCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (!active) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      } catch (err) {
        console.warn('Live camera permission or device not accessible, optical simulation active', err);
      }
    }

    initCamera();

    return () => {
      active = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const handleCardRecognized = (card: Challenge) => {
    playScanSuccessChime();
    setFoundCard(card);
    setScannerState('success');
    setTimeout(() => {
      onCardFound(card);
    }, 1200);
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playSoftTap();
    const clean = manualCode.trim();
    const matched = challenges.find(
      (c) => c.code === clean || String(c.number) === clean || `#${c.number}` === clean
    );

    if (matched) {
      handleCardRecognized(matched);
    } else {
      setErrorMessage("This isn't a Yugal card. Try another one.");
      setScannerState('error');
    }
  };

  const handleSimulateInvalidCard = () => {
    playSoftTap();
    setErrorMessage("This isn't a Yugal card. Try another one.");
    setScannerState('error');
  };

  const handleSimulateBlockedCamera = () => {
    playSoftTap();
    setScannerState('blocked');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#04061A] text-white flex flex-col justify-between overflow-hidden select-none">
      {/* 1. Top Controls Bar */}
      <div className="relative z-30 pt-safe px-4 py-3 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-[#0D1030]/80 backdrop-blur-md border border-white/10 flex items-center justify-center text-[#C9CCE0] hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>

        <span className="text-xs font-semibold tracking-wider uppercase text-[#FFB800] bg-[#0D1030]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#FFB800]/30 font-mono">
          YUGAL QR SCANNER
        </span>

        {/* Torch Button */}
        <button
          type="button"
          onClick={() => {
            playSoftTap();
            setTorchOn(!torchOn);
          }}
          className={`w-10 h-10 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors cursor-pointer ${
            torchOn
              ? 'bg-[#FFB800] text-[#04061A] border-[#FFB800]'
              : 'bg-[#0D1030]/80 text-[#C9CCE0] border-white/10'
          }`}
          title="Toggle torch"
        >
          {torchOn ? <Zap size={18} /> : <ZapOff size={18} />}
        </button>
      </div>

      {/* 2. Main Viewfinder Body */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-4">
        {/* Background Live Camera Video */}
        <video
          ref={videoRef}
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity ${
            scannerState === 'blocked' ? 'hidden' : ''
          }`}
        />

        {/* Dark Vignette Overlay */}
        <div className="absolute inset-0 bg-[#04061A]/70 pointer-events-none" />

        {/* STATE: NORMAL SCANNING */}
        {scannerState === 'scanning' && (
          <div className="relative z-20 flex flex-col items-center text-center">
            {/* Viewfinder Reticle with Spectrum Gradient Corner Brackets */}
            <div className="relative w-64 h-64 rounded-3xl flex items-center justify-center overflow-hidden border border-white/10 bg-black/20 backdrop-blur-xs">
              {/* 4 Spectrum Gradient Corner Brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#FFB800] rounded-tl-xl" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#FF7A1A] rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#2FA8F0] rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#D6469A] rounded-br-xl" />

              {/* Soft Moving Horizontal Scan Line */}
              <div className="absolute inset-x-0 h-1 bg-spectrum-gradient shadow-[0_0_16px_#FFB800] animate-scan-sweep" />

              {/* Center Crosshair */}
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center bg-[#04061A]/40">
                <span className="w-2 h-2 rounded-full bg-[#FFB800] animate-ping" />
              </div>
            </div>

            <p className="text-xs text-[#C9CCE0] mt-4 max-w-xs">
              Point your camera at the QR code stamped on any physical challenge card.
            </p>

            {/* Quick demo trigger pills */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={() => handleCardRecognized(challenges[7])}
                className="px-3 py-1.5 rounded-full bg-[#0D1030] hover:bg-[#171A3F] border border-[#FFB800]/40 text-[11px] text-[#FFB800] font-medium flex items-center gap-1.5 shadow-gold-halo cursor-pointer"
              >
                <Sparkles size={12} />
                <span>Simulate Card #8 (CALM)</span>
              </button>

              <button
                type="button"
                onClick={handleSimulateInvalidCard}
                className="px-2.5 py-1 rounded-full bg-[#0D1030]/60 border border-white/10 text-[10px] text-[#C9CCE0]/60 hover:text-white"
              >
                Test Invalid Card
              </button>

              <button
                type="button"
                onClick={handleSimulateBlockedCamera}
                className="px-2.5 py-1 rounded-full bg-[#0D1030]/60 border border-white/10 text-[10px] text-[#C9CCE0]/60 hover:text-white"
              >
                Test Blocked Cam
              </button>
            </div>
          </div>
        )}

        {/* STATE: SUCCESS FLASH & CHIP */}
        {scannerState === 'success' && foundCard && (
          <div className="relative z-20 flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
            {/* Flash ring */}
            <div className="w-64 h-64 rounded-3xl border-4 border-emerald-400 bg-emerald-500/20 backdrop-blur-md flex items-center justify-center shadow-[0_0_40px_rgba(52,211,153,0.5)]">
              <div className="w-16 h-16 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
            </div>

            {/* Chip: Card found: CALM */}
            <div className="mt-4 px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-sm font-semibold tracking-wide flex items-center gap-2 shadow-lg">
              <Sparkles size={16} />
              <span>Card found: {foundCard.phase}</span>
            </div>

            <p className="text-xs text-white/90 mt-2 font-medium">
              Opening Challenge #{foundCard.number}: {foundCard.title}...
            </p>
          </div>
        )}

        {/* STATE: ERROR (Invalid Card) */}
        {scannerState === 'error' && (
          <div className="relative z-20 max-w-xs p-6 rounded-3xl bg-[#0D1030] border border-red-500/40 text-center shadow-2xl animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center mb-3">
              <ShieldAlert size={24} />
            </div>
            <h3 className="text-base font-semibold text-white">
              Unrecognized Code
            </h3>
            <p className="text-xs text-[#C9CCE0] mt-1.5 leading-relaxed">
              {errorMessage}
            </p>
            <div className="mt-5 space-y-2">
              <Button
                variant="primary"
                size="compact"
                onClick={() => setScannerState('scanning')}
                icon={<RotateCcw size={14} />}
              >
                Scan again
              </Button>
              <button
                type="button"
                onClick={() => setShowManualInput(true)}
                className="text-xs text-[#C9CCE0]/80 underline"
              >
                Enter code manually
              </button>
            </div>
          </div>
        )}

        {/* STATE: CAMERA BLOCKED */}
        {scannerState === 'blocked' && (
          <div className="relative z-20 max-w-xs p-6 rounded-3xl bg-[#0D1030] border border-[rgba(201,204,224,0.15)] text-center shadow-2xl animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-full bg-white/10 text-[#FFB800] mx-auto flex items-center justify-center mb-3">
              <Camera size={24} />
            </div>
            <h3 className="text-base font-semibold text-white">
              Camera Access Required
            </h3>
            <p className="text-xs text-[#C9CCE0] mt-1.5 leading-relaxed">
              Please grant camera permission in your browser or device settings to scan your physical Reset Box cards.
            </p>
            <div className="mt-5 space-y-2">
              <Button
                variant="primary"
                size="compact"
                onClick={() => setScannerState('scanning')}
                icon={<Settings size={14} />}
              >
                Open settings
              </Button>
              <button
                type="button"
                onClick={() => setShowManualInput(true)}
                className="text-xs text-[#C9CCE0]/80 underline block mx-auto pt-1"
              >
                Or enter code manually
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 3. Bottom Action Bar: "Enter code manually" & "Pick a card for me instead" */}
      <div className="relative z-30 p-4 pb-safe bg-gradient-to-t from-black/90 via-[#04061A]/80 to-transparent space-y-2.5">
        {showManualInput ? (
          <form onSubmit={handleManualSubmit} className="flex gap-2 animate-in fade-in">
            <input
              type="text"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              placeholder="Enter card number (e.g. 0208 or 8)"
              className="flex-1 h-[48px] rounded-2xl bg-[#0D1030] border border-[#FFB800]/40 px-4 text-xs text-white placeholder-[#C9CCE0]/50 outline-none font-mono"
            />
            <Button
              type="submit"
              size="compact"
              fullWidth={false}
              className="px-5"
            >
              Verify
            </Button>
          </form>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            <Button
              variant="outline"
              size="compact"
              onClick={() => setShowManualInput(true)}
              icon={<KeyRound size={14} />}
            >
              Enter code manually
            </Button>

            <Button
              variant="outline"
              size="compact"
              onClick={() => {
                onClose();
                onPickRandom();
              }}
              icon={<Shuffle size={14} className="text-[#FFB800]" />}
            >
              Pick a card for me
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
