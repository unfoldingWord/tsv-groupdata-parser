import { parseReferenceToList } from 'bible-reference-range';
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
 * @param {object} bookData - indexed by chapter and then verse ref
 * @param {string} ref - formats such as “2:4-5”, “2:3a”, “2-3b-4a”, “2:7,12”, “7:11-8:2”, "6:15-16;7:2"
 * @param {boolean} failOnMissingVerse
 * @returns {string}
 */
export function getVerseString(bookData, ref, failOnMissingVerse = true) {
  let verseObjects_ = [];
  const verseRefs = getVerses(bookData, ref);

  for (const verseRef of verseRefs) {
    if (!verseRef.verseData && failOnMissingVerse) {
      return null;
    }

    const verseData = verseRef.verseData;
    let verseObjects; // (verseData && verseData.verseObjects);

    if (verseData) {
      if (typeof verseData === 'string') {
        verseObjects = [{ text: verseData }];
      } else if (Array.isArray(verseData)) {
        verseObjects = verseData;
      } else if (verseData.verseObjects) {
        verseObjects = verseData.verseObjects;
      }
      Array.prototype.push.apply(verseObjects_, verseObjects);
    }
  }

  return verseObjectsToString(verseObjects_);
}

function findVerseInVerseRange(chapterData, verse, verseData, verses, chapter) {
  const verseKeys = Object.keys(chapterData);
  let foundVerseKey;

  for (const verseKey of verseKeys) {
    if (isVerseSpan(verseKey)) {
      const { low, high } = getVerseSpanRange(verseKey);

      if ((verse >= low) && (verse <= high)) {
        verseData = chapterData[verseKey];

        verses.push({
          chapter,
          verse: verseKey,
          verseData,
        });
        foundVerseKey = verse;
        verse = high + 1; // move to verse after range
        break;
      }
    }
  }
  return {
    foundVerseKey,
    verse,
    verseData,
  };
}

/**
 * find all verses contained in ref, returns array of references
 * @param {object} bookData - indexed by chapter and then verse ref
 * @param {string} ref - formats such as “2:4-5”, “2:3a”, “2-3b-4a”, “2:7,12”, “7:11-8:2”, "6:15-16;7:2"
 * @returns {[{chapter, verse, verseData}]}
 */
export function getVerses(bookData, ref) {
  const verses = [];
  const chunks = parseReferenceToList(ref);
  let chapterData, verseData;

  for (const chunk of chunks) {
    if (!chunk.endVerse) {
      const chapter = chunk.chapter;
      chapterData = bookData[chapter];
      let verse = chunk.verse;
      verseData = chapterData && chapterData[verse];

      if (!verseData && chapterData ) { // if verse doesn't exist, check for verse spans in chapter data
        const __ret = findVerseInVerseRange(chapterData, verse, verseData, verses, chapter);
        verse = __ret.verse;
        verseData = __ret.verseData;

        if (__ret.foundVerseKey) {
          continue;
        }
      }

      verses.push({
        chapter,
        verse,
        verseData,
      });
    } else { // handle range
      let chapter = chunk.chapter;
      let verse = chunk.verse;
      const endVerse = chunk.endVerse;
      const endChapter = chunk.endChapter || chapter;

      while (isVerseInRange(chapter, verse, endChapter, endVerse)) {
        chapterData = bookData[chapter];
        verseData = chapterData && chapterData[verse];

        if (!verseData && chapterData ) { // if verse doesn't exist, check for verse spans in chapter data
          const __ret = findVerseInVerseRange(chapterData, verse, verseData, verses, chapter);
          verse = __ret.verse;
          verseData = __ret.verseData;

          if (__ret.foundVerseKey) {
            continue;
          }
        }

        if (!verseData) { // if past end of chapter, skip to next
          chapter += 1;
          verse = 1;
          continue;
        }

        verses.push({
          chapter,
          verse,
          verseData,
        });
        verse += 1;
      }
    }
  }

  return verses;
}
