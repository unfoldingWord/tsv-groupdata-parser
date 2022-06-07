/* eslint-disable no-useless-escape */
import path from 'path-extra';
import fs from 'fs-extra';
import tsvtojson from 'tsvtojson';
import { categorizeGroupData } from './tNoteGroupIdCategorization';
import ManageResource from './helpers/ManageResourceAPI';
import { getWordOccurrencesForQuote } from './helpers/wordOccurrenceHelpers';
import { ELLIPSIS } from './utils/constants';
import {
  getBibleIdForLanguage,
  getGroupName,
  getLatestVersionInPath,
  translationHelps,
} from './helpers/resourcesHelpers';
import { hasEllipsis } from './helpers/ellipsisHelpers';

// list of possible hyphen and dash characters used for range separator
const RANGE_SEPARATORS = [
  '-', // HYPHEN-MINUS
  '\u00AD', // SOFT HYPHEN
  '\u2010', // HYPHEN
  '\u2011', // NON-BREAKING HYPHEN
  '\u2012', // FIGURE DASH
  '\u2013', // EN DASH
  '\u2014', // EM DASH
];

/**
 * look for possible dash and hyphen character to see if versePart is a verse range
 * @param {string} versePart
 * @return {number} position of dash or hyphen found, or -1 if not found
 */
function getRangeSeparator(versePart) {
  for (const separator of RANGE_SEPARATORS) {
    const pos = versePart.indexOf(separator);

    if (pos >= 0) {
      return pos;
    }
  }
  return -1;
}

/**
 * takes a reference and splits into individual verses or verse spans.
 * @param {string} ref - reference in format such as:
 *   “2:4-5”, “2:3a”, “2-3b-4a”, “2:7,12”, “7:11-8:2”, "6:15-16;7:2"
 * @return {array}
 */
export function parseReference(ref) {
  const verseChunks = [];
  const refChunks = ref.split(';');

  for (const refChunk of refChunks) {
    if (!refChunk) {
      continue;
    }

    const [chapter_, verse_] = refChunk.split(':');

    if (chapter_ && verse_) {
      let verse = verse_;
      let chapter = chapter_;
      const chapterInt = parseInt(chapter_, 10);
      let verseInt = parseInt(verse_, 10);

      if (isNaN(chapterInt) || isNaN(verseInt)) {
        chapter = toIntIfValid(chapter);
        verse = toIntIfValid(verse);
        verseChunks.push({ chapter, verse });
        continue;
      }
      chapter = chapterInt;
      const verseParts = verse_.split(',');

      for (const versePart of verseParts) {
        if (!versePart) {
          continue;
        }
        verseInt = parseInt(versePart, 10);

        if (isNaN(verseInt)) {
          verseChunks.push({ chapter, verse: versePart });
          continue;
        }

        const pos = (versePart != verseInt) ? getRangeSeparator(versePart) : -2;
        const isRange = pos >= 0;
        verse = verseInt;

        if (isRange) {
          let verseEnd = versePart.substring(pos + 1);
          const verseEndInt = parseInt(verseEnd, 10);

          if (!isNaN(verseEndInt)) {
            verse = verse + '-' + verseEndInt;
          }
        }
        verseChunks.push({ chapter, verse });
      }
    }
  }
  return verseChunks;
}

/**
 * Parses a book tN TSVs and returns an object holding the lists of group ids.
 * @param {string} filepath path to tsv file.
 * @param {string} bookId
 * @param {array} tsvObjects
 * @param {string} toolName tC tool name.
 * @param {object} params When it includes { categorized: true }
 * then it returns the object organized by tn article category.
 * @param {string} originalBiblePath path to original bible.
 * e.g. /resources/el-x-koine/bibles/ugnt/v0.11
 * @param {string} resourcesPath path to the resources dir
 * e.g. /User/john/translationCore/resources
 * @param {string} langId
 * @returns an object with the lists of group ids which each includes an array of groupsdata.
 */
