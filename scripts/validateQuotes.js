import fs from 'fs-extra';
import path from 'path-extra';
import ospath from 'ospath';
import semver from 'semver';
import tsvtojson from 'tsvtojson';
// helpers
import ManageResource from '../src/helpers/ManageResourceAPI';
import { BIBLE_LIST_NT } from '../src/utils/bible';
import { getOmittedWordsInQuote } from '../src/helpers/ellipsisHelpers';
import { cleanQuoteString } from '../src/helpers/stringHelpers';
// const
import { ELLIPSIS, THREE_DOTS } from '../src/utils/constants';

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    // eslint-disable-next-line no-await-in-loop
    await callback(array[index], index, array);
  }
}

/**
 * Determines whetehr a quote is found in a verse or not.
 * @param {string} quote orignal language quote.
 * @param {string} verseString orignal bible verse.
 */
function isQuoteNotFoundInVerse(quote, verseString) {
  return !verseString.includes(quote);
}

/**
 *
 * @param {object} originalResources paths to original bibles.
 * @param {string} tsvFilesPath
 */
export async function validateTsvQuotes(originalResources, tsvFilesPath) {
  try {
    const result = [];
    // eslint-disable-next-line prettier/prettier
    const tsvFiles = fs.readdirSync(tsvFilesPath)
      .filter(filename => path.extname(filename) === '.tsv');

    await asyncForEach(tsvFiles, async tsvFile => {
      // console.info(`Validating ${tsvFile}`)
      const bookNumberAndId = path.parse(tsvFile.replace('en_tn_', '')).name;
      const isNewTestament = BIBLE_LIST_NT.includes(bookNumberAndId);

      if (isNewTestament) {
        const { UGNT_PATH, UHB_PATH } = originalResources;
        const originalResourcePath = isNewTestament ? UGNT_PATH : UHB_PATH;
        const tsvFilepath = path.join(tsvFilesPath, tsvFile);
        const tsvObjects = await tsvtojson(tsvFilepath);
        const { Book: bookId } = tsvObjects[0] || {};
        const resourceApi = new ManageResource(originalResourcePath, bookId.toLowerCase());

        tsvObjects.forEach(tsvItem => {
          if (tsvItem.SupportReference && tsvItem.OrigQuote) {
            let {
              OrigQuote: quote, Chapter, Verse,
            } = tsvItem;
            const chapter = parseInt(Chapter, 10);
            const verse = parseInt(Verse, 10);
            const verseString = resourceApi.getVerseString(chapter, verse);
            // if quote has more than one word get word occurrences
            // eslint-disable-next-line prettier/prettier
            let wholeQuote = cleanQuoteString(quote);

            // if quote includes ellipsis get the whole quote
            if (quote.includes(THREE_DOTS) || quote.includes(ELLIPSIS)) {
              quote = quote.replace(/\.../g, ELLIPSIS);
              const { wholeQuote: wQuote } = getOmittedWordsInQuote(quote, verseString);
              wholeQuote = wQuote || quote;
            }

            if (isQuoteNotFoundInVerse(wholeQuote, verseString)) {
              const {
                ID, OrigQuote, GLQuote,
              } = tsvItem;

              result.push({
                bookId,
                chapter,
                verse,
                ID,
                OrigQuote: OrigQuote.trim(),
                // wholeQuote,
                verseString,
                GLQuote,
              });
            }
          }
        });
      }
    });

    return result;
  } catch (error) {
    console.error(error);
  }
}

function listVersions(dir) {
  if (fs.pathExistsSync(dir)) {
    const versionedDirs = fs.readdirSync(dir).filter(file => fs.lstatSync(path.join(dir, file)).isDirectory() && file.match(/^v\d/i));
    return versionedDirs.sort((a, b) => {
      const cleanA = semver.coerce(a);
      const cleanB = semver.coerce(b);

      if (semver.gt(cleanA, cleanB)) {
        return -1;
      } else if (semver.lt(cleanA, cleanB)) {
        return 1;
      } else {
        return 0;
      }
    });
  }
  return [];
}

function getLatestVersion(dir) {
  const versions = listVersions(dir);

  if (versions.length > 0) {
    return path.join(dir, versions[0]);
  } else {
    return null;
  }
}

function runOriginalQuoteValidator() {
  const RESOURCE_PATH = path.join(ospath.home(), 'translationCore', 'resources');
  const UGNT_PATH = getLatestVersion(path.join(RESOURCE_PATH, 'el-x-koine', 'bibles', 'ugnt'));
  const UHB_PATH = getLatestVersion(path.join(RESOURCE_PATH, 'hbo', 'bibles', 'uhb'));
  const tsvFilesPath = path.join(ospath.home(), 'Downloads', 'en_tn');

  validateTsvQuotes({ UGNT_PATH, UHB_PATH }, tsvFilesPath).then(corruptedQuotes => {
    console.info('Number of corrupted quotes:', corruptedQuotes.length);
    const outputPath = path.join(__dirname, 'results', 'corruptedQuotes.json');
    fs.outputJsonSync(outputPath, corruptedQuotes, { spaces: 2 });
  });
}

// npm script to be run
runOriginalQuoteValidator();
