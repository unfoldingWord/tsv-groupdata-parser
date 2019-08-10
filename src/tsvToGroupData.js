import path from 'path-extra'
import fs from 'fs-extra'
import tsvtojson from 'tsvtojson'
import { categorizeGroupData } from './tNoteGroupIdCategorization'
import ManageResource from './helpers/ManageResourceAPI'
import { getWordOccurrencesForQuote } from './helpers/wordOccurrenceHelpers'
import { ELLIPSIS } from './utils/constants'
import { translationHelps, getLatestVersionInPath, getGroupName, getBibleIdForLanguage } from './helpers/resourcesHelpers'

/**
 * Parses a book tN TSVs and returns an object holding the lists of group ids.
 * @param {string} filepath path to tsv file.
 * @param {string} toolName tC tool name.
 * @param {object} params When it includes { categorized: true }
 * then it returns the object organized by tn article category.
 * @param {string} originalBiblePath path to original bible.
 * e.g. /resources/el-x-koine/bibles/ugnt/v0.5
 * @param {string} resourcesPath path to the resources dir
 * e.g. /User/john/translationCore/resources
 * @param {string} langId
 * @returns an object with the lists of group ids which each includes an array of groupsdata.
 */
export const tsvToGroupData = async (filepath, toolName, params = {}, originalBiblePath, resourcesPath, langId) => {
  const groupData = {}
  const tsvObjects = await tsvtojson(filepath)
  const { Book: bookId } = tsvObjects[0] || {}
  const resourceApi = new ManageResource(originalBiblePath, bookId.toLowerCase())

  tsvObjects.forEach(tsvItem => {
    if (tsvItem.SupportReference && tsvItem.OrigQuote) {
      tsvItem.SupportReference = cleanGroupId(tsvItem.SupportReference)
      tsvItem.OccurrenceNote = cleanOccurrenceNoteLinks(tsvItem.OccurrenceNote, resourcesPath, langId, bookId.toLowerCase(), tsvItem.Chapter)
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
 * @param {string} resourcesPath
 * @param {string} langId
 */
export const convertLinkToMarkdownLink = (tHelpsLink, resourcesPath, langId) => {
  const tHelpsPattern = /\[\[(rc:\/\/[\w-]+\/(ta|tn|tw)\/[^\/]+\/([^\]]+)\/([^\]]+))\]\]/g
  const parts = tHelpsPattern.exec(tHelpsLink)
  parts.shift()
  const [rcLink, resource, category, file] = parts
  let resourcePath = path.join(resourcesPath, langId, 'translationHelps', translationHelps[resource])
  resourcePath = getLatestVersionInPath(resourcePath)
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
  const bibleId = getBibleIdForLanguage(path.join(resourcesPath, langId, 'bibles'))
  if (! bibleId) {
    return link
  }
  // bibleLinkPattern can match the following:
  // [Titus 2:1](../02/01.md)
  // [John 4:2](../../jhn/04/02.md] (parts[4] will be "jhn")
  // [Revelation 10:10](../10/10)
  // [Ephesians 4:1](04/01)
  // [1 Corinthians 15:12](./12.md)
  const bibleLinkPattern = /(\[[^[\]]+\])\s*\((\.+\/)*(([\w-]+)\/){0,1}?((\d+)\/)?(\d+)(\.md)*\)/g
  const parts = bibleLinkPattern.exec(link)
  if (!parts) {
    return link
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
  let linkBookId = bookId
  if (parts[4]) {
    linkBookId = parts[4]
  }
  // If the bible link is in the form (../<chapter>/<verse>) we use the chapter in the link instead of the one passed
  // to this function
  let linkChapter = '' + chapter // make sure it is a string
  if (parts[6]) {
    linkChapter = parts[6]
  }
  linkChapter = linkChapter.padStart(linkBookId === 'psa' ? 3 : 2, '0') // left pad with zeros, 2 if not Psalms, 3 if so
  return parts[1] + '(rc://' + [langId, bibleId, 'book', linkBookId, linkChapter, parts[7]].join('/') + ')'
}

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
  const groupIdPattern = /(?<=\[\[rc:\/\/[^\]]+\/)[\w-]+(?=\]\])/g
  cleanNote = cleanNote.replace(groupIdPattern, cleanGroupId)
  // Run convertLinkToMarkdownLink on each link to get their (title)[rc://...] representation
  // Ex: [[rc://en/ta/man/translate/figs_activepassive]] =>
  //     [Active or Passive](rc://en/man/ta/translate/figs_activepassive)
  if (resourcesPath && langId) {
    const tHelpsPattern = /(\[\[rc:\/\/[\w-]+\/(ta|tw)\/[^\/]+\/[^\]]+\]\])/g
    cleanNote = cleanNote.replace(tHelpsPattern, link => convertLinkToMarkdownLink(link, resourcesPath, langId))
  }
  // Run fixBibleLink on each link to get a proper Bible rc link with Markdown syntax
  // Ex: [Titus 2:1](../02/01.md) => [Titus 2:1](rc://lang/ult/book/tit/02/01)
  //     [Romans 1:1](./01.md) => [Romans 1:1](rc://lang/ult/book/rom/01/01)
  //     [1 Corinthians 15:12](../../../1co/15/12) => [1 Corinthians 15:12](rc://lang/ult/book/1co/15/12)
  if (bookId && langId && resourcesPath) {
    const bibleLinkPattern = /(\[[^[\]]+\])\s*\((\.+\/)*(([\w-]+)\/){0,1}?((\d+)\/)?(\d+)(\.md)*\)/g
    cleanNote = cleanNote.replace(bibleLinkPattern, link => fixBibleLink(link, resourcesPath, langId, bookId, chapter))
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
