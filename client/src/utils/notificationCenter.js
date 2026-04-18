/**
 * Lightweight publish/subscribe helpers for application-wide toast notifications
 * without introducing additional UI dependencies.
 */

const listeners = new Set();

/**
 * Registers a listener invoked whenever a notification is published
 * @param {(payload: { message: string, variant: 'success'|'error'|'info' }) => void} listener - Callback receiving toast payloads
 * @returns {() => void} Unsubscribe function removing the listener
 */
export const subscribeToNotifications = (listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

/**
 * Dispatches a toast notification to all active subscribers
 * @param {string} message - User-visible toast message
 * @param {'success'|'error'|'info'} variant - Visual tone for the toast
 * @returns {void}
 */
export const publishNotification = (message, variant = 'info') => {
  listeners.forEach((listener) => {
    listener({ message, variant });
  });
};
