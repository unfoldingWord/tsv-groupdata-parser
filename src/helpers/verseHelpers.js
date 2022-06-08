/**
 * splits verse list into individual verses
 * @param {string} verseStr
 * @return {[number]}
 */
export function getVerseList(verseStr) {
  const verses = verseStr.toString().split(',');
  return verses;
}

/**
 * test if verse is valid verse span string
 * @param {string|number} verse
 * @return {boolean}
 */
export function isVerseSpan(verse) {
  const isSpan = (typeof verse === 'string') && verse.includes('-');
  return isSpan;
}

/**
 * test if verse is valid verse list (verse numbers separated by commas)
 * @param {string|number} verse
 * @return {boolean}
 */
export function isVerseList(verse) {
  const isList = (typeof verse === 'string') && verse.includes(',');
  return isList;
}

/**
 * test if verse is valid verse span or verse list
 * @param {string|number} verse
 * @return {boolean}
 */
export function isVerseSet(verse) {
  const isSet = isVerseSpan(verse) || isVerseList(verse);
  return isSet;
}

/**
 * get verse range from span
 * @param {string} verseSpan
 * @return {{high: number, low: number}}
 */
export function getVerseSpanRange(verseSpan) {
  let [low, high] = verseSpan.split('-');

  if (low && high) {
    low = parseInt(low, 10);
    high = parseInt(high, 10);

    if ((low > 0) && (high >= low)) {
      return { low, high };
    }
  }
  return {};
}
