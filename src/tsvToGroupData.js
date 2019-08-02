import tsvtojson from 'tsvtojson'
import { categorizeGroupData } from './tNoteGroupIdCategorization'
import ManageResource from './helpers/ManageResourceAPI'
import { getWordOccurrencesForQuote } from './helpers/wordOccurrenceHelpers'
import { ELLIPSIS } from './utils/constants'

/**
 * Parses a book tN TSVs and returns an object holding the lists of group ids.
 * @param {string} filepath path to tsv file.
 * @param {string} toolName tC tool name.
 * @param {object} params When it includes { categorized: true }
 * then it returns the object organized by tn article category.
 * @param {string} originalBiblePath path to original bible.
 * e.g. /resources/el-x-koine/bibles/ugnt/v0.5
 * @returns an object with the lists of group ids which each
 * includes an array of groupsdata.
 */
export const tsvToGroupData = async (filepath, toolName, params = {}, originalBiblePath) => {
  const groupData = {}
  const tsvObjects = await tsvtojson(filepath)
  const { Book: bookId } = tsvObjects[0] || {}
  const resourceApi = new ManageResource(originalBiblePath, bookId.toLowerCase())

  tsvObjects.forEach(tsvItem => {
    if (tsvItem.SupportReference && tsvItem.OrigQuote) {
      tsvItem.SupportReference = cleanGroupId(tsvItem.SupportReference)
      tsvItem.OccurrenceNote = cleanArticleLink(tsvItem.OccurrenceNote)
      const chapter = parseInt(tsvItem.Chapter, 10)
      const verse = parseInt(tsvItem.Verse, 10)
      const verseString = resourceApi.getVerseString(chapter, verse)

      if (groupData[tsvItem.SupportReference]) {
        groupData[tsvItem.SupportReference].push(generateGroupDataItem(tsvItem, toolName, verseString))
      } else {
        groupData[tsvItem.SupportReference] = [generateGroupDataItem(tsvItem, toolName, verseString)]
      }
    }
  })

  return params && params.categorized ? categorizeGroupData(groupData) : groupData
}

/**
 * Cleans an incorrectly formatted group id.
 * @param {string} groupId group id string that was possibly incorrectly formatted.
 * @returns {string} correctly formatted group id.
 */
export const cleanGroupId = groupId => {
  // Replace _ with - in groupId
  // Ex: figs_activepassive => figs-activepassive
  const cleanedId = groupId.replace('_', '-')
  return cleanedId
}

/**
 * Finds incorrectly formatted tA links and fixes them.
 * @param {string} occurrenceNote occurrence Note.
 * @returns {string} occurrenceNote with clean/fixed tA links.
 */
export const cleanArticleLink = occurrenceNote => {
  // Change colons in the path part of the link to a slash
  // Ex: [[rc://en/man/ta:translate:figs-activepassive]] =>
  //     [[rc://en/man/ta/translate/figs-activepassive]]
  const colonInPathPattern = /(?<=\[\[rc:[^\]]+):(?=[^\]]+\]\])/g
  let cleanNote = occurrenceNote.replace(colonInPathPattern, '/')
  // Remove spaces between the link and right paren
  // Ex: (See: [[rc://en/man/ta:translate:figs-activepassive]] ) =>
  //     (See: [[rc://en/man/ta/translate/figs-activepassive]])
  const spaceBetweenLinkAndParenPattern = /(?<=\[\[rc:[^\]]+]]) +\)/g
  cleanNote = cleanNote.replace(spaceBetweenLinkAndParenPattern, ')')
  // Remove invalid paren and spaces at end of the link
  // Ex: [[rc://en/man/ta:translate:figs-activepassive )]] =>
  //     [[rc://en/man/ta/translate/figs-activepassive]]
  const invalidParenInLinkPattern = /(?<=\[\[rc:[^\] )]+)[ \)]+(?=]])/g
  cleanNote = cleanNote.replace(invalidParenInLinkPattern, ')')
  // Removes a right paren if it appears after one link and then there is another link
  // Ex: (See: [[rc://en/ta/man/translate/figs-activepassive]]) and [[rc://en/ta/man/translate/figs-idiom)]]) =>
  //     (See: [[rc://en/ta/man/translate/figs-activepassive]] and [[rc://en/ta/man/translate/figs-idiom)]])
  const rightParenBetweenLinksPattern = /(?<=\[\[rc:[^\]]+]])\)(?=[^\(]+rc:)/g
  cleanNote = cleanNote.replace(rightParenBetweenLinksPattern, '')
  // Run cleanGroupId on the last item of the path, the groupId
  // Ex: [[rc://en/man/ta/translate/figs_activepassive]] =>
  //     [[rc://en/man/ta/translate/figs-activepassive]]
  const groupIdPattern = /(?<=\[\[rc:[^\]]+\/)([^/]+)(?=\]\])/g
  cleanNote = cleanNote.replace(groupIdPattern, cleanGroupId)
  return cleanNote
}

/**
 * Returns the formatted groupData item for a given tsv item.
 * @param {object} tsvItem tsv item.
 * @param {string} toolName tool name.
 * @returns {object} groupData item.
 */
const generateGroupDataItem = (tsvItem, toolName, verseString) => {
  const { OrigQuote = '' } = tsvItem
  // if quote has more than one word get word occurrences
  const quote = OrigQuote.trim().split(' ').length > 1 ? getWordOccurrencesForQuote(OrigQuote, verseString) : OrigQuote
  const quoteString = OrigQuote.trim().replace(/\.../gi, ELLIPSIS)

  return {
    comments: false,
    reminders: false,
    selections: false,
    verseEdits: false,
    nothingToSelect: false,
    contextId: {
      occurrenceNote: tsvItem.OccurrenceNote || '',
      reference: {
        bookId: tsvItem.Book.toLowerCase() || '',
        chapter: parseInt(tsvItem.Chapter, 10) || '',
        verse: parseInt(tsvItem.Verse, 10) || '',
      },
      tool: toolName || '',
      groupId: tsvItem.SupportReference || '',
      quote,
      quoteString,
      glQuote: tsvItem.GLQuote || '',
      occurrence: parseInt(tsvItem.Occurrence, 10) || 1,
    },
  }
}
