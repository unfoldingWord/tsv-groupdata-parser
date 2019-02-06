import tsvtojson from 'tsvtojson'

/**
 * Parses a book tN TSVs and returns an object holding the lists of group ids.
 * @param {string} filepath path to tsv file.
 * @param {string} toolName tC tool name.
 * @returns an object with the lists of group ids.
 * {
    figs-metaphor: [
      {
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
export const tsvToGroupdata = async (filepath, toolName) => {
  const groupIds = {}
  const tsvObjects = await tsvtojson(filepath)

  tsvObjects.map((tsvItem) => {
    if (tsvItem.SupportReference) {
      if (groupIds[tsvItem.SupportReference]) {
        groupIds[tsvItem.SupportReference].push(generateGroupdata(tsvItem, toolName))
      } else{
        groupIds[tsvItem.SupportReference] = [generateGroupdata(tsvItem, toolName)]
      }
    }
  })

  return groupIds;
}

export const generateGroupdata = (tsv, toolName) => {
  return {
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