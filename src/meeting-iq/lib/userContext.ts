// @ts-nocheck
import { useEffect } from 'react';
import jmPhoto from '@miq/assets/advisors/jm.jpg';
import jaPhoto from '@miq/assets/advisors/ja.jpg';
import skPhoto from '@miq/assets/advisors/sk.jpg';
import { useCurrentUser } from '@/lib/currentUser';

export interface UserProfile {
  name: string;
  role: string;
  firstName: string;
  lastName: string;
  initials: string;
}

export interface Advisor {
  id: string;
  name: string;
  initials: string;
  photo?: string;
}

// Primary advisor slot is the logged-in user; the rest are mock teammates.
// `advisors` is mutated at runtime by `setMeetingIQCurrentUser` so the
// "me" filter avatar and any deterministic assignment stay in sync.
export const advisors: Advisor[] = [
  { id: 'me', name: 'You', initials: 'YOU', photo: jmPhoto },
  { id: 'ja', name: 'Jamie Alvarez', initials: 'JA', photo: jaPhoto },
  { id: 'sk', name: 'Sarah Kim', initials: 'SK', photo: skPhoto },
];

/** Deterministic advisor assignment based on client/meeting name */
export const getAdvisorForName = (name: string): Advisor => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return advisors[Math.abs(hash) % advisors.length];
};

// Mutable singleton so plain `currentUser.firstName` style reads still work.
// Defaults to a generic Schwab advisor; replaced at runtime by the auth sync hook.
export const currentUser: UserProfile = {
  name: 'Schwab Advisor',
  role: 'Schwab Financial Advisor',
  firstName: 'Advisor',
  lastName: '',
  initials: 'SA',
};

export const setMeetingIQCurrentUser = (next: Partial<UserProfile>) => {
  Object.assign(currentUser, next);
  if (next.name || next.initials) {
    advisors[0] = {
      ...advisors[0],
      name: currentUser.name,
      initials: currentUser.initials || advisors[0].initials,
    };
  }
};

/**
 * Mount once inside the Meeting IQ route tree to keep the mutable
 * `currentUser` in sync with the logged-in Advisor360 user.
 */
export const useSyncMeetingIQUser = () => {
  const user = useCurrentUser();
  useEffect(() => {
    setMeetingIQCurrentUser({
      name: user.fullName,
      role: 'Schwab Financial Advisor',
      firstName: user.firstName,
      lastName: user.lastName,
      initials: user.initials,
    });
  }, [user.fullName, user.firstName, user.lastName, user.initials]);
};

export const getTimeBasedGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

export const getPersonalizedGreeting = (): string => {
  return `${getTimeBasedGreeting()} ${currentUser.firstName}!`;
};
