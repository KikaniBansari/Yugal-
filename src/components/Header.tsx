import React from 'react';
import { Sparkles, Volume2, VolumeX, Smartphone, Monitor, Layers, PlayCircle, Cloud, User, Check } from 'lucide-react';
import { playSoftTap, playSingingBowl } from '../utils/audio';

interface HeaderProps {
  completedCount: number;
  totalChallenges?: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isMobileFrame: boolean;
  onToggleFrame: () => void;
  onOpenUiKit: () => void;
  onOpenStatesModal: () => void;
  onRestartOnboarding: () => void;
  isSignedIn?: boolean;
  userEmail?: string | null;
  onGoogleSignIn?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  completedCount,
  totalChallenges = 21,
  soundEnabled,
  onToggleSound,
  isMobileFrame,
  onToggleFrame,
  onOpenUiKit,
  onOpenStatesModal,
  onRestartOnboarding,
  isSignedIn = false,
  userEmail,
  onGoogleSignIn,
}) => {
  const handleSoundClick = () => {
    playSoftTap();
    if (!soundEnabled) {
      playSingingBowl(432, 1.5);
    }
    onToggleSound();
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#04061A]/90 backdrop-blur-md border-b border-[rgba(201,204,224,0.08)] px-3 py-2.5 flex items-center justify-between">
      {/* Brand & Wordmark */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full border border-[#FFB800]/40 bg-[#0D1030] flex items-center justify-center text-[#FFB800] shadow-[0_0_12px_rgba(255,184,0,0.2)] flex-shrink-0">
          <Sparkles size={15} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tracking-tight text-white leading-none font-['DM_Sans']">
              Yugal
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-medium text-[#FFB800] bg-[#FFB800]/10 border border-[#FFB800]/20">
              BOX ACTIVE
            </span>
          </div>
          <span className="text-[10px] text-[#C9CCE0]/75 tracking-normal block leading-tight mt-0.5">
            Harmony held in balance
          </span>
        </div>
      </div>

      {/* Top Bar Quick Navigation & Switchers */}
      <div className="flex items-center gap-1.5">
        {/* Cloud / Google Auth Sync Button */}
        {onGoogleSignIn && (
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              onGoogleSignIn();
            }}
            className={`px-2 py-1 rounded-full border text-[10px] font-medium tracking-wide flex items-center gap-1 transition-colors cursor-pointer ${
              isSignedIn
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-[#0D1030] hover:bg-[#171A3F] border-[#FFB800]/40 text-[#FFB800]'
            }`}
            title={isSignedIn ? `Cloud Synced (${userEmail || 'Google'})` : 'Sign in with Google to sync Firestore'}
          >
            <Cloud size={11} className={isSignedIn ? 'text-emerald-400' : 'text-[#FFB800]'} />
            <span className="hidden sm:inline">
              {isSignedIn ? 'Synced' : 'Google Sync'}
            </span>
          </button>
        )}

        {/* UI Kit Catalog Button */}
        <button
          type="button"
          onClick={() => {
            playSoftTap();
            onOpenUiKit();
          }}
          className="px-2 py-1 rounded-full bg-[#0D1030] hover:bg-[#171A3F] border border-[#FFB800]/30 text-[10px] text-[#FFB800] font-semibold tracking-wide flex items-center gap-1 transition-colors cursor-pointer"
          title="Open UI Kit & Components Catalog"
        >
          <Layers size={11} />
          <span>UI Kit</span>
        </button>

        {/* States Matrix Button */}
        <button
          type="button"
          onClick={() => {
            playSoftTap();
            onOpenStatesModal();
          }}
          className="px-2 py-1 rounded-full bg-[#0D1030] hover:bg-[#171A3F] border border-[rgba(201,204,224,0.15)] text-[10px] text-[#2FA8F0] font-semibold tracking-wide flex items-center gap-1 transition-colors cursor-pointer"
          title="Open 5 States Showcase (Loading, Locked, Completed, Empty, Error)"
        >
          <span>States</span>
        </button>

        {/* Replay Onboarding Button */}
        <button
          type="button"
          onClick={() => {
            playSoftTap();
            onRestartOnboarding();
          }}
          className="p-1.5 rounded-full bg-[#0D1030] border border-white/10 text-[#C9CCE0] hover:text-white transition-colors cursor-pointer"
          title="Replay 7-step onboarding flow"
        >
          <PlayCircle size={14} />
        </button>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={handleSoundClick}
          title={soundEnabled ? 'Mute sacred ambient chimes' : 'Enable sacred ambient chimes'}
          className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
            soundEnabled
              ? 'bg-[#0D1030] border-[#FFB800]/40 text-[#FFB800]'
              : 'bg-[#0D1030]/60 border-white/10 text-[#C9CCE0]/50'
          }`}
        >
          {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
        </button>

        {/* iOS 390x844 Frame Toggle */}
        <button
          type="button"
          onClick={() => {
            playSoftTap();
            onToggleFrame();
          }}
          title={isMobileFrame ? 'Expand to wide canvas' : 'Constrain to iOS standard 390x844'}
          className="p-1.5 rounded-full bg-[#0D1030] border border-white/10 text-[#C9CCE0] hover:text-white transition-colors cursor-pointer"
        >
          {isMobileFrame ? <Monitor size={14} /> : <Smartphone size={14} />}
        </button>
      </div>
    </header>
  );
};
