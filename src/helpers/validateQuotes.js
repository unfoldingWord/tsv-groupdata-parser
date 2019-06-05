import fs from 'fs-extra'
import path from 'path-extra'
import tsvtojson from 'tsvtojson'
// helpers
import ManageResource from './ManageResourceAPI'
import { BIBLE_LIST_NT } from '../utils/bible'
import { getOmittedWordsInQuote } from './ellipsisHelpers'
import { cleanQuoteString } from './stringHelpers'
// const
import { ELLIPSIS, THREE_DOTS } from '../utils/constants'

async function asyncForEach(array, callback) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

/**
 * Determines whetehr a quote is found in a verse or not.
 * @param {string} quote orignal language quote.
 * @param {string} verseString orignal bible verse.
 */
function isQuoteNotFoundInVerse(quote, verseString) {
  return !verseString.includes(quote)
}

/**
 *
 * @param {object} originalResources paths to original bibles.
 * @param {string} tsvFilesPath
 */
export async function validateTsvQuotes(originalResources, tsvFilesPath) {
  try {
    const result = []
    // eslint-disable-next-line prettier/prettier
    const tsvFiles = fs.readdirSync(tsvFilesPath)
      .filter(filename => path.extname(filename) === '.tsv')

    await asyncForEach(tsvFiles, async tsvFile => {
      // console.log(`Validating ${tsvFile}`)
      const bookNumberAndId = path.parse(tsvFile.replace('en_tn_', '')).name
      const isNewTestament = BIBLE_LIST_NT.includes(bookNumberAndId)
      if (isNewTestament) {
        const { UGNT_PATH, UHB_PATH } = originalResources
        const originalResourcePath = isNewTestament ? UGNT_PATH : UHB_PATH
        const tsvFilepath = path.join(tsvFilesPath, tsvFile)
        const tsvObjects = await tsvtojson(tsvFilepath)
        const { Book: bookId } = tsvObjects[0] || {}
        const resourceApi = new ManageResource(originalResourcePath, bookId.toLowerCase())
        tsvObjects.forEach(tsvItem => {
          if (tsvItem.SupportReference && tsvItem.OrigQuote) {
            let { OrigQuote: quote, Chapter, Verse } = tsvItem
            const chapter = parseInt(Chapter, 10)
            const verse = parseInt(Verse, 10)
            const verseString = resourceApi.getVerseString(chapter, verse)
            // if quote has more than one word get word occurrences
            // eslint-disable-next-line prettier/prettier
            let wholeQuote = cleanQuoteString(quote)
            // if quote includes ellipsis get the whole quote
            if (quote.includes(THREE_DOTS) || quote.includes(ELLIPSIS)) {
              quote = quote.replace(/\.../g, ELLIPSIS)
              const { wholeQuote: wQuote } = getOmittedWordsInQuote(quote, verseString)
              wholeQuote = wQuote || quote
            }

            if (isQuoteNotFoundInVerse(wholeQuote, verseString)) {
              const { id, SupportReference, OrigQuote, Occurrence, GLQuote } = tsvItem
              result.push({
                bookId,
                chapter,
                verse,
                id,
                SupportReference,
                OrigQuote: OrigQuote.trim(),
                wholeQuote,
                verseString,
                occurrence: Occurrence,
                GLQuote,
              })
            }
          }
        })
      }
    })

    return result
  } catch (error) {
    console.error(error)
  }
}