export function tnJsonToGroupData(originalBiblePath, bookId, tsvObjects, resourcesPath, langId, toolName, params, filepath) {
  const groupData = {};

  try {
    const resourceApi = new ManageResource(originalBiblePath, bookId.toLowerCase());

    for (const tsvItem of tsvObjects) {
      if (tsvItem.SupportReference && tsvItem.OrigQuote) {
        const supportReference = cleanGroupId(tsvItem.SupportReference);

        if (!supportReference) {
          continue; // skip over if cleaned support reference is empty
        }

        tsvItem.SupportReference = supportReference; // save cleaned up value
        tsvItem.OccurrenceNote = cleanOccurrenceNoteLinks(tsvItem.OccurrenceNote || '', resourcesPath, langId, bookId.toLowerCase(), tsvItem.Chapter);

        if (!tsvItem.OccurrenceNote) {
          console.warn('tsvToGroupData() - error processing item:', JSON.stringify(tsvItem));
          continue;
        }

        let verseString = null;

        try {
          verseString = resourceApi.getVerseString(tsvItem.Chapter, tsvItem.Verse);
        } catch (e) {
          if (parseInt(tsvItem.Chapter, 10) && parseInt(tsvItem.Verse, 10)) { // only if chapter and verse are valid do we expect verse text
            console.warn(`tsvToGroupData() - error getting verse string: chapter ${tsvItem.Chapter}, verse ${tsvItem.Verse} from ${JSON.stringify(tsvItem)}`, e);
          }
        }

        if (verseString) {
          if (groupData[supportReference]) {
            groupData[supportReference].push(generateGroupDataItem(tsvItem, toolName, verseString));
          } else {
            groupData[supportReference] = [generateGroupDataItem(tsvItem, toolName, verseString)];
          }
        }
      }
    }

    return params && params.categorized ? categorizeGroupData(groupData) : groupData;
  } catch (e) {
    console.error(`tsvToGroupData() - error processing filepath: ${filepath}`, e);
    throw e;
  }
}

/**
 * Parses a book tN TSVs and returns an object holding the lists of group ids.
 * @param {string} filepath path to tsv file.
 * @param {string} toolName tC tool name.
 * @param {object} params When it includes { categorized: true }
 * then it returns the object organized by tn article category.
 * @param {string} originalBiblePath path to original bible.
 * e.g. /resources/el-x-koine/bibles/ugnt/v0.11
 * @param {string} resourcesPath path to the resources dir
 * e.g. /User/john/translationCore/resources
 * @param {string} langId
 * @returns an object with the lists of group ids which each includes an array of groupsdata.
 */
export const tsvToGroupData = async (filepath, toolName, params = {}, originalBiblePath, resourcesPath, langId) => {
  let filePath_ = filepath;
  const tsv = fs.readFileSync(filepath, 'utf8');
  const HARD_NL = `\\n`;

  if (tsv.indexOf(HARD_NL) >= 0) { // see if we need to clean up file before calling library
    const folder = path.dirname(filepath);
    const tempFolder = path.join(folder, 'temp');
    fs.ensureDirSync(tempFolder);
    const baseName = path.base(filepath, true);
    filePath_ = path.join(tempFolder, baseName );
    const cleanedTsv = tsv.replaceAll(HARD_NL, '\n');
    fs.outputFileSync(filePath_, cleanedTsv, 'utf8'); // save cleaned data before calling library
  }

  const tsvObjects = await tsvtojson(filePath_);
  const { Book: bookId } = tsvObjects[0] || {};
  return tnJsonToGroupData(originalBiblePath, bookId, tsvObjects, resourcesPath, langId, toolName, params, filepath);
};

/**
 * Cleans an incorrectly formatted group id.
 * @param {string} groupId group id string that was possibly incorrectly formatted.
 * @returns {string} correctly formatted group id.
 */
