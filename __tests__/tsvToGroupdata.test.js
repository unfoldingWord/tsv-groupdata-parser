import { tsvToGroupData, cleanGroupId } from '../src/tsvToGroupData'
// fixture files
import titGroupData from './fixtures/tit_groupData.json'
import titCategorizedGroupData from './fixtures/tit_categorizedGroupData.json'

describe('tsvToGroupData():', () => {
  test('Parses a book tN TSVs to an object with a lists of group ids', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv'
    const result = await tsvToGroupData(filepath, "translationNotes");

    expect(result).toEqual(titGroupData)
  })

  test('It returns the categorized group data if the param categorized is true { categorized: true }', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv'
    const categorizedGroupData = await tsvToGroupData(filepath, "translationNotes", { categorized: true });

    expect(categorizedGroupData).toEqual(titCategorizedGroupData)
  })

  test('It returns the uncategorized group data if the param categorized is false { categorized: false }', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv'
    const categorizedGroupData = await tsvToGroupData(filepath, "translationNotes", { categorized: false });

    expect(categorizedGroupData).toEqual(titGroupData)
  })
})

describe('cleanGroupId()', () => {
  test('it cleans groupId bad links coming from the tsv SupportReference.', () => {
    const testItems = {
      "writing-background": "writing-background",
      "writing_background": "writing-background",
      "translate:writing_background": "writing-background",
      "translate/translate_textvariants": "translate-textvariants",
      "translate:translate_textvariants": "translate-textvariants",
      "translate:translate_versebridge": "translate-versebridge",
      "translate:translate-symaction": "translate-symaction",
    }

    Object.keys(testItems).forEach((badGroupId) => {
      const cleaned = cleanGroupId(badGroupId)

      expect(cleaned).toBe(testItems[badGroupId])
    })
  })
})
