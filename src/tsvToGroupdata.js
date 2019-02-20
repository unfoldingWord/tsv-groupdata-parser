import tsvtojson from 'tsvtojson'
import { categorizeGroupData } from './tNoteGroupIdCategorization'

 /**
  * Parses a book tN TSVs and returns an object holding the lists of group ids.
  * @param {string} filepath path to tsv file.
  * @param {string} toolName tC tool name.
  * @param {*} params When includes { categorized: true } then it returns the
  * object organized by tn article category.
  * @returns an object with the lists of group ids.
  * {
    figs-metaphor: [
      {
        "comments": false,
        "reminders": false,
        "selections": false,
        "verseEdits": false,
        "contextId": {
          "occurrenceNote": "",
          "reference": {

          },
          "tool": "",
          "groupId": "",
          "quote": "",
          "glQuote": """,
          "occurrence": ""
        }
      },
      {
        ...
      }
    ],
    figs-ellipsis: [{...}, ...],
    figs-explicit: [{...}],
 */
export const tsvToGroupData = async (filepath, toolName, params = {}) => {
  const groupData = {}
  const tsvObjects = await tsvtojson(filepath)

  tsvObjects.map((tsvItem) => {
    if (tsvItem.SupportReference) {
      cleanGroupId(tsvItem.SupportReference)
      if (groupData[tsvItem.SupportReference]) {
        groupData[tsvItem.SupportReference].push(generateGroupDataItem(tsvItem, toolName))
      } else{
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
      occurrenceNote: tsv.OccurrenceNote,
      reference: {
        bookId: tsv.Book.toLowerCase(),
        chapter: parseInt(tsv.Chapter, 10),
        verse: parseInt(tsv.Verse, 10)
      },
      tool: toolName,
      groupId: tsv.SupportReference,
      quote: tsv.OrigQuote,
      glQuote: tsv.GLQuote,
      occurrence: parseInt(tsv.Occurrence, 10)
    }
  }
}
