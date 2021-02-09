/**
 * @description Method for sleeping thread
 * @param {number} ms number of miliseconds for thread to sleep
 */
export const snooze = function(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * @description Method for getting string in between characters
 * @param text String to get inner string from
 * @param firstCharacter first (opening) character to check
 * @param secondCharacter second (closing) character to check
 */
export const getStringBetweenCharacters = function(
  text: string,
  firstCharacter: string,
  secondCharacter: string
) {
  return text.substring(
    text.lastIndexOf(firstCharacter) + 1,
    text.lastIndexOf(secondCharacter)
  );
};
