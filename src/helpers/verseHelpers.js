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
 * find all verses in ref and return as long string
 * @param {object} bookData
 * @param {string} ref
 * @param {boolean} failOnMissingVerse
 * @returns {string}
 */
export function getVerseString(bookData, ref, failOnMissingVerse = true) {
  let verseObjects_ = [];
  const verseRefs = getVerses(bookData, ref);

  for (const verseRef of verseRefs) {
    if (!verseRef.found && failOnMissingVerse) {
      return null;
    }

    const chapterData = bookData[verseRef.chapter];
    const verseData = chapterData && chapterData[verseRef.verse];
    const verseObjects = (verseData && verseData.verseObjects);

    if (verseObjects) {
      Array.prototype.push.apply(verseObjects_, verseObjects);
    }
  }

  return verseObjectsToString(verseObjects_);
}

/**
 * find all verses contained in ref, returns array of references
 * @param {object} bookData
 * @param {string} ref
 * @returns {[{chapter, verse, found}]}
 */
export function getVerses(bookData, ref) {
  const verses = [];
  const chunks = parseReferenceToList(ref);

  for (const chunk of chunks) {
    if (!chunk.endVerse) {
      const chapter = chunk.chapter;
      const chapterData = bookData[chapter];
      const verse = chunk.verse;
      const found = chapterData && chapterData[verse];

      verses.push({
        chapter,
        verse,
        found,
      });
    } else { // handle range
      let chapter = chunk.chapter;
      let verse = chunk.verse;
      const endVerse = chunk.endVerse;
      const endChapter = chunk.endChapter || chapter;

      while (isVerseInRange(chapter, verse, endChapter, endVerse)) {
        const chapterData = bookData[chapter];
        let verseData = chapterData && chapterData[verse];

        if (!verseData && chapterData ) { // if verse doesn't exist, check for verse spans in chapter data
          const verses = Object.keys(chapterData);
          let foundSpan = false;

          for (const verseKey of verses) {
            if (isVerseSpan(verseKey)) {
              const { low, high } = getVerseSpanRange(verseKey);

              if ((verse >= low) && (verse <= high)) {
                const found = chapterData[verseKey];

                verses.push({
                  chapter,
                  verse: verseKey,
                  found,
                });
                verse = high + 1; // move to verse after range
                foundSpan = true;
                break;
              }
            }
          }

          if (foundSpan) {
            continue;
          }
        }

        if (!verseData) { // if past end of chapter, skip to next
          chapter += 1;
          verse = 1;
          continue;
        }

        const found = verseData;

        verses.push({
          chapter,
          verse,
          found,
        });
        verse += 1;
      }
    }
  }

  return verses;
}