export const cleanGroupId = groupId => {
  try {
    // Make sure we only have the element at the very end of a path of /'s or :'s
    // Ex: translate:writing_background => writing_background
    const elements = groupId.split(/[/:]/);
    let cleanedId = elements[elements.length - 1];
    // Replace _ with - in groupId
    // Ex: writing_background => writing-background
    cleanedId = cleanedId.replaceAll('_', '-');
    cleanedId = cleanedId.replaceAll('<br>', '').trim(); // remove white space including html new lines
    return cleanedId;
  } catch (e) {
    console.error(`cleanGroupId() - groupId: ${groupId}`, e);
    return null;
  }
};

/**
 * Converts [[rc://lang/(ta|tw)/...]] links to a markdown link if we can find their article file locally to get the title
 * @param {string} tHelpsLink
 * @param {string} resourcesPath
 * @param {string} langId
 */
export const convertLinkToMarkdownLink = (tHelpsLink, resourcesPath, langId) => {
  try {
    const tHelpsPattern = /\[\[(rc:\/\/[\w-]+\/(ta|tn|tw)\/[^\/]+\/([^\]]+)\/([^\]]+))\]\]/g;
    const parts = tHelpsPattern.exec(tHelpsLink);
    parts.shift();
    const [rcLink, resource, category, file] = parts;
    let resourcePath = path.join(resourcesPath, langId, 'translationHelps', translationHelps[resource]);
    resourcePath = getLatestVersionInPath(resourcePath);
    let articlePath;

    if (resource === 'ta') {
      articlePath = path.join(resourcePath, category, file) + '.md';
    }

    if (resource === 'tw') {
      articlePath = path.join(resourcePath, category.split('/')[1], 'articles', file) + '.md';
    }

    if (articlePath && fs.existsSync(articlePath)) {
      const groupName = getGroupName(articlePath);

      if (groupName) {
        return '[' + groupName + '](' + rcLink + ')';
      }
    }
    return tHelpsLink;
  } catch (e) {
    console.error(`convertLinkToMarkdownLink() - invalid link: ${tHelpsLink}, resourcesPath: ${resourcesPath}, langId: ${langId}`, e);
    return null;
  }
};

/**
 * Fixes Bible links by putting in a rc:// link for the given language, book, chapter and verse
 * @param {string} link
 * @param {string} resourcesPath
 * @param {string} langId
 * @param {string} bookId
 * @param {string|int} chapter
 * @returns {string}
 */
export const fixBibleLink = (link, resourcesPath, langId, bookId, chapter) => {
  const bibleId = getBibleIdForLanguage(path.join(resourcesPath, langId, 'bibles'));

  if (! bibleId) {
    return link;
  }

  // bibleLinkPattern can match the following:
  // [Titus 2:1](../02/01.md)
  // [John 4:2](../../jhn/04/02.md] (parts[4] will be "jhn")
  // [Revelation 10:10](../10/10)
  // [Ephesians 4:1](04/01)
  // [1 Corinthians 15:12](./12.md)
  const bibleLinkPattern = /(\[[^[\]]+\])\s*\((\.+\/)*(([\w-]+)\/){0,1}?((\d+)\/)?(\d+)(\.md)*\)/g;
  const parts = bibleLinkPattern.exec(link);

  if (!parts) {
    return link;
  }
  // Example of parts indexes if the link was [1 John 2:1](../../1jn/02/01.md):
  // 0: "[1 John 2:1](../../1jn/02/01.md)"
  // 1: "[1 John 2:1]"
  // 2: "../"
  // 3: "1jn/""
  // 4: "1jn"
  // 5: "02/"
  // 6: "02"
  // 7: "01"
  // 8: ".md"

  // If the bible link is in the form (../../<bookId>/<chapter>/<verse>) we use the bookId in the link instead of the
  // one passed to this function
  let linkBookId = bookId;

  if (parts[4]) {
    linkBookId = parts[4];
  }

  // If the bible link is in the form (../<chapter>/<verse>) we use the chapter in the link instead of the one passed
  // to this function
  let linkChapter = '' + chapter; // make sure it is a string

  if (parts[6]) {
    linkChapter = parts[6];
  }
  linkChapter = linkChapter.padStart(linkBookId === 'psa' ? 3 : 2, '0'); // left pad with zeros, 2 if not Psalms, 3 if so
  return parts[1] + '(rc://' + [langId, bibleId, 'book', linkBookId, linkChapter, parts[7]].join('/') + ')';
};

