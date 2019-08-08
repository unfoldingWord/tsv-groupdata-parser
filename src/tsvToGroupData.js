import path from 'path-extra'
import fs from 'fs-extra'
import tsvtojson from 'tsvtojson'
import { categorizeGroupData } from './tNoteGroupIdCategorization'
import ManageResource from './helpers/ManageResourceAPI'
import { getWordOccurrencesForQuote } from './helpers/wordOccurrenceHelpers'
import { ELLIPSIS } from './utils/constants'
import { translationHelps, getLatestVersionInPath, getGroupName } from './helpers/transationHelpsHelpers'

/**
 * Parses a book tN TSVs and returns an object holding the lists of group ids.
 * @param {string} filepath path to tsv file.
 * @param {string} toolName tC tool name.
 * @param {object} params When it includes { categorized: true }
 * then it returns the object organized by tn article category.
 * @param {string} originalBiblePath path to original bible.
 * e.g. /resources/el-x-koine/bibles/ugnt/v0.5
 * @param {string} translationHelpsPath path to the translationHelps dir
 * e.g. /resources/en/translationHelps
 * @returns an object with the lists of group ids which each includes an array of groupsdata.
 */
export const tsvToGroupData = async (filepath, toolName, params = {}, originalBiblePath, translationHelpsPath) => {
  const groupData = {}
  const tsvObjects = await tsvtojson(filepath)
  const { Book: bookId } = tsvObjects[0] || {}
  const resourceApi = new ManageResource(originalBiblePath, bookId.toLowerCase())

  tsvObjects.forEach(tsvItem => {
    if (tsvItem.SupportReference && tsvItem.OrigQuote) {
      tsvItem.SupportReference = cleanGroupId(tsvItem.SupportReference)
      tsvItem.OccurrenceNote = cleanOccurrenceNoteLinks(tsvItem.OccurrenceNote, bookId, translationHelpsPath)
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
  // Make sure we only have the element at the very end of a path of /'s or :'s
  // Ex: translate:writing_background => writing_background
  const elements = groupId.split(/[/:]/)
  let cleanedId = elements[elements.length - 1]
  // Replace _ with - in groupId
  // Ex: writing_background => writing-background
  cleanedId = cleanedId.replace('_', '-')
  return cleanedId
}

/**
 * Converts [[rc://lang/(ta|tw)/...]] links to a markdown link if we can find their article file locally to get the title
 * @param {string} tHelpsLink
 * @param {string} tHelpsPath
 */
export const convertLinkToMarkdownLink = (tHelpsLink, tHelpsPath) => {
  const tHelpsPattern = /\[\[(rc:\/\/[\w-]+\/(ta|tn|tw)\/[^\/]+\/([^\]]+)\/([^\]]+))\]\]/g
  const parts = tHelpsPattern.exec(tHelpsLink)
  parts.shift()
  const [rcLink, resource, category, file] = parts
  const resourcePath = getLatestVersionInPath(path.join(tHelpsPath, translationHelps[resource]))
  let articlePath
  if (resource === 'ta') {
    articlePath = path.join(resourcePath, category, file) + '.md'
  }
  if (resource === 'tw') {
    articlePath = path.join(resourcePath, category.split('/')[1], 'articles', file) + '.md'
  }
  if (articlePath && fs.existsSync(articlePath)) {
    const groupName = getGroupName(articlePath)
    if (groupName) {
      return '[' + groupName + '](' + rcLink + ')'
    }
  }
  return tHelpsLink
}

export const fixBibleLink = (link, langId, bookId) => {
  // bibleLinkPattern can match the following:
  // [Titus 2:1](../02/01.md)
  // [John 4:2](../../jhn/04/02.md] (parts[4] will be "jhn")
  // [Revelation 10:10](../10/10)
  // [Ephesians 4:1](04/01.md)
  const bibleLinkPattern = /(\[[^[\]]+\])\s*\((\.\.\/)*(([\w-]+)\/){0,1}(\d+)\/(\d+)(\.md)*\)/g
  const parts = bibleLinkPattern.exec(link)
  if (!parts) {
    return link
  }
  let myBookId = bookId
  if (parts[4]) {
    myBookId = parts[4]
  }
  return parts[1] + '(rc://' + [langId, 'ult', 'book', myBookId, parts[5], parts[6]].join('/') + ')'
}

/**
 * Cleans up all the links in an occurrenceNote
 * @param {string} occurrenceNote occurrence Note.
 * @param {string} tHelpsPath path to the translationHelps directory that contains tA and tW article dirs
 * @param {string} bookId id of the book being processed
 * @returns {string} occurrenceNote with clean/fixed tA links.
 */
export const cleanOccurrenceNoteLinks = (occurrenceNote, tHelpsPath, bookId) => {
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
  const rightParenBetweenLinksPattern = /(?<=\[\[rc:\/\/[^\]]+]])\)(?=[^\(]+rc:)/g
  cleanNote = cleanNote.replace(rightParenBetweenLinksPattern, '')
  // Run cleanGroupId on the last item of the path, the groupId
  // Ex: [[rc://en/man/ta/translate/figs_activepassive]] =>
  //     [[rc://en/man/ta/translate/figs-activepassive]]
  const groupIdPattern = /(?<=\[\[rc:\/\/[^\]]+\/([\w-]+)(?=\]\]))/g
  cleanNote = cleanNote.replace(groupIdPattern, cleanGroupId)
  // Run convertLinkToMarkdownLink on each link to get their (title)[rc://...] representation
  // Ex: [[rc://en/ta/man/translate/figs_activepassive]] =>
  //     [Active or Passive](rc://en/man/ta/translate/figs_activepassive)
  if (tHelpsPath) {
    const tHelpsPattern = /(\[\[rc:\/\/[\w-]+\/(ta|tw)\/[^\/]+\/[^\]]+\]\])/g
    cleanNote = cleanNote.replace(tHelpsPattern, link => {
      return convertLinkToMarkdownLink(link, tHelpsPath)
    })
  }
  // Run fixBibleLink on each link to get a proper Bible rc link with Markdown syntax
  // Ex: [Titus 2:1](../02/01.md) =>
  //     [Titus 2:1](rc://lang/ult/book/tit/02/01)
  if (bookId && tHelpsPath) {
    let lang = 'en'
    if (tHelpsPath) {
      const parts = tHelpsPath.split('/')
      if (parts.length >= 2) {
        lang = parts[parts.length - 2]
      }
    }
    const bibleLinkPattern = /\[[^[\]]+\]\s*\((\.\.\/)*(([\w-]+)\/){0,1}(\d+)\/(\d+)(\.md)*\)/g
    cleanNote = cleanNote.replace(bibleLinkPattern, link => {
      return fixBibleLink(link, lang, bookId)
    })
  }
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
