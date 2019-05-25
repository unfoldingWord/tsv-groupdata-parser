import tsvtojson from 'tsvtojson'
import { categorizeGroupData } from './tNoteGroupIdCategorization'
import ManageResource from './helpers/ManageResourceAPI'
import { getWordOccurrencesForQuote } from './helpers/wordOccurrenceHelpers'

/**
 * Parses a book tN TSVs and returns an object holding the lists of group ids.
 * @param {string} filepath path to tsv file.
 * @param {string} toolName tC tool name.
 * @param {object} params When it includes { categorized: true }
 * then it returns the object organized by tn article category.
 * @param {string} originalBiblePath path to original bible
 * @returns an object with the lists of group ids which each
 * includes an array of groupsdata.
 */
export const tsvToGroupData = async (filepath, toolName, params = {}, originalBiblePath) => {
  const groupData = {}
  const tsvObjects = await tsvtojson(filepath)
  const { Book: bookId } = tsvObjects[0] || {}
  const resourceApi = new ManageResource(originalBiblePath, bookId.toLowerCase())

  tsvObjects.map(tsvItem => {
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
 * @param {string} groupId group id string that was posibly incorrectly formatted.
 * @returns correctly formatted group id.
 */
export const cleanGroupId = groupId => {
  const subStrings = groupId.replace(/translate:|translate\//gi, '').split(/[_\/:]/g)

  if (subStrings.length === 1) {
    return subStrings[0]
  } else if (subStrings.length === 2) {
    return subStrings.join('-')
  } else {
    return groupId
  }
}

/**
 * Finds incorrectly formatted tA links and fixes them.
 * @param {string} occurrenceNote occurrence Note.
 * @returns {string} occurrenceNote with clean/fixed tA links.
 */
export const cleanArticleLink = occurrenceNote => {
  let noteWithFixedLink = ''
  const linkSubstring = 'rc://en/ta/man/'
  const cutEnd = occurrenceNote.search(linkSubstring)
  const groupId = (occurrenceNote.substr(0, 0) + occurrenceNote.substr(cutEnd + 1)).replace('c://en/ta/man/', '').replace(']])', '')
  const stringFirstPart = occurrenceNote.slice(0, cutEnd)

  if (groupId.includes(linkSubstring)) {
    // handle multiple links in the same note.
    const joint = ' and '
    const multipleLinksSubstrings = groupId.split(joint)
    const lastItem = multipleLinksSubstrings.length - 1
    let goodLinks = ''

    multipleLinksSubstrings.forEach((substring, index) => {
      const linkString = substring.replace('[[rc://en/ta/man/', '').replace(']]', '')
      const cleanedGropId = cleanGroupId(linkString)

      if (index === 0) {
        goodLinks = goodLinks + `rc://en/ta/man/translate/${cleanedGropId}]]` + joint
      } else if (index !== lastItem) {
        goodLinks = goodLinks + `[[rc://en/ta/man/translate/${cleanedGropId}]]` + joint
      } else if (index === lastItem) {
        goodLinks = goodLinks + `[[rc://en/ta/man/translate/${cleanedGropId}]])`
      }
    })
    noteWithFixedLink = stringFirstPart + goodLinks
  } else {
    // only one link in the note
    const cleanedGropId = cleanGroupId(groupId)
    const goodLink = `rc://en/ta/man/translate/${cleanedGropId}]])`
    noteWithFixedLink = stringFirstPart + goodLink
  }

  return noteWithFixedLink
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

  return {
    comments: false,
    reminders: false,
    selections: false,
    verseEdits: false,
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
      glQuote: tsvItem.GLQuote || '',
      occurrence: parseInt(tsvItem.Occurrence, 10) || 1,
    },
  }
}
