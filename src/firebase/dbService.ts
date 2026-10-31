import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { UserProfile, Challenge, JournalEntry, CommunityPost } from '../types/yugal';

/**
 * Save or update user profile in /users/{userId}
 */
export async function syncUserProfile(user: UserProfile, uid: string): Promise<void> {
  const path = `users/${uid}`;
  try {
    await setDoc(
      doc(db, 'users', uid),
      {
        userId: uid,
        name: user.name,
        email: user.emailOrPhone,
        avatar: user.avatar,
        boxCode: user.boxCode,
        isBoxActivated: user.isBoxActivated,
        lifePhase: user.lifePhase,
        completedChallengesCount: user.completedChallengesCount,
        streakDays: user.streakDays,
        lastPracticedDays: user.lastPracticedDays,
        savedAffirmationIds: user.savedAffirmationIds,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Fetch user profile from /users/{userId}
 */
export async function fetchUserProfile(uid: string): Promise<Partial<UserProfile> | null> {
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as Partial<UserProfile>;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
    return null;
  }
}

/**
 * Save completed challenge to /users/{userId}/challenges/{challengeId}
 */
export async function saveChallengeCompletion(
  uid: string,
  challenge: Challenge,
  verifiedWithAi: boolean = false,
  aiNotes: string = '',
  videoName: string = ''
): Promise<void> {
  const path = `users/${uid}/challenges/${challenge.id}`;
  try {
    await setDoc(doc(db, 'users', uid, 'challenges', challenge.id), {
      userId: uid,
      challengeId: challenge.id,
      challengeNumber: challenge.number,
      phase: challenge.phase,
      status: 'completed',
      completedAt: new Date().toISOString(),
      verifiedWithAi,
      aiVerificationNotes: aiNotes,
      videoFileName: videoName,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save private reflection to /users/{userId}/journal/{entryId}
 */
export async function saveDbJournalEntry(uid: string, entry: JournalEntry): Promise<void> {
  const path = `users/${uid}/journal/${entry.id}`;
  try {
    await setDoc(doc(db, 'users', uid, 'journal', entry.id), {
      userId: uid,
      date: entry.date,
      time: entry.time,
      mood: entry.mood,
      title: entry.title,
      preview: entry.preview,
      content: entry.content,
      phaseTag: entry.phaseTag || 'CALM',
      linkedChallengeId: entry.linkedChallengeId || '',
      isPrivate: true,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save AI somatic verification record to /users/{userId}/aiVerifications/{id}
 */
export async function saveDbAiVerification(
  uid: string,
  verification: {
    id: string;
    challengeId: string;
    challengeNumber: number;
    status: 'verified' | 'analyzing' | 'failed';
    feedback: string;
    confidenceScore: number;
    videoName: string;
  }
): Promise<void> {
  const path = `users/${uid}/aiVerifications/${verification.id}`;
  try {
    await setDoc(doc(db, 'users', uid, 'aiVerifications', verification.id), {
      userId: uid,
      challengeId: verification.challengeId,
      challengeNumber: verification.challengeNumber,
      status: verification.status,
      feedback: verification.feedback,
      confidenceScore: verification.confidenceScore,
      videoName: verification.videoName,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Save community post to /communityPosts/{postId}
 */
export async function saveDbCommunityPost(post: CommunityPost, uid: string): Promise<void> {
  const path = `communityPosts/${post.id}`;
  try {
    await setDoc(doc(db, 'communityPosts', post.id), {
      authorId: uid,
      authorName: post.authorName,
      authorHandle: post.authorHandle,
      authorAvatar: post.authorAvatar,
      isAnonymous: !!post.isAnonymous,
      content: post.content,
      phaseTag: post.phaseTag || 'CALM',
      challengeTag: post.challengeTag || '',
      likes: post.likes || 0,
      reposts: post.reposts || 0,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

/**
 * Like community post
 */
export async function updateDbPostLikes(postId: string, newLikes: number): Promise<void> {
  const path = `communityPosts/${postId}`;
  try {
    await updateDoc(doc(db, 'communityPosts', postId), {
      likes: newLikes,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
