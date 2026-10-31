/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  Challenge, 
  Badge, 
  JournalEntry, 
  CommunityPost, 
  Affirmation, 
  HealthMetric, 
  Expert,
  MoodType,
  LifePhase 
} from './types/yugal';
import { 
  INITIAL_USER, 
  INITIAL_CHALLENGES, 
  INITIAL_BADGES, 
  INITIAL_JOURNAL_ENTRIES, 
  INITIAL_COMMUNITY_POSTS, 
  INITIAL_AFFIRMATIONS, 
  INITIAL_HEALTH_METRICS,
  EXPERTS 
} from './data/yugalData';
import { Header } from './components/Header';
import { Navigation, YugalTab } from './components/Navigation';
import { HomeScreen } from './components/core/HomeScreen';
import { ScannerScreen } from './components/core/ScannerScreen';
import { ChallengeUnlockedScreen } from './components/core/ChallengeUnlockedScreen';
import { ChallengePracticeScreen } from './components/core/ChallengePracticeScreen';
import { ChallengeCompletionScreen } from './components/core/ChallengeCompletionScreen';
import { JournalTab } from './components/tabs/JournalTab';
import { YugalAiTab } from './components/tabs/YugalAiTab';
import { ProfileTab } from './components/tabs/ProfileTab';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { ExpertsModal } from './components/modals/ExpertsModal';
import { AffirmationModal } from './components/modals/AffirmationModal';
import { RewardsModal } from './components/modals/RewardsModal';
import { InsightsModal } from './components/modals/InsightsModal';
import { SettingsModal } from './components/modals/SettingsModal';
import { UiKitModal } from './components/modals/UiKitModal';
import { StatesModal } from './components/modals/StatesModal';
import { playSingingBowl, playSoftTap } from './utils/audio';

// Firebase Auth & Firestore imports
import { auth, googleProvider } from './firebase/config';
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  syncUserProfile, 
  fetchUserProfile, 
  saveChallengeCompletion, 
  saveDbJournalEntry, 
  saveDbAiVerification, 
  saveDbCommunityPost, 
  updateDbPostLikes 
} from './firebase/dbService';

