import React, { useState } from 'react';
import { Challenge, MoodType, UserProfile, Affirmation } from '../../types/yugal';
import { PHASE_CONFIG } from '../../data/yugalData';
import { RadialProgressRing } from '../RadialProgressRing';
import { MoodSelector } from '../ui/MoodSelector';
import { Button } from '../ui/Button';
import { Toast } from '../ui/Toast';
import { 
  QrCode, 
  Shuffle, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Send, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Flame
} from 'lucide-react';
import { playSingingBowl, playSoftTap } from '../../utils/audio';

interface HomeScreenProps {
  user: UserProfile;
  challenges: Challenge[];
  activeChallenge: Challenge;
  todayAffirmation: Affirmation;
  onOpenScanner: (challenge?: Challenge) => void;
  onPickRandom: () => void;
  onSelectChallenge: (challenge: Challenge) => void;
  onSaveJournalSnippet: (text: string, mood: MoodType) => void;
  onToggleSaveAffirmation: (id: string) => void;
  onNavigateTab: (tab: 'journal' | 'profile' | 'yugal_ai') => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  challenges,
  activeChallenge,
  todayAffirmation,
  onOpenScanner,
  onPickRandom,
  onSelectChallenge,
  onSaveJournalSnippet,
  onToggleSaveAffirmation,
  onNavigateTab,
}) => {
  const [currentMood, setCurrentMood] = useState<MoodType>('Good');
  const [mindSnippet, setMindSnippet] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('Saved to your private journal');

  const completedCount = challenges.filter((c) => c.status === 'completed').length;
  const meta = PHASE_CONFIG[activeChallenge.phase] || PHASE_CONFIG.CALM;

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setShowSavedToast(true);
    setTimeout(() => {
      setShowSavedToast(false);
    }, 2800);
  };

  const handleSaveSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mindSnippet.trim()) return;
    playSoftTap();
    onSaveJournalSnippet(mindSnippet.trim(), currentMood);
    setMindSnippet('');
    triggerToast('Reflection saved to your private journal');
  };

  const handleSaveAffirmation = () => {
    playSoftTap();
    onToggleSaveAffirmation(todayAffirmation.id);
    triggerToast(
      todayAffirmation.isSaved 
        ? 'Affirmation removed from saved collection' 
        : 'Affirmation saved to your sacred library'
    );
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      {/* Toast Notification */}
      <Toast message={toastMessage} isVisible={showSavedToast} />

      {/* 1. Header Greeting with Date, Name, and Photo */}
      <div className="pt-2 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-medium text-[#FFB800] tracking-wide uppercase">
            {formattedDate}
          </span>
          <h1 className="text-2xl font-semibold text-white tracking-tight leading-snug font-['DM_Sans']">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-[#C9CCE0]/75 mt-0.5">
            Harmony held in balance
          </p>
        </div>

        {/* User avatar & streak chip */}
        <div 
          onClick={() => onNavigateTab('profile')}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#0D1030] border border-[#FFB800]/25 text-[11px] text-[#FFB800] font-mono">
            <Flame size={12} className="text-[#FF7A1A]" />
            <span>{user.streakDays}d</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#0D1030] border border-[#FFB800]/40 overflow-hidden ring-2 ring-white/10 group-hover:ring-[#FFB800]/50 transition-all shadow-gold-halo">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* 2. Progress Card: "7 of 21 challenges completed" with Gradient Ring */}
      <div className="p-5 rounded-3xl bg-[#0D1030] border border-[rgba(201,204,224,0.12)] shadow-gold-halo relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#FFB800]/10 rounded-full filter blur-2xl pointer-events-none" />

        <div className="space-y-2 text-center sm:text-left relative z-10 flex-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFB800]/15 text-[#FFB800] text-[10px] font-semibold tracking-wider uppercase">
            <ShieldCheck size={12} />
            <span>RESET BOX PROGRESS</span>
          </div>
          <h2 className="text-xl font-semibold text-white tracking-tight">
            {completedCount} of 21 challenges completed
          </h2>
          <p className="text-xs text-[#C9CCE0]/85 leading-relaxed max-w-xs">
            You are moving through Phase 2: <strong>CALM</strong>. Each physical card drawn deepens your somatic equilibrium.
          </p>
        </div>

        <div className="relative z-10 flex-shrink-0">
          <RadialProgressRing
            completed={completedCount}
            total={21}
            currentPhaseColor={meta.color}
            size={140}
            strokeWidth={7}
          />
        </div>
      </div>

      {/* 3. Primary Action Buttons: "Scan your card" (main) & "Pick at random" */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        <Button
          variant="primary"
          onClick={() => onOpenScanner(activeChallenge)}
          icon={<QrCode size={18} />}
        >
          Scan your card
        </Button>

        <Button
          variant="outline"
          onClick={onPickRandom}
          icon={<Shuffle size={16} className="text-[#FFB800]" />}
        >
          Pick at random
        </Button>
      </div>

      {/* 4. Active Challenge Card Showcase */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#FFB800]">
            Today's Practice
          </span>
          <span className="text-xs text-[#C9CCE0]/60">
            Card #{activeChallenge.number}
          </span>
        </div>

        <div
          onClick={() => onSelectChallenge(activeChallenge)}
          className="p-4 rounded-2xl bg-[#0D1030] border border-[#FFB800]/30 hover:border-[#FFB800] shadow-card-active transition-all cursor-pointer relative overflow-hidden group"
        >
          <div className="flex items-center justify-between mb-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider"
              style={{
                backgroundColor: meta.bgTint,
                color: meta.color,
                border: `1px solid ${meta.borderColor}`,
              }}
            >
              {activeChallenge.phase} · Card {activeChallenge.number}
            </span>
            <div className="flex items-center gap-1 text-xs text-[#C9CCE0]/75">
              <Clock size={12} className="text-[#FFB800]" />
              <span>{activeChallenge.duration}</span>
            </div>
          </div>

          <h3 className="text-base font-semibold text-white group-hover:text-[#FFB800] transition-colors">
            {activeChallenge.title}
          </h3>
          <p className="text-xs text-[#C9CCE0]/80 mt-1 line-clamp-2">
            {activeChallenge.shortDesc}
          </p>

          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <img
                src={activeChallenge.expert.avatar}
                alt={activeChallenge.expert.name}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-white/10"
              />
              <span className="text-[11px] text-[#DFE0FE] font-medium">
                Led by {activeChallenge.expert.name}
              </span>
            </div>
            <span className="text-xs text-[#FFB800] font-medium flex items-center gap-0.5">
              <span>View</span>
              <ChevronRight size={13} />
            </span>
          </div>
        </div>
      </div>

      {/* 5. "How are you feeling?" Mood Row */}
      <div className="p-4 rounded-2xl bg-[#0D1030]/80 border border-[rgba(201,204,224,0.1)] space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white tracking-wide">
            How are you feeling right now?
          </span>
          <span className="text-[11px] text-[#FFB800] font-medium">
            {currentMood}
          </span>
        </div>
        <MoodSelector
          selectedMood={currentMood}
          onSelectMood={(m) => {
            setCurrentMood(m);
            triggerToast(`Mood logged: ${m}`);
          }}
          compact={false}
        />
      </div>

      {/* 6. "What's on your mind?" Journal Input with Character Count and Save */}
      <div className="p-4 rounded-2xl bg-[#0D1030]/80 border border-[rgba(201,204,224,0.1)] space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-white tracking-wide">
            What's on your mind?
          </span>
          <span className="text-[11px] text-[#C9CCE0]/50 font-mono">
            {mindSnippet.length}/280
          </span>
        </div>

        <form onSubmit={handleSaveSnippet} className="space-y-2">
          <div className="rounded-xl bg-[#04061A]/60 border border-[rgba(201,204,224,0.1)] focus-within:border-[#FFB800] p-2.5 transition-colors">
            <textarea
              maxLength={280}
              rows={2}
              value={mindSnippet}
              onChange={(e) => setMindSnippet(e.target.value)}
              placeholder="Jot down a fleeting sensation, worry, or quiet gratitude..."
              className="w-full bg-transparent text-xs text-white placeholder-[#C9CCE0]/40 outline-none resize-none font-['DM_Sans']"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-[#C9CCE0]/60 italic">
              Encrypted & strictly private to you
            </span>
            <button
              type="submit"
              disabled={!mindSnippet.trim()}
              className="px-4 py-1.5 rounded-full bg-spectrum-gradient text-white text-xs font-semibold flex items-center gap-1.5 shadow-coral-halo disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <span>Save</span>
              <Send size={11} />
            </button>
          </div>
        </form>
      </div>

      {/* 7. Today's Affirmation styled like a physical card with Save button */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.08em] font-semibold text-[#FFB800] px-1">
          Daily Sacred Affirmation
        </span>

        <div className="p-5 rounded-2xl bg-[#0D1030] border-[1.5px] border-[#FFB800]/30 shadow-card-active relative overflow-hidden flex flex-col justify-between min-h-[150px]">
          {/* Subtle corner trims mimicking physical box card */}
          <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-[#FFB800]/40" />
          <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-[#FFB800]/40" />
          <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-[#FFB800]/40" />
          <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-[#FFB800]/40" />

          <div className="flex items-center justify-between text-xs text-[#C9CCE0]/60 mb-2">
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#FFB800]">
              {todayAffirmation.authorOrPhase}
            </span>
            <button
              type="button"
              onClick={handleSaveAffirmation}
              className={`p-1.5 rounded-full transition-colors cursor-pointer ${
                todayAffirmation.isSaved
                  ? 'bg-[#FFB800]/20 text-[#FFB800]'
                  : 'bg-white/5 text-[#C9CCE0] hover:text-white'
              }`}
              title={todayAffirmation.isSaved ? 'Saved' : 'Save affirmation'}
            >
              {todayAffirmation.isSaved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
            </button>
          </div>

          <p className="text-base font-medium text-white italic leading-relaxed text-center my-auto py-1 font-['DM_Sans']">
            "{todayAffirmation.text}"
          </p>

          <div className="mt-3 text-center">
            <span className="text-[10px] text-[#C9CCE0]/50 tracking-wider uppercase font-mono">
              YUGAL RESET BOX EDITION 01
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
