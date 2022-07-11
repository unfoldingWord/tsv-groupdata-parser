import { parseReferenceToList } from '../tsvToGroupData';
import { verseObjectsToString } from './verseObjecsHelper';

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

/**
 * make sure that chapter and verse are lower than or equal to end chapter and verse
 * @param {int} chapter
 * @param {int} verse
 * @param {int} endChapter
 * @param {int} endVerse
 * @returns {boolean}
 */
export function isVerseInRange(chapter, verse, endChapter, endVerse) {
  if (chapter < endChapter) {
    return true;
  }

  if (chapter === endChapter) {
    if (verse <= endVerse) {
      return true;
    }
  }
  return false;
}

/**
 * find all verses in ref
 * @param {object} bookData
 * @param {string} ref
 * @returns {string}
 */
export function getVerseString(bookData, ref) {
  let verseObjects_ = [];
  const chunks = parseReferenceToList(ref);

  for (const chunk of chunks) {
    if (!chunk.endVerse) {
      const chapterData = bookData[chunk.chapter];
      const { verseObjects = null } = chapterData[chunk.verse];
      verseObjects_ = verseObjects_.concat(verseObjects);
    } else { // handle range
      let chapter = chunk.chapter;
      let verse = chunk.verse;
      const endVerse = chunk.endVerse;
      const endChapter = chunk.endChapter || chapter;

      while (isVerseInRange(chapter, verse, endChapter, endVerse)) {
        const chapterData = bookData[chapter];
        let verseData = chapterData[verse];

        if (!verseData) { // check for verse spans in chapter data
          const verses = Object.keys(chapterData);
          let foundSpan = false;

          for (const verseKey of verses) {
            if (isVerseSpan(verseKey)) {
              const { low, high } = getVerseSpanRange(verseKey);

              if ((verse >= low) && (verse <= high)) {
                const { verseObjects = null } = chapterData[verseKey];
                verseObjects_ = verseObjects_.concat(verseObjects);
                verse = high + 1;
                foundSpan = true;
                break;
              }
            }
          }

          if (foundSpan) {
            continue;
          }
        }

        if (!verseData) { // if past end of chapter
          chapter += 1;
          verse = 1;
          continue;
        }

        const { verseObjects = null } = verseData;
        verseObjects_ = verseObjects_.concat(verseObjects);
        verse += 1;
      }
    }
  }

  return verseObjectsToString(verseObjects_);
}
