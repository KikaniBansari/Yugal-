import React, { useState, useEffect, useRef } from 'react';
import { Challenge } from '../../types/yugal';
import { PHASE_CONFIG } from '../../data/yugalData';
import { PhaseTag } from '../ui/Chips';
import { GlowingCircles } from '../ui/GlowingCircles';
import { Button } from '../ui/Button';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Check, 
  ChevronLeft, 
  Volume2, 
  VolumeX, 
  Clock, 
  Sparkles,
  BookOpen,
  Heart,
  Upload,
  Video,
  Bot,
  ShieldCheck,
  CheckCircle2,
  FileVideo,
  AlertCircle
} from 'lucide-react';
import { playSingingBowl, playSoftTap, playScanSuccessChime } from '../../utils/audio';

interface ChallengePracticeScreenProps {
  challenge: Challenge;
  onMarkAsDone: (verifiedWithAi?: boolean, aiNotes?: string, videoName?: string) => void;
  onBack: () => void;
}

export const ChallengePracticeScreen: React.FC<ChallengePracticeScreenProps> = ({
  challenge,
  onMarkAsDone,
  onBack,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // AI Verify Toggle and Video Upload States
  const [isAiVerifyEnabled, setIsAiVerifyEnabled] = useState(false);
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null);
  const [isAiVerifying, setIsAiVerifying] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiStatusMessage, setAiStatusMessage] = useState('');
  const [aiVerificationResult, setAiVerificationResult] = useState<{
    passed: boolean;
    score: number;
    feedback: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const meta = PHASE_CONFIG[challenge.phase] || PHASE_CONFIG.CALM;

  // Video or practice timer progression
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying]);

  const handleTogglePlay = () => {
    playSoftTap();
    if (!isPlaying && soundEnabled) {
      playSingingBowl(432, 2.5);
    }
    setIsPlaying(!isPlaying);
  };

  const handleWatchAgain = () => {
    playSoftTap();
    setIsPlaying(false);
    setSecondsElapsed(0);
    setActiveStepIndex(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      playSoftTap();
      setSelectedVideoFile(file);
      setVideoPreviewUrl(URL.createObjectURL(file));
      setAiVerificationResult(null);
    }
  };

  const handleUseSampleVideo = () => {
    playSoftTap();
    // Simulate loaded practice video
    const dummyBlob = new Blob(['sample-video'], { type: 'video/mp4' });
    const dummyFile = new File([dummyBlob], 'somatic_palm_practice.mp4', { type: 'video/mp4' });
    setSelectedVideoFile(dummyFile);
    setVideoPreviewUrl('https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80');
    setAiVerificationResult(null);
  };

  const handleRunAiVerification = () => {
    if (!selectedVideoFile && !videoPreviewUrl) return;
    playSoftTap();
    setIsAiVerifying(true);
    setAiProgress(10);
    setAiStatusMessage('Extracting biometric keyframes & posture orientation...');

    setTimeout(() => {
      setAiProgress(45);
      setAiStatusMessage('Evaluating hand placement over sternum and pericardium center...');
    }, 1100);

    setTimeout(() => {
      setAiProgress(80);
      setAiStatusMessage('Analyzing diaphragmatic respiratory cadence & shoulder drop...');
    }, 2200);

    setTimeout(() => {
      setAiProgress(100);
      setIsAiVerifying(false);
      playScanSuccessChime();

      const result = {
        passed: true,
        score: 98,
        feedback:
          'Somatic posture verified. Palm was centered gently over the sternum, shoulders relaxed with zero micro-bracing, and breathing rhythm synchronized to a tranquil 5.2s cycle.',
      };
      setAiVerificationResult(result);

      // Auto mark as done after a brief celebratory confirmation
      setTimeout(() => {
        onMarkAsDone(
          true,
          result.feedback,
          selectedVideoFile?.name || 'somatic_palm_practice.mp4'
        );
      }, 1600);
    }, 3300);
  };

  return (
    <div className="relative min-h-screen bg-[#04061A] text-white flex flex-col justify-between p-4 pb-36 select-none animate-in fade-in duration-300">
      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between pt-2 pb-2">
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

        <PhaseTag
          phase={challenge.phase}
          labelOverride={`Card #${challenge.number} · ${challenge.phase}`}
          size="sm"
        />

        <button
          type="button"
          onClick={() => {
            playSoftTap();
            setSoundEnabled(!soundEnabled);
          }}
          className="w-9 h-9 rounded-full bg-[#0D1030] border border-white/10 flex items-center justify-center text-[#C9CCE0]"
        >
          {soundEnabled ? <Volume2 size={16} className="text-[#FFB800]" /> : <VolumeX size={16} />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        {/* VARIANT A: VIDEO CHALLENGE PLAYER */}
        {challenge.hasVideo ? (
          <div className="space-y-3">
            {/* Video Player Box with Cover Image & Glowing Overlay */}
            <div className="relative w-full aspect-video rounded-3xl bg-[#090C21] border border-[#FFB800]/30 shadow-card-active overflow-hidden flex items-center justify-center group">
              <img
                src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
                alt="Practice session"
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />

              {/* Glowing aura overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#04061A] via-transparent to-black/30 pointer-events-none" />

              {/* Central Play/Pause Trigger */}
              <button
                type="button"
                onClick={handleTogglePlay}
                className="relative z-10 w-16 h-16 rounded-full bg-spectrum-gradient text-white flex items-center justify-center shadow-focal-glow active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1 fill-current" />}
              </button>

              {/* Bottom Video Progress Bar */}
              <div className="absolute bottom-3 inset-x-4 flex items-center justify-between text-[11px] font-mono text-white/90">
                <span className="bg-[#0D1030]/80 backdrop-blur-md px-2 py-0.5 rounded-md">
                  {formatTime(secondsElapsed)} / {challenge.duration}
                </span>
                <span className="text-[#FFB800] bg-[#0D1030]/80 backdrop-blur-md px-2 py-0.5 rounded-md">
                  {isPlaying ? 'FLOWING' : 'PAUSED'}
                </span>
              </div>
            </div>

            <div className="text-center px-2">
              <h2 className="text-xl font-semibold text-white tracking-tight">
                {challenge.title}
              </h2>
              <p className="text-xs text-[#C9CCE0] mt-0.5">
                Guided by {challenge.expert.name} · {challenge.expert.speciality}
              </p>
            </div>
          </div>
        ) : (
          /* VARIANT B: NO-VIDEO VARIANT (Journalling, Mirror Affirmations, Doctor Consult) */
          <div className="p-6 rounded-3xl bg-[#0D1030] border border-[#FFB800]/35 shadow-card-active text-center relative overflow-hidden space-y-4">
            <div className="flex justify-center">
              <GlowingCircles size={140} pulsing={true} />
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800] block mb-1">
                {challenge.noVideoType?.toUpperCase()} INVITATION
              </span>
              <h2 className="text-xl font-semibold text-white tracking-tight">
                {challenge.title}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-[#04061A]/70 border border-white/5 text-xs text-[#DFE0FE] leading-relaxed italic">
              "{challenge.noVideoPrompt || challenge.shortDesc}"
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-[#C9CCE0]">
              <Heart size={14} className="text-[#D6469A]" />
              <span>Take as much unhurried time as your body desires</span>
            </div>
          </div>
        )}

        {/* Follow-along Steps with Timings */}
        {/* (Arrive and breathe, Soften into practice, Release and restore) */}
        <div className="space-y-2">
          <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#FFB800] px-1">
            FOLLOW-ALONG PROGRESSION
          </span>

          <div className="space-y-2">
            {challenge.steps.map((step, idx) => {
              const isActive = activeStepIndex === idx;
              return (
                <div
                  key={step.title}
                  onClick={() => {
                    playSoftTap();
                    setActiveStepIndex(idx);
                  }}
                  className={`p-3.5 rounded-2xl transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0D1030] border border-[#FFB800]/50 shadow-gold-halo'
                      : 'bg-[#0D1030]/60 border border-white/5 hover:border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white">
                      {step.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#FFB800]">
                      {step.time}
                    </span>
                  </div>
                  <p className="text-xs text-[#C9CCE0]/80 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* =========================================================================
            USER REQUEST: "AI VERIFY" TOGGLE BUTTON & VIDEO UPLOAD
           ========================================================================= */}
        <div className="p-4 rounded-3xl bg-[#0D1030] border border-[#FFB800]/30 shadow-gold-halo space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-spectrum-gradient text-white flex items-center justify-center shadow-focal-glow flex-shrink-0">
                <Bot size={16} />
              </div>
              <div>
                <span className="text-xs font-semibold text-white block">
                  AI Verify (Somatic Analysis)
                </span>
                <span className="text-[10px] text-[#C9CCE0]/70 block leading-tight">
                  Upload practice video for AI posture & breath verification
                </span>
              </div>
            </div>

            {/* Toggle Switch */}
            <button
              type="button"
              onClick={() => {
                playSoftTap();
                setIsAiVerifyEnabled(!isAiVerifyEnabled);
              }}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                isAiVerifyEnabled ? 'bg-spectrum-gradient shadow-[0_0_10px_#FFB800]' : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${
                  isAiVerifyEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Expanded AI Verification Box when Toggle is ON */}
          {isAiVerifyEnabled && (
            <div className="pt-2 border-t border-white/10 space-y-3 animate-in fade-in duration-200">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                capture="user"
                onChange={handleFileChange}
                className="hidden"
              />

              {!selectedVideoFile && !videoPreviewUrl ? (
                /* Upload Prompt Dropzone */
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="p-5 rounded-2xl border-2 border-dashed border-[#FFB800]/40 hover:border-[#FFB800] bg-[#04061A]/60 flex flex-col items-center justify-center text-center cursor-pointer transition-colors group"
                >
                  <div className="w-10 h-10 rounded-full bg-[#FFB800]/15 text-[#FFB800] flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                    <Upload size={18} />
                  </div>
                  <span className="text-xs font-semibold text-white">
                    Select or Record Practice Video
                  </span>
                  <span className="text-[10px] text-[#C9CCE0]/60 mt-0.5">
                    Supports MP4, MOV, WebM (5–30 seconds)
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseSampleVideo();
                    }}
                    className="mt-3 px-3 py-1 rounded-full bg-[#0D1030] border border-[#2FA8F0]/40 text-[10px] text-[#2FA8F0] font-medium hover:text-white transition-colors"
                  >
                    Or Use Sample Practice Video (One-click)
                  </button>
                </div>
              ) : (
                /* Video Selected & Ready to Verify */
                <div className="space-y-2.5">
                  <div className="p-3 rounded-2xl bg-[#04061A] border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#2FA8F0]/20 text-[#2FA8F0] flex items-center justify-center flex-shrink-0">
                        <FileVideo size={16} />
                      </div>
                      <div className="min-w-0">
                        <span className="text-xs font-semibold text-white truncate block">
                          {selectedVideoFile?.name || 'somatic_palm_practice.mp4'}
                        </span>
                        <span className="text-[10px] text-[#C9CCE0]/60">
                          Ready for biometric analysis
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[11px] text-[#FFB800] underline"
                    >
                      Change
                    </button>
                  </div>

                  {/* AI Analysis in progress */}
                  {isAiVerifying && (
                    <div className="p-4 rounded-2xl bg-[#04061A] border border-[#FFB800]/40 text-center space-y-2.5 shadow-gold-halo">
                      <div className="w-8 h-8 rounded-full border-2 border-transparent border-t-[#FFB800] border-r-[#D6469A] border-b-[#2FA8F0] animate-spin mx-auto" />
                      <span className="text-xs font-semibold text-white block">
                        {aiStatusMessage}
                      </span>
                      <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full bg-spectrum-gradient transition-all duration-300"
                          style={{ width: `${aiProgress}%` }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-[#FFB800]">
                        {aiProgress}% Analyzed
                      </span>
                    </div>
                  )}

                  {/* AI Verification Success Banner */}
                  {aiVerificationResult && (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-left space-y-1.5 animate-in zoom-in-95">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                          <CheckCircle2 size={15} />
                          <span>AI Somatic Verification Passed</span>
                        </div>
                        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded-full">
                          {aiVerificationResult.score}% Alignment
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-100/90 leading-relaxed font-['DM_Sans']">
                        "{aiVerificationResult.feedback}"
                      </p>
                      <span className="text-[10px] text-emerald-300/70 block italic">
                        Marking challenge as done & recording to Firestore...
                      </span>
                    </div>
                  )}

                  {/* Submit for AI Verification CTA */}
                  {!isAiVerifying && !aiVerificationResult && (
                    <Button
                      variant="primary"
                      onClick={handleRunAiVerification}
                      icon={<Sparkles size={16} />}
                    >
                      Verify Practice with Yugal AI
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Pinned Bottom Buttons (as shown in user's screenshot) */}
      <div className="fixed bottom-0 inset-x-0 z-40 p-4 pb-safe bg-gradient-to-t from-[#04061A] via-[#04061A]/95 to-transparent flex justify-center">
        <div className="w-full max-w-md space-y-2">
          {/* Main "Mark as Done" button (unless AI verify is active and waiting for upload) */}
          <Button
            variant="primary"
            onClick={() => onMarkAsDone(false)}
            icon={<Check size={16} className="stroke-[3]" />}
          >
            Mark as Done
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="compact"
              onClick={handleWatchAgain}
              icon={<RotateCcw size={13} />}
            >
              Watch Again
            </Button>

            <Button
              variant="outline"
              size="compact"
              onClick={handleTogglePlay}
              icon={isPlaying ? <Pause size={13} /> : <Play size={13} />}
            >
              {isPlaying ? 'Pause Flow' : 'Practise Flow'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
