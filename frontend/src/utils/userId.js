/**
 * Persistent Stable User Identity Utility
 * Manages a persistent user ID stored in localStorage so user settings,
 * search history, saved locations, chat history, and dashboard preferences
 * remain associated with the current browser instance across reloads.
 */

const USER_ID_KEY = 'weathergpt_user_id';

export function getOrCreateUserId() {
  if (typeof window === 'undefined') return 'anonymous';

  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId || userId === 'anonymous') {
    userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function getUserId() {
  return getOrCreateUserId();
}

export default {
  getOrCreateUserId,
  getUserId
};