export default function App() {
  // Firebase Auth user
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);

  // Persistent or stateful user data
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('yugal_user_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USER;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    try {
      const saved = localStorage.getItem('yugal_challenges_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_CHALLENGES;
  });

  const [badges, setBadges] = useState<Badge[]>(() => {
    try {
      const saved = localStorage.getItem('yugal_badges_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_BADGES;
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('yugal_journal_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_JOURNAL_ENTRIES;
  });

  const [communityPosts, setCommunityPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem('yugal_posts_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_COMMUNITY_POSTS;
  });

  const [affirmations, setAffirmations] = useState<Affirmation[]>(INITIAL_AFFIRMATIONS);

  // Flow State
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [activeTab, setActiveTab] = useState<YugalTab>('home');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  // Active Challenge (Card 8 "Palm Over Heart" by default)
  const [currentChallenge, setCurrentChallenge] = useState<Challenge>(challenges[7] || challenges[0]);

  // Challenge Flow Sub-screens: 'none' | 'scanner' | 'unlocked' | 'practice' | 'completed'
  const [challengeStep, setChallengeStep] = useState<'none' | 'scanner' | 'unlocked' | 'practice' | 'completed'>('none');
  const [flowTargetChallenge, setFlowTargetChallenge] = useState<Challenge | null>(null);
  const [completedRewardBadge, setCompletedRewardBadge] = useState<Badge | undefined>(undefined);

  // Modals
  const [isUiKitOpen, setIsUiKitOpen] = useState(false);
  const [isStatesModalOpen, setIsStatesModalOpen] = useState(false);
  const [isExpertsModalOpen, setIsExpertsModalOpen] = useState(false);
  const [selectedExpertForModal, setSelectedExpertForModal] = useState<Expert | null>(null);
  const [isAffirmationModalOpen, setIsAffirmationModalOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        // Load cloud profile or sync current user
        const remoteProfile = await fetchUserProfile(fUser.uid);
        if (remoteProfile) {
          setUser((prev) => ({
            ...prev,
            ...remoteProfile,
            name: remoteProfile.name || fUser.displayName || prev.name,
            avatar: remoteProfile.avatar || fUser.photoURL || prev.avatar,
            emailOrPhone: fUser.email || prev.emailOrPhone,
          }));
        } else {
          // Initialize in Firestore
          syncUserProfile(
            {
              ...user,
              name: fUser.displayName || user.name,
              avatar: fUser.photoURL || user.avatar,
              emailOrPhone: fUser.email || user.emailOrPhone,
            },
            fUser.uid
          );
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('yugal_user_v1', JSON.stringify(user));
      localStorage.setItem('yugal_challenges_v1', JSON.stringify(challenges));
      localStorage.setItem('yugal_badges_v1', JSON.stringify(badges));
      localStorage.setItem('yugal_journal_v1', JSON.stringify(journalEntries));
      localStorage.setItem('yugal_posts_v1', JSON.stringify(communityPosts));
    } catch (e) {}

    // Also sync user profile to Firestore if signed in
    if (firebaseUser) {
      syncUserProfile(user, firebaseUser.uid);
    }
  }, [user, challenges, badges, journalEntries, communityPosts, firebaseUser]);

  const handleGoogleSignIn = async () => {
    try {
      playSoftTap();
      const res = await signInWithPopup(auth, googleProvider);
      if (res.user) {
        setUser((prev) => ({
          ...prev,
          name: res.user.displayName || prev.name,
          avatar: res.user.photoURL || prev.avatar,
          emailOrPhone: res.user.email || prev.emailOrPhone,
        }));
        playSingingBowl(528, 2);
      }
    } catch (err) {
      console.warn('Google sign-in completed or closed', err);
    }
  };

  const handleLogout = async () => {
    try {
      playSoftTap();
      await signOut(auth);
      setFirebaseUser(null);
      setShowOnboarding(true);
    } catch (e) {}
  };

  // Handlers for Challenge Flow
  const handleOpenScanner = (target?: Challenge) => {
    setFlowTargetChallenge(target || currentChallenge);
    setChallengeStep('scanner');
  };

  const handleCardFoundInScanner = (challenge: Challenge) => {
    setFlowTargetChallenge(challenge);
    setChallengeStep('unlocked');
  };

  const handleBeginChallenge = () => {
    setChallengeStep('practice');
  };

  const handleMarkAsDone = (
    verifiedWithAi: boolean = false,
    aiNotes: string = '',
    videoName: string = ''
  ) => {
    playSingingBowl(528, 3.0);
    const target = flowTargetChallenge || currentChallenge;

    // Update challenge as completed
    const updatedChallenges = challenges.map((c) => {
      if (c.id === target.id) {
        return {
          ...c,
          status: 'completed' as const,
          completedAt: new Date().toISOString(),
        };
      }
      return c;
    });
    setChallenges(updatedChallenges);

    // Update user stats
    const newCount = updatedChallenges.filter((c) => c.status === 'completed').length;
    setUser((prev) => ({
      ...prev,
      completedChallengesCount: newCount,
      streakDays: prev.streakDays + 1,
    }));

    // Find and award badge
    const matchedBadge = badges.find((b) => b.id === target.rewardBadgeId);
    if (matchedBadge) {
      setBadges((prev) =>
        prev.map((b) => (b.id === matchedBadge.id ? { ...b, status: 'earned' as const, earnedDate: 'Just now' } : b))
      );
      setCompletedRewardBadge(matchedBadge);
    }

    // Persist completion and AI verification to Firestore if signed in
    if (firebaseUser) {
      saveChallengeCompletion(firebaseUser.uid, target, verifiedWithAi, aiNotes, videoName);
      if (verifiedWithAi) {
        saveDbAiVerification(firebaseUser.uid, {
          id: `verify-${Date.now()}`,
          challengeId: target.id,
          challengeNumber: target.number,
          status: 'verified',
          feedback: aiNotes || 'Somatic posture and rhythm verified by Yugal AI.',
          confidenceScore: 98,
          videoName: videoName || 'practice.mp4',
        });
      }
    }

    setChallengeStep('completed');
  };

  const handlePickRandom = () => {
    playSoftTap();
    const pending = challenges.filter((c) => c.status !== 'completed');
    const pool = pending.length > 0 ? pending : challenges;
    const randomCard = pool[Math.floor(Math.random() * pool.length)];
    setFlowTargetChallenge(randomCard);
    setChallengeStep('unlocked');
  };

  const handleSelectChallenge = (c: Challenge) => {
    setFlowTargetChallenge(c);
    setChallengeStep('unlocked');
  };

  const handleToggleSaveAffirmation = (id: string) => {
    setAffirmations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, isSaved: !a.isSaved } : a))
    );
  };

  const handleSaveJournalSnippet = (text: string, mood: MoodType) => {
    const newEntry: JournalEntry = {
      id: `j-${Date.now()}`,
      date: 'Today, Oct 30',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood,
      title: 'Daily Reflection Snippet',
      preview: text.slice(0, 100) + '...',
      content: text,
      phaseTag: currentChallenge.phase,
      linkedChallengeId: currentChallenge.id,
      isPrivate: true,
    };
    setJournalEntries([newEntry, ...journalEntries]);

    // Save to Firestore if authenticated
    if (firebaseUser) {
      saveDbJournalEntry(firebaseUser.uid, newEntry);
    }
  };

  const handleAddCommunityPost = (postData: Omit<CommunityPost, 'id' | 'likes' | 'reposts' | 'replies' | 'timeAgo'>) => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}`,
      timeAgo: 'Just now',
      likes: 0,
      reposts: 0,
      replies: [],
    };
    setCommunityPosts([newPost, ...communityPosts]);

    // Save to Firestore if authenticated
    if (firebaseUser) {
      saveDbCommunityPost(newPost, firebaseUser.uid);
    }
  };

  const handleLikePost = (postId: string) => {
    const targetPost = communityPosts.find((p) => p.id === postId);
    if (!targetPost) return;

    const isLiked = targetPost.userLiked;
    const newLikesCount = isLiked ? targetPost.likes - 1 : targetPost.likes + 1;

    setCommunityPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            userLiked: !isLiked,
            likes: newLikesCount,
          };
        }
        return p;
      })
    );

    // Save to Firestore if authenticated
    if (firebaseUser) {
      updateDbPostLikes(postId, newLikesCount);
    }
  };

  // If Onboarding is active, render full 7-step Onboarding
  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-[#04061A] text-white flex justify-center selection:bg-[#FFB800]/20 selection:text-white">
        <div className="w-full max-w-[420px] min-h-screen flex flex-col bg-[#04061A] shadow-2xl border-x border-[rgba(201,204,224,0.08)]">
          <OnboardingFlow
            onComplete={(updates) => {
              setUser((prev) => ({ ...prev, ...updates }));
              setShowOnboarding(false);
            }}
            onLoginDemo={() => setShowOnboarding(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#04061A] text-[#DFE0FE] flex justify-center relative overflow-x-hidden selection:bg-[#FFB800]/20 selection:text-white font-['DM_Sans']">
      {/* Living Atmospheric Ambient Overlays */}
      <div 
        className="fixed -top-24 -left-24 w-[380px] h-[380px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #FFB800 0%, transparent 70%)',
          filter: 'blur(90px)',
          opacity: 0.14,
        }}
      />
      <div 
        className="fixed bottom-10 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #2FA8F0 0%, transparent 70%)',
          filter: 'blur(90px)',
          opacity: 0.14,
        }}
      />
      <div 
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full pointer-events-none z-0"
        style={{
          background: 'radial-gradient(circle, #D6469A 0%, transparent 70%)',
          filter: 'blur(100px)',
          opacity: 0.08,
        }}
      />

      {/* Main Viewport Container: Defaults to iOS standard 390x844 dimensions or wide view */}
      <div 
        className={`w-full relative z-10 transition-all duration-300 min-h-screen flex flex-col ${
          isMobileFrame 
            ? 'max-w-[420px] min-h-[844px] shadow-[0_0_60px_rgba(0,0,0,0.85)] border-x border-[rgba(201,204,224,0.08)] bg-[#04061A]/95' 
            : 'max-w-2xl px-4'
        }`}
      >
        {/* Top Header with Google Auth / Cloud Sync */}
        <Header
          completedCount={user.completedChallengesCount}
          totalChallenges={21}
          soundEnabled={soundEnabled}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          isMobileFrame={isMobileFrame}
          onToggleFrame={() => setIsMobileFrame(!isMobileFrame)}
          onOpenUiKit={() => setIsUiKitOpen(true)}
          onOpenStatesModal={() => setIsStatesModalOpen(true)}
          onRestartOnboarding={() => setShowOnboarding(true)}
          isSignedIn={!!firebaseUser}
          userEmail={firebaseUser?.email}
          onGoogleSignIn={handleGoogleSignIn}
        />

        {/* Content Screens */}
        <main className="flex-1 px-4 pt-3 pb-8">
          {activeTab === 'home' && (
            <HomeScreen
              user={user}
              challenges={challenges}
              activeChallenge={currentChallenge}
              todayAffirmation={affirmations[0]}
              onOpenScanner={handleOpenScanner}
              onPickRandom={handlePickRandom}
              onSelectChallenge={handleSelectChallenge}
              onSaveJournalSnippet={handleSaveJournalSnippet}
              onToggleSaveAffirmation={handleToggleSaveAffirmation}
              onNavigateTab={(tab) => setActiveTab(tab)}
            />
          )}

          {activeTab === 'journal' && (
            <JournalTab
              entries={journalEntries}
              posts={communityPosts}
              challenges={challenges}
              user={user}
              onAddJournalEntry={(e) => {
                const newId = `j-${Date.now()}`;
                const newE = { ...e, id: newId };
                setJournalEntries([newE, ...journalEntries]);
                if (firebaseUser) {
                  saveDbJournalEntry(firebaseUser.uid, newE);
                }
              }}
              onAddCommunityPost={handleAddCommunityPost}
              onLikePost={handleLikePost}
              onOpenInsights={() => setIsInsightsModalOpen(true)}
            />
          )}

          {activeTab === 'yugal_ai' && (
            <YugalAiTab userName={user.name} />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              user={user}
              challenges={challenges}
              onOpenRewards={() => setIsRewardsModalOpen(true)}
              onOpenSavedAffirmations={() => setIsAffirmationModalOpen(true)}
              onOpenInsights={() => setIsInsightsModalOpen(true)}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
              onOpenExperts={() => {
                setSelectedExpertForModal(null);
                setIsExpertsModalOpen(true);
              }}
              onLogout={handleLogout}
            />
          )}
        </main>

        {/* Bottom Tab Bar Navigation */}
        <Navigation
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenScanner={() => handleOpenScanner()}
        />

        {/* =========================================================================
            CORE CHALLENGE FLOW FULLSCREEN OVERLAYS (Batch 2)
           ========================================================================= */}

        {/* Screen 9: Scanner */}
        {challengeStep === 'scanner' && (
          <ScannerScreen
            challenges={challenges}
            targetChallenge={flowTargetChallenge}
            onCardFound={handleCardFoundInScanner}
            onClose={() => setChallengeStep('none')}
            onPickRandom={handlePickRandom}
          />
        )}

        {/* Screen 10: Challenge Unlocked */}
        {challengeStep === 'unlocked' && flowTargetChallenge && (
          <div className="fixed inset-0 z-50 bg-[#04061A] overflow-y-auto">
            <ChallengeUnlockedScreen
              challenge={flowTargetChallenge}
              onBeginChallenge={handleBeginChallenge}
              onOpenExpertProfile={(expert) => {
                setSelectedExpertForModal(expert);
                setIsExpertsModalOpen(true);
              }}
              onBack={() => setChallengeStep('none')}
            />
          </div>
        )}

        {/* Screen 11: Challenge Practice & Video with AI Verify Upload */}
        {challengeStep === 'practice' && flowTargetChallenge && (
          <div className="fixed inset-0 z-50 bg-[#04061A] overflow-y-auto">
            <ChallengePracticeScreen
              challenge={flowTargetChallenge}
              onMarkAsDone={handleMarkAsDone}
              onBack={() => setChallengeStep('unlocked')}
            />
          </div>
        )}

        {/* Screen 12: Completion */}
        {challengeStep === 'completed' && flowTargetChallenge && (
          <div className="fixed inset-0 z-50 bg-[#04061A] overflow-y-auto">
            <ChallengeCompletionScreen
              challenge={flowTargetChallenge}
              badge={completedRewardBadge}
              onSeeProgress={() => {
                setChallengeStep('none');
                setActiveTab('home');
              }}
              onPickAnotherCard={() => {
                setChallengeStep('scanner');
              }}
            />
          </div>
        )}

        {/* =========================================================================
            SUB-SCREENS & MODALS (Batch 3 & System)
           ========================================================================= */}

        {/* Screen 16: Experts Directory & Profile */}
        <ExpertsModal
          isOpen={isExpertsModalOpen}
          onClose={() => setIsExpertsModalOpen(false)}
          selectedExpert={selectedExpertForModal}
          challenges={challenges}
          onSelectChallenge={(c) => {
            setIsExpertsModalOpen(false);
            handleSelectChallenge(c);
          }}
        />

        {/* Screen 17: Large Glowing Affirmation */}
        <AffirmationModal
          isOpen={isAffirmationModalOpen}
          onClose={() => setIsAffirmationModalOpen(false)}
          affirmation={affirmations[0]}
          onToggleSave={handleToggleSaveAffirmation}
        />

        {/* Screen 18: Rewards & Badges */}
        <RewardsModal
          isOpen={isRewardsModalOpen}
          onClose={() => setIsRewardsModalOpen(false)}
          badges={badges}
        />

        {/* Screen 19: Health Insights */}
        <InsightsModal
          isOpen={isInsightsModalOpen}
          onClose={() => setIsInsightsModalOpen(false)}
        />

        {/* Screen 20: Settings & Privacy */}
        <SettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          user={user}
          onUpdateLifePhase={(lp) => setUser((prev) => ({ ...prev, lifePhase: lp }))}
          onRetakeAssessment={() => setShowOnboarding(true)}
          onLogout={handleLogout}
        />

        {/* UI Kit & Foundations Catalog */}
        <UiKitModal
          isOpen={isUiKitOpen}
          onClose={() => setIsUiKitOpen(false)}
        />

        {/* 5 States Matrix Showcase */}
        <StatesModal
          isOpen={isStatesModalOpen}
          onClose={() => setIsStatesModalOpen(false)}
        />
      </div>
    </div>
  );
}