/**
 * Cleans up all the links in an occurrenceNote
 * @param {string} occurrenceNote occurrence Note.
 * @param {string} resourcesPath path to the translationHelps directory that contains tA and tW article dirs
 * @param {string} langId
 * @param {string} bookId id of the book being processed
 * @param {string|int} chapter chapter of the note
 * @returns {string} occurrenceNote with clean/fixed tA links.
 */
export const cleanOccurrenceNoteLinks = (occurrenceNote, resourcesPath, langId, bookId, chapter) => {
  try {
    // Change colons in the path part of the link to a slash
    // Ex: [[rc://en/man/ta:translate:figs-activepassive]] =>
    //     [[rc://en/man/ta/translate/figs-activepassive]]
    const colonInPathPattern = /(?<=\[\[rc:[^\]]+):(?=[^\]]+\]\])/g;
    let cleanNote = occurrenceNote.replace(colonInPathPattern, '/');
    // Remove spaces between the link and right paren
    // Ex: (See: [[rc://en/man/ta:translate:figs-activepassive]] ) =>
    //     (See: [[rc://en/man/ta/translate/figs-activepassive]])
    const spaceBetweenLinkAndParenPattern = /(?<=\[\[rc:[^\]]+]]) +\)/g;
    cleanNote = cleanNote.replace(spaceBetweenLinkAndParenPattern, ')');
    // Remove invalid paren and spaces at end of the link
    // Ex: [[rc://en/man/ta:translate:figs-activepassive )]] =>
    //     [[rc://en/man/ta/translate/figs-activepassive]]
    const invalidParenInLinkPattern = /(?<=\[\[rc:[^\] )]+)[ \)]+(?=]])/g;
    cleanNote = cleanNote.replace(invalidParenInLinkPattern, ')');
    // Removes a right paren if it appears after one link and then there is another link
    // Ex: (See: [[rc://en/ta/man/translate/figs-activepassive]]) and [[rc://en/ta/man/translate/figs-idiom)]]) =>
    //     (See: [[rc://en/ta/man/translate/figs-activepassive]] and [[rc://en/ta/man/translate/figs-idiom)]])
    const rightParenBetweenLinksPattern = /(?<=\[\[rc:\/\/[^\]]+]])\)(?=[^\(]+rc:)/g;
    cleanNote = cleanNote.replace(rightParenBetweenLinksPattern, '');
    // Run cleanGroupId on the last item of the path, the groupId
    // Ex: [[rc://en/man/ta/translate/figs_activepassive]] =>
    //     [[rc://en/man/ta/translate/figs-activepassive]]
    const groupIdPattern = /(?<=\[\[rc:\/\/[^\]]+\/)[\w-]+(?=\]\])/g;
    cleanNote = cleanNote.replace(groupIdPattern, cleanGroupId);

    // Run convertLinkToMarkdownLink on each link to get their (title)[rc://...] representation
    // Ex: [[rc://en/ta/man/translate/figs_activepassive]] =>
    //     [Active or Passive](rc://en/man/ta/translate/figs_activepassive)
    if (resourcesPath && langId) {
      const tHelpsPattern = /(\[\[rc:\/\/[\w-]+\/(ta|tw)\/[^\/]+\/[^\]]+\]\])/g;

      cleanNote = cleanNote.replace(tHelpsPattern, link => {
        let convertedLink = convertLinkToMarkdownLink(link, resourcesPath, langId);

        if (!convertedLink) {
          throw new Error(`cleanOccurrenceNoteLinks() - error converting link: ${link}`);
        }
        return convertedLink;
      });
    }

    // Run fixBibleLink on each link to get a proper Bible rc link with Markdown syntax
    // Ex: [Titus 2:1](../02/01.md) => [Titus 2:1](rc://lang/ult/book/tit/02/01)
    //     [Romans 1:1](./01.md) => [Romans 1:1](rc://lang/ult/book/rom/01/01)
    //     [1 Corinthians 15:12](../../../1co/15/12) => [1 Corinthians 15:12](rc://lang/ult/book/1co/15/12)
    if (bookId && langId && resourcesPath) {
      const bibleLinkPattern = /(\[[^[\]]+\])\s*\((\.+\/)*(([\w-]+)\/){0,1}?((\d+)\/)?(\d+)(\.md)*\)/g;
      cleanNote = cleanNote.replace(bibleLinkPattern, link => fixBibleLink(link, resourcesPath, langId, bookId, chapter));
    }
    return cleanNote;
  } catch (e) {
    console.error(`cleanOccurrenceNoteLinks() - occurrenceNote: ${occurrenceNote}, resourcesPath: ${resourcesPath}, langId: ${langId}, bookId: ${bookId}, chapter: ${chapter}`, e);
    return null;
  }
};

