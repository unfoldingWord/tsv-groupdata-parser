import tsvtojson from 'tsvtojson'
import { categorizeGroupData } from './tNoteGroupIdCategorization'

 /**
  * Parses a book tN TSVs and returns an object holding the lists of group ids.
  * @param {string} filepath path to tsv file.
  * @param {string} toolName tC tool name.
  * @param {object} params When includes { categorized: true } then it returns the
  * object organized by tn article category.
  * @returns an object with the lists of group ids.
 */
export const tsvToGroupData = async (filepath, toolName, params = {}) => {
  const groupData = {}
  const tsvObjects = await tsvtojson(filepath, ['Book', 'Chapter', 'Verse', 'ID', 'SupportReference', 'OrigQuote', 'Occurrence', 'GLQuote', 'OccurrenceNote'])
    .catch(err => {
      console.error(err);
    })
  console.log('====================================');
  console.log('tsvObjects', tsvObjects);
  console.log('====================================');

  tsvObjects.map((tsvItem) => {
    if (tsvItem.Book === 'MRK' && tsvItem.SupportReference === 'figs-abstractnouns') console.log(tsvItem.Chapter, tsvItem.SupportReference, tsvItem.OrigQuote)
    if (tsvItem.SupportReference && tsvItem.OrigQuote) {

      tsvItem.SupportReference = cleanGroupId(tsvItem.SupportReference)
      tsvItem.OccurrenceNote = cleanArticleLink(tsvItem.OccurrenceNote)

      if (groupData[tsvItem.SupportReference]) {
        groupData[tsvItem.SupportReference].push(generateGroupDataItem(tsvItem, toolName))
      } else {
        groupData[tsvItem.SupportReference] = [generateGroupDataItem(tsvItem, toolName)]
      }
    }
  })

  return params.categorized ? categorizeGroupData(groupData) : groupData;
}

/**
 * Cleans an incorrectly formatted group id.
 * @param {string} groupId group id string that was posibly incorrectly formatted.
 * @returns correctly formatted group id.
 */
export const cleanGroupId = (groupId) => {
  const subStrings = groupId.replace(/translate:|translate\//gi, '').split(/[_\/:]/g)

  if (subStrings.length === 1) {
    return subStrings[0];
  } else if (subStrings.length === 2) {
    return subStrings.join('-')
  } else {
    return groupId;
  }
}

/**
 * Finds incorrectly formatted tA links and fixes them.
 * @param {string} occurrenceNote occurrence Note.
 * @returns {string} occurrenceNote with clean/fixed tA links.
 */
export const cleanArticleLink = (occurrenceNote) => {
  let noteWithFixedLink = ''
  const linkSubstring = "rc://en/ta/man/"
  const cutEnd = occurrenceNote.search(linkSubstring)
  const groupId = (occurrenceNote.substr(0, 0) + occurrenceNote.substr(cutEnd + 1))
    .replace("c://en/ta/man/", "")
    .replace("]])", "")
  const stringFirstPart = occurrenceNote.slice(0, cutEnd)

  if (groupId.includes(linkSubstring)) { // handle multiple links in the same note.
    const joint = " and "
    const multipleLinksSubstrings = groupId.split(joint)
    const lastItem = multipleLinksSubstrings.length - 1
    let goodLinks = ""

    multipleLinksSubstrings.forEach((substring, index) => {
      const linkString = substring.replace("[[rc://en/ta/man/", "").replace("]]", "")
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
  } else {// only one link in the note
    const cleanedGropId = cleanGroupId(groupId)
    const goodLink = `rc://en/ta/man/translate/${cleanedGropId}]])`
    noteWithFixedLink = stringFirstPart + goodLink
  }

  return noteWithFixedLink
}

/**
 * Returns the formatted groupData item for a given tsv item.
 * @param {object} tsv tsv item.
 * @param {string} toolName tool name.
 * @returns {object} groupData item.
 */
const generateGroupDataItem = (tsv, toolName) => {
  return {
    comments: false,
    reminders: false,
    selections: false,
    verseEdits: false,
    contextId: {
      occurrenceNote: tsv.OccurrenceNote || "",
      reference: {
        bookId: tsv.Book.toLowerCase() || "",
        chapter: parseInt(tsv.Chapter, 10) || "",
        verse: parseInt(tsv.Verse, 10) || ""
      },
      tool: toolName || "",
      groupId: tsv.SupportReference || "",
      quote: tsv.OrigQuote || "",
      glQuote: tsv.GLQuote || "",
      occurrence: parseInt(tsv.Occurrence, 10) || 1
    }
  }
}
