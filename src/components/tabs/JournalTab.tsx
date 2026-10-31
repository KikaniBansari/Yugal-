import React, { useState } from 'react';
import { 
  JournalEntry, 
  CommunityPost, 
  Phase, 
  MoodType, 
  Challenge, 
  UserProfile 
} from '../../types/yugal';
import { PHASE_CONFIG } from '../../data/yugalData';
import { PhaseTag, FilterChip } from '../ui/Chips';
import { Button } from '../ui/Button';
import { GlowingCircles } from '../ui/GlowingCircles';
import { GlowingLoader } from '../ui/GlowingLoader';
import { 
  Lock, 
  Search, 
  Plus, 
  Heart, 
  Repeat, 
  MessageCircle, 
  Share2, 
  Flame, 
  BarChart2, 
  MoreHorizontal, 
  X, 
  Send, 
  Check, 
  EyeOff, 
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { playSoftTap } from '../../utils/audio';

interface JournalTabProps {
  entries: JournalEntry[];
  posts: CommunityPost[];
  challenges: Challenge[];
  user: UserProfile;
  onAddJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  onAddCommunityPost: (post: Omit<CommunityPost, 'id' | 'likes' | 'reposts' | 'replies' | 'timeAgo'>) => void;
  onLikePost: (postId: string) => void;
  onOpenInsights: () => void;
}

export const JournalTab: React.FC<JournalTabProps> = ({
  entries,
  posts,
  challenges,
  user,
  onAddJournalEntry,
  onAddCommunityPost,
  onLikePost,
  onOpenInsights,
}) => {
  // Top Segmented Toggle: 'journal' vs 'discussion'
  const [subTab, setSubTab] = useState<'journal' | 'discussion'>('journal');

  // Journal Sub-states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>('ALL');
  const [showNewEntryModal, setShowNewEntryModal] = useState(false);

  // New Journal Entry Form states
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newMood, setNewMood] = useState<MoodType>('Good');
  const [newLinkedChallengeId, setNewLinkedChallengeId] = useState<string>('');

  // Discussion Sub-states
  const [discussionFilter, setDiscussionFilter] = useState<'For you' | 'My phase' | 'Following'>('For you');
  const [selectedPhaseChip, setSelectedPhaseChip] = useState<string>('ALL');
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [composeText, setComposeText] = useState('');
  const [postAnonymously, setPostAnonymously] = useState(false);
  const [selectedChallengeTag, setSelectedChallengeTag] = useState<string>('CALM · Challenge 8');
  const [activeMenuPostId, setActiveMenuPostId] = useState<string | null>(null);
  const [threadPost, setThreadPost] = useState<CommunityPost | null>(null);
  const [replyText, setReplyText] = useState('');

  // Filtered Private Entries
  const filteredEntries = entries.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMood = selectedMoodFilter === 'ALL' || e.mood === selectedMoodFilter;
    return matchesSearch && matchesMood;
  });

  // Filtered Community Posts
  const filteredPosts = posts.filter((p) => {
    if (selectedPhaseChip !== 'ALL' && p.phaseTag !== selectedPhaseChip) {
      return false;
    }
    if (discussionFilter === 'My phase') {
      return p.phaseTag === 'CALM';
    }
    return true;
  });

  const handleSaveNewEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;
    playSoftTap();

    const linkedChallenge = challenges.find((c) => c.id === newLinkedChallengeId);

    onAddJournalEntry({
      date: 'Today, Oct 30',
      time: 'Just now',
      mood: newMood,
      title: newTitle.trim(),
      preview: newContent.trim().slice(0, 100) + '...',
      content: newContent.trim(),
      phaseTag: linkedChallenge?.phase || 'CALM',
      linkedChallengeId: newLinkedChallengeId || undefined,
      isPrivate: true,
    });

    setNewTitle('');
    setNewContent('');
    setShowNewEntryModal(false);
  };

  const handlePublishPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!composeText.trim()) return;
    playSoftTap();

    onAddCommunityPost({
      authorName: postAnonymously ? 'Sanctuary Sister' : user.name,
      authorHandle: postAnonymously ? '@anonymous_member' : `@${user.name.toLowerCase()}`,
      authorAvatar: postAnonymously 
        ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
        : user.avatar,
      isAnonymous: postAnonymously,
      content: composeText.trim(),
      phaseTag: 'CALM',
      challengeTag: selectedChallengeTag || undefined,
    });

    setComposeText('');
    setShowComposeModal(false);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !threadPost) return;
    playSoftTap();

    const newReply = {
      id: `rep-${Date.now()}`,
      authorName: user.name,
      authorHandle: `@${user.name.toLowerCase()}`,
      authorAvatar: user.avatar,
      timeAgo: 'Just now',
      content: replyText.trim(),
      likes: 0,
    };

    threadPost.replies.push(newReply);
    setReplyText('');
  };

  return (
    <div className="space-y-4 pb-28 animate-in fade-in duration-300">
      {/* 1. Top Segmented Toggle: "Journal" and "Group Discussion" */}
      <div className="pt-2">
        <div className="p-1 rounded-full bg-[#0D1030] border border-[rgba(201,204,224,0.14)] flex items-center shadow-gold-halo">
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              setSubTab('journal');
            }}
            className={`flex-1 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              subTab === 'journal'
                ? 'bg-spectrum-gradient text-white shadow-coral-halo'
                : 'text-[#C9CCE0] hover:text-white'
            }`}
          >
            Private Journal
          </button>

          <button
            type="button"
            onClick={() => {
              playSoftTap();
              setSubTab('discussion');
            }}
            className={`flex-1 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
              subTab === 'discussion'
                ? 'bg-spectrum-gradient text-white shadow-coral-halo'
                : 'text-[#C9CCE0] hover:text-white'
            }`}
          >
            Group Discussion
          </button>
        </div>
      </div>

      {/* =========================================================================
          SUB-TAB 13A: PRIVATE JOURNAL
         ========================================================================= */}
      {subTab === 'journal' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Bar: Privacy badge, entry count, streak, link to Insights */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-1.5 text-xs text-[#C9CCE0]">
              <Lock size={13} className="text-[#FFB800]" />
              <span className="font-medium text-white/90">Private to you</span>
              <span className="text-[#C9CCE0]/50 font-mono">({entries.length} entries)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-[11px] font-mono text-[#FF7A1A] bg-[#0D1030] px-2 py-0.5 rounded-full border border-white/5">
                <Flame size={12} />
                <span>{user.streakDays}d streak</span>
              </div>

              <button
                type="button"
                onClick={onOpenInsights}
                className="flex items-center gap-1 text-[11px] text-[#2FA8F0] hover:text-white bg-[#0D1030] px-2.5 py-0.5 rounded-full border border-[#2FA8F0]/30 transition-colors cursor-pointer"
              >
                <BarChart2 size={12} />
                <span>Insights</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-[#C9CCE0]/50">
              <Search size={15} />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search your private reflections..."
              className="w-full h-[44px] rounded-2xl bg-[#0D1030] pl-9 pr-4 text-xs text-white placeholder-[#C9CCE0]/40 border border-[rgba(201,204,224,0.12)] focus:border-[#FFB800] outline-none transition-colors"
            />
          </div>

          {/* Mood filter chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['ALL', 'Radiant', 'Good', 'Okay', 'Tired', 'Low'].map((mood) => {
              const isActive = selectedMoodFilter === mood;
              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setSelectedMoodFilter(mood);
                  }}
                  className={`h-[30px] px-3 rounded-full text-xs font-medium tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800] font-semibold'
                      : 'bg-[#0D1030] text-[#C9CCE0] border border-white/5 hover:border-white/15'
                  }`}
                >
                  {mood}
                </button>
              );
            })}
          </div>

          {/* Entry Cards Stream or Empty State */}
          {filteredEntries.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#0D1030]/60 border border-white/5 text-center space-y-3 my-4">
              <div className="w-12 h-12 rounded-full bg-[#FFB800]/10 text-[#FFB800] mx-auto flex items-center justify-center">
                <Lock size={20} />
              </div>
              <h3 className="text-sm font-semibold text-white">
                Your first reflection starts here
              </h3>
              <p className="text-xs text-[#C9CCE0] max-w-xs mx-auto leading-relaxed">
                Record how your body responded to today's Reset Box practice, without any performance pressure.
              </p>
              <div className="pt-2">
                <Button
                  size="compact"
                  fullWidth={false}
                  onClick={() => setShowNewEntryModal(true)}
                  icon={<Plus size={14} />}
                >
                  Inscribe Reflection
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEntries.map((entry) => {
                const phaseMeta = entry.phaseTag ? PHASE_CONFIG[entry.phaseTag] : null;
                return (
                  <div
                    key={entry.id}
                    className="p-4 rounded-2xl bg-[#0D1030] border border-[rgba(201,204,224,0.1)] hover:border-[#FFB800]/40 transition-all shadow-gold-halo space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">
                          {entry.mood === 'Radiant' ? '✨' : entry.mood === 'Good' ? '☀️' : entry.mood === 'Okay' ? '🌿' : entry.mood === 'Tired' ? '🌙' : '🌧️'}
                        </span>
                        <span className="font-semibold text-white text-xs">
                          {entry.mood}
                        </span>
                        {phaseMeta && (
                          <PhaseTag
                            phase={entry.phaseTag!}
                            labelOverride={entry.phaseTag}
                            size="sm"
                          />
                        )}
                      </div>

                      <span className="text-[10px] text-[#C9CCE0]/60 font-mono">
                        {entry.date} · {entry.time}
                      </span>
                    </div>

                    <h4 className="text-sm font-semibold text-white">
                      {entry.title}
                    </h4>

                    <p className="text-xs text-[#C9CCE0]/90 leading-relaxed font-['DM_Sans']">
                      "{entry.content}"
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Floating "+" Button for New Private Entry */}
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              setShowNewEntryModal(true);
            }}
            className="fixed bottom-24 right-5 z-30 w-12 h-12 rounded-full bg-spectrum-gradient text-white flex items-center justify-center shadow-coral-halo active:scale-95 transition-all cursor-pointer"
            title="Inscribe new reflection"
          >
            <Plus size={22} className="stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* =========================================================================
          SUB-TAB 13B: GROUP DISCUSSION (Twitter-style Feed)
         ========================================================================= */}
      {subTab === 'discussion' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Supportive Space Notice Banner */}
          <div className="p-3 rounded-2xl bg-[#0D1030]/80 border border-[#2FA8F0]/30 flex items-center justify-between text-xs text-[#2FA8F0]">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-[#2FA8F0] flex-shrink-0" />
              <span>
                <strong>Be kind.</strong> This is a supportive space visible to other Reset Box members.
              </span>
            </div>
          </div>

          {/* Filter tabs: "For you", "My phase", "Following" */}
          <div className="flex items-center border-b border-white/10 text-xs">
            {(['For you', 'My phase', 'Following'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  playSoftTap();
                  setDiscussionFilter(tab);
                }}
                className={`flex-1 py-2 text-center font-medium transition-colors border-b-2 cursor-pointer ${
                  discussionFilter === tab
                    ? 'border-[#FFB800] text-white font-semibold'
                    : 'border-transparent text-[#C9CCE0]/60 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Phase Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {['ALL', 'MOVE', 'CALM', 'FEEL', 'UNDERSTAND', 'CONNECT'].map((p) => {
              const isActive = selectedPhaseChip === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => {
                    playSoftTap();
                    setSelectedPhaseChip(p);
                  }}
                  className={`h-[28px] px-3 rounded-full text-[11px] font-medium tracking-wide transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#FFB800]/20 text-[#FFB800] border border-[#FFB800] font-semibold'
                      : 'bg-[#0D1030] text-[#C9CCE0] border border-white/5 hover:border-white/15'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>

          {/* Posts Feed */}
          {filteredPosts.length === 0 ? (
            <div className="p-8 rounded-3xl bg-[#0D1030]/60 border border-white/5 text-center space-y-2">
              <h3 className="text-sm font-semibold text-white">
                Be the first to share
              </h3>
              <p className="text-xs text-[#C9CCE0] max-w-xs mx-auto">
                Share a quiet insight or encouragement from your journey.
              </p>
              <div className="pt-2">
                <Button
                  size="compact"
                  fullWidth={false}
                  onClick={() => setShowComposeModal(true)}
                  icon={<Plus size={14} />}
                >
                  Compose Post
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 rounded-2xl bg-[#0D1030] border border-[rgba(201,204,224,0.1)] hover:border-white/20 transition-all shadow-gold-halo"
                >
                  {/* Post Header: Avatar on left, display name, small handle, time ago */}
                  <div className="flex items-start gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-white/15 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-white">
                            {post.authorName}
                          </span>
                          <span className="text-[11px] text-[#C9CCE0]/60 font-mono">
                            {post.authorHandle}
                          </span>
                          <span className="text-[10px] text-[#C9CCE0]/40">· {post.timeAgo}</span>
                        </div>

                        {/* More Menu (Report / Mute) */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setActiveMenuPostId(activeMenuPostId === post.id ? null : post.id)}
                            className="text-[#C9CCE0]/50 hover:text-white p-1 rounded-full cursor-pointer"
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {activeMenuPostId === post.id && (
                            <div className="absolute right-0 top-6 z-20 w-36 rounded-xl bg-[#04061A] border border-white/15 p-1.5 shadow-xl space-y-1 text-xs">
                              <button
                                type="button"
                                onClick={() => setActiveMenuPostId(null)}
                                className="w-full text-left px-2 py-1 rounded-lg text-white hover:bg-white/10"
                              >
                                Mute member
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveMenuPostId(null)}
                                className="w-full text-left px-2 py-1 rounded-lg text-rose-400 hover:bg-rose-500/10"
                              >
                                Report post
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Optional Phase-Coloured Challenge Tag */}
                      {post.challengeTag && (
                        <div className="my-1.5">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#2FA8F0]/15 text-[#2FA8F0] border border-[#2FA8F0]/30">
                            {post.challengeTag}
                          </span>
                        </div>
                      )}

                      {/* Post Text */}
                      <p className="text-xs text-[#DFE0FE] leading-relaxed mt-1 font-['DM_Sans']">
                        {post.content}
                      </p>

                      {/* Row of Icons: Reply, Repost, Like, Share with small counts */}
                      <div className="flex items-center justify-between pt-3 mt-1 text-[#C9CCE0]/70 text-xs border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => {
                            playSoftTap();
                            setThreadPost(post);
                          }}
                          className="flex items-center gap-1.5 hover:text-[#2FA8F0] transition-colors cursor-pointer"
                        >
                          <MessageCircle size={14} />
                          <span className="text-[11px] font-mono">{post.replies.length}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => playSoftTap()}
                          className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer"
                        >
                          <Repeat size={14} />
                          <span className="text-[11px] font-mono">{post.reposts}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            playSoftTap();
                            onLikePost(post.id);
                          }}
                          className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                            post.userLiked ? 'text-rose-400' : 'hover:text-rose-400'
                          }`}
                        >
                          <Heart size={14} className={post.userLiked ? 'fill-current' : ''} />
                          <span className="text-[11px] font-mono">{post.likes}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => playSoftTap()}
                          className="hover:text-white transition-colors cursor-pointer"
                        >
                          <Share2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Floating Gradient "+" Compose Button */}
          <button
            type="button"
            onClick={() => {
              playSoftTap();
              setShowComposeModal(true);
            }}
            className="fixed bottom-24 right-5 z-30 w-12 h-12 rounded-full bg-spectrum-gradient text-white flex items-center justify-center shadow-coral-halo active:scale-95 transition-all cursor-pointer"
            title="Compose supportive reflection"
          >
            <Plus size={22} className="stroke-[2.5]" />
          </button>
        </div>
      )}

      {/* =========================================================================
          MODAL: NEW PRIVATE JOURNAL ENTRY
         ========================================================================= */}
      {showNewEntryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#04061A] border border-[rgba(201,204,224,0.15)] rounded-3xl p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Lock size={15} className="text-[#FFB800]" />
                <h3 className="text-sm font-semibold text-white">
                  Inscribe Private Reflection
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowNewEntryModal(false)}
                className="w-8 h-8 rounded-full bg-[#0D1030] flex items-center justify-center text-[#C9CCE0]"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleSaveNewEntry} className="space-y-3">
              <div>
                <label className="text-xs text-[#C9CCE0] block mb-1">
                  Title or Core Realization
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Surrendering the evening rush..."
                  className="w-full h-[46px] rounded-xl bg-[#0D1030] border border-[rgba(201,204,224,0.12)] px-3.5 text-xs text-white placeholder-[#C9CCE0]/40 outline-none focus:border-[#FFB800]"
                />
              </div>

              <div>
                <label className="text-xs text-[#C9CCE0] block mb-1">
                  How did your physical vessel feel?
                </label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="Record temperatures, breath rhythm, emotional friction, or unexpected peace..."
                  className="w-full p-3 rounded-xl bg-[#0D1030] border border-[rgba(201,204,224,0.12)] text-xs text-white placeholder-[#C9CCE0]/40 outline-none focus:border-[#FFB800] resize-none font-['DM_Sans']"
                />
              </div>

              {/* Optional Linked Challenge */}
              <div>
                <label className="text-xs text-[#C9CCE0] block mb-1">
                  Link to Challenge Card (Optional)
                </label>
                <select
                  value={newLinkedChallengeId}
                  onChange={(e) => setNewLinkedChallengeId(e.target.value)}
                  className="w-full h-[44px] rounded-xl bg-[#0D1030] border border-[rgba(201,204,224,0.12)] px-3 text-xs text-white outline-none focus:border-[#FFB800]"
                >
                  <option value="">No linked challenge</option>
                  {challenges.map((c) => (
                    <option key={c.id} value={c.id}>
                      Card #{c.number}: {c.title} ({c.phase})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2">
                <Button type="submit">
                  Seal Reflection in Sanctuary
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: COMPOSE COMMUNITY POST
         ========================================================================= */}
      {showComposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#04061A] border border-[rgba(201,204,224,0.15)] rounded-3xl p-5 text-white shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">
                Share with Reset Box Members
              </h3>
              <button
                type="button"
                onClick={() => setShowComposeModal(false)}
                className="w-8 h-8 rounded-full bg-[#0D1030] flex items-center justify-center text-[#C9CCE0]"
              >
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handlePublishPost} className="space-y-3">
              {/* Avatar + Author preview */}
              <div className="flex items-center gap-2.5">
                <img
                  src={postAnonymously ? 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' : user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white/15"
                />
                <div>
                  <span className="text-xs font-semibold text-white block">
                    {postAnonymously ? 'Sanctuary Sister' : user.name}
                  </span>
                  <span className="text-[10px] text-[#C9CCE0]/60">
                    Posting to Group Discussion
                  </span>
                </div>
              </div>

              {/* Textbox with 280-char counter */}
              <div className="rounded-2xl bg-[#0D1030] p-3 border border-[rgba(201,204,224,0.12)] focus-within:border-[#FFB800] transition-colors">
                <textarea
                  rows={4}
                  maxLength={280}
                  value={composeText}
                  onChange={(e) => setComposeText(e.target.value)}
                  placeholder="What's on your mind? Share an insight, reflection, or encouragement..."
                  className="w-full bg-transparent text-xs text-white placeholder-[#C9CCE0]/40 outline-none resize-none font-['DM_Sans']"
                />
                <div className="text-right text-[10px] text-[#C9CCE0]/50 font-mono">
                  {composeText.length}/280
                </div>
              </div>

              {/* Optional Challenge Tag Selector */}
              <div>
                <label className="text-[11px] text-[#C9CCE0] block mb-1">
                  Attach Challenge Tag (Optional)
                </label>
                <select
                  value={selectedChallengeTag}
                  onChange={(e) => setSelectedChallengeTag(e.target.value)}
                  className="w-full h-[40px] rounded-xl bg-[#0D1030] border border-white/10 px-3 text-xs text-white outline-none"
                >
                  <option value="">No tag</option>
                  <option value="CALM · Challenge 8">CALM · Challenge 8 (Palm Over Heart)</option>
                  <option value="MOVE · Challenge 1">MOVE · Challenge 1 (Barefoot Grounding)</option>
                  <option value="FEEL · Challenge 11">FEEL · Challenge 11 (Vocal Sigh)</option>
                </select>
              </div>

              {/* "Post anonymously" toggle */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D1030]/60 border border-white/5">
                <div className="flex items-center gap-2">
                  <EyeOff size={15} className="text-[#FFB800]" />
                  <span className="text-xs text-[#DFE0FE]">
                    Post anonymously
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={postAnonymously}
                  onChange={(e) => setPostAnonymously(e.target.checked)}
                  className="accent-[#FFB800] w-4 h-4 cursor-pointer"
                />
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={!composeText.trim()}
                >
                  Post to Discussion
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: THREADED POST DETAIL & REPLIES
         ========================================================================= */}
      {threadPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-md bg-[#04061A] border border-[rgba(201,204,224,0.15)] rounded-3xl p-5 text-white shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <span className="text-xs font-semibold text-white">
                Threaded Discussion
              </span>
              <button
                type="button"
                onClick={() => setThreadPost(null)}
                className="w-8 h-8 rounded-full bg-[#0D1030] flex items-center justify-center text-[#C9CCE0]"
              >
                <X size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {/* Original Post */}
              <div className="p-3.5 rounded-2xl bg-[#0D1030] border border-white/10 space-y-2">
                <div className="flex items-center gap-2">
                  <img
                    src={threadPost.authorAvatar}
                    alt={threadPost.authorName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="text-xs font-semibold text-white block">
                      {threadPost.authorName}
                    </span>
                    <span className="text-[10px] text-[#C9CCE0]/50 font-mono">
                      {threadPost.authorHandle}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-white/95 leading-relaxed">
                  {threadPost.content}
                </p>
              </div>

              {/* Replies List */}
              <div className="space-y-2 pt-1">
                <span className="text-[11px] uppercase font-mono tracking-wider text-[#FFB800] block">
                  Replies ({threadPost.replies.length})
                </span>

                {threadPost.replies.length === 0 ? (
                  <p className="text-xs text-[#C9CCE0]/60 italic py-2">
                    No replies yet. Be the first to share gentle support.
                  </p>
                ) : (
                  threadPost.replies.map((rep) => (
                    <div
                      key={rep.id}
                      className="p-3 rounded-xl bg-[#0D1030]/60 border border-white/5 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img
                            src={rep.authorAvatar}
                            alt={rep.authorName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-xs font-medium text-white">
                            {rep.authorName}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#C9CCE0]/40 font-mono">
                          {rep.timeAgo}
                        </span>
                      </div>
                      <p className="text-xs text-[#C9CCE0] leading-relaxed pl-7">
                        {rep.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Reply Input */}
            <form onSubmit={handleAddReply} className="pt-2 border-t border-white/10 flex gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a supportive reply..."
                className="flex-1 h-[42px] rounded-xl bg-[#0D1030] border border-white/10 px-3 text-xs text-white placeholder-[#C9CCE0]/40 outline-none"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="px-4 h-[42px] rounded-xl bg-spectrum-gradient text-white text-xs font-semibold disabled:opacity-40"
              >
                Reply
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