/**
 * convert value to int if string, otherwise just return value
 * @param {string|int} value
 * @returns {int}
 */
export function toInt(value) {
  return (typeof value === 'string') ? parseInt(value, 10) : value;
}

/**
 * return int of value (string or int) if valid, otherwise just return value
 * @param {string|int} value
 * @returns {int|int}
 */
export function toIntIfValid(value) {
  const intValue = toInt(value);

  if (!isNaN(intValue)) {
    return intValue;
  }
  return value;
}

/**
 * find best representation of chapter and verse.  If they can be represented by numbers, then use numbers.  Otherwise leave as strings
 * @param {object} item
 * @returns {{chapter: (*|int), verse: (*|int)}}
 */
export function convertReference(item) {
  const itemChapter = item.Chapter;
  const chapterInt = toInt(itemChapter);
  const chapter = isNaN(chapterInt) ? itemChapter : chapterInt; // convert to number if valid

  const itemVerse = item.Verse;
  const verseInt = toInt(itemVerse);
  let verse = isNaN(verseInt) ? itemVerse : verseInt;
  const isVerseRange = (typeof itemVerse === 'string') && (itemVerse.indexOf('-') >= 0);

  if (isVerseRange) {
    verse = itemVerse; // if original string was verse range, leave as string
  }

  return { chapter, verse };
}

/**
 * Returns the formatted groupData item for a given tsv item.
 * @param {object} tsvItem tsv item.
 * @param {string} toolName tool name.
 * @param {string} verseString
 * @returns {object} groupData item.
 */
export const generateGroupDataItem = (tsvItem, toolName, verseString) => {
  const { OrigQuote = '' } = tsvItem;
  // if quote has more than one word get word occurrences
  const wordOccurrencesForQuote = getWordOccurrencesForQuote(OrigQuote, verseString, true); // uses tokenizer to get list of words handle various punctuation and spacing chars
  const quote = wordOccurrencesForQuote.length > 1 || hasEllipsis(OrigQuote) ? wordOccurrencesForQuote : OrigQuote; // only use array if more than one word found
  const quoteString = OrigQuote.trim().replace(/\.../gi, ELLIPSIS);
  const { chapter, verse } = convertReference(tsvItem);
  return {
    comments: false,
    reminders: false,
    selections: false,
    verseEdits: false,
    nothingToSelect: false,
    contextId: {
      checkId: tsvItem.ID || '',
      occurrenceNote: tsvItem.OccurrenceNote || '',
      reference: {
        bookId: tsvItem.Book.toLowerCase() || '',
        chapter: chapter || '',
        verse: verse || '',
      },
      tool: toolName || '',
      groupId: tsvItem.SupportReference || '',
      quote,
      quoteString,
      glQuote: tsvItem.GLQuote || '',
      occurrence: parseInt(tsvItem.Occurrence, 10) || 1,
    },
  };
};
