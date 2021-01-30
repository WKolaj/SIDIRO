/**
 * @description Method for sleeping thread
 * @param {number} ms number of miliseconds for thread to sleep
 */
export const snooze = function(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
