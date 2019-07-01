jest.unmock('fs-extra')
import path from 'path-extra'
// helpers
import { tsvToGroupData, cleanGroupId, cleanArticleLink } from '../src/tsvToGroupData'
// fixture files
import titGroupData from './fixtures/tit_groupData.json'
import titCategorizedGroupData from './fixtures/tit_categorizedGroupData.json'
import mrkCategorizedGroupData from './fixtures/mrk_categorizedGroupData.json'
import rutCategorizedGroupData from './fixtures/rut_categorizedGroupData.json'
// constants
const NEW_TESTAMENT_BIBLE_PATH = path.join('__tests__', 'fixtures', 'resources', 'el-x-koine', 'bibles', 'ugnt', 'v0.5')
const OLD_TESTAMENT_BIBLE_PATH = path.join('__tests__', 'fixtures', 'resources', 'hbo', 'bibles', 'uhb', 'v2.1.7')

describe('tsvToGroupData():', () => {
  test('Parses a book tN TSVs to an object with a lists of group ids', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv'
    const result = await tsvToGroupData(filepath, 'translationNotes', null, NEW_TESTAMENT_BIBLE_PATH)

    expect(result).toEqual(titGroupData)
  })

  test('It returns the categorized group data if the param categorized is true { categorized: true }', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv'
    const categorizedGroupData = await tsvToGroupData(filepath, 'translationNotes', { categorized: true }, NEW_TESTAMENT_BIBLE_PATH)

    expect(categorizedGroupData).toEqual(titCategorizedGroupData)
  })

  test('It returns the uncategorized group data if the param categorized is false { categorized: false }', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv'
    const categorizedGroupData = await tsvToGroupData(filepath, 'translationNotes', { categorized: false }, NEW_TESTAMENT_BIBLE_PATH)

    expect(categorizedGroupData).toEqual(titGroupData)
  })

  test('It returns the categorized group data for MRK.tsv', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_42-MRK.tsv'
    const result = await tsvToGroupData(filepath, 'translationNotes', { categorized: true }, NEW_TESTAMENT_BIBLE_PATH)

    expect(result).toEqual(mrkCategorizedGroupData)
  })

  test('It returns the categorized group data for RUT.tsv', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_08-RUT.tsv'
    const result = await tsvToGroupData(filepath, 'translationNotes', { categorized: true }, OLD_TESTAMENT_BIBLE_PATH)

    expect(result).toEqual(rutCategorizedGroupData)
  })
})

describe('cleanGroupId()', () => {
  test('it cleans groupId bad links coming from the tsv SupportReference.', () => {
    const testItems = {
      'writing-background': 'writing-background',
      writing_background: 'writing-background',
      'translate:writing_background': 'writing-background',
      'translate/translate_textvariants': 'translate-textvariants',
      'translate:translate_textvariants': 'translate-textvariants',
      'translate:translate_versebridge': 'translate-versebridge',
      'translate:translate-symaction': 'translate-symaction',
    }

    Object.keys(testItems).forEach(badGroupId => {
      const cleaned = cleanGroupId(badGroupId)

      expect(cleaned).toBe(testItems[badGroupId])
    })
  })
})

describe('cleanArticleLink()', () => {
  test('fixes tA broken links', () => {
    const testItems = {
      'translate/writing-background': 'translate/writing-background',
      'translate/writing_background': 'translate/writing-background',
      'translate:writing_background': 'translate/writing-background',
      'translate/translate_textvariants': 'translate/translate-textvariants',
      'translate:translate_textvariants': 'translate/translate-textvariants',
      'translate:translate_versebridge': 'translate/translate-versebridge',
      'translate:translate-symaction': 'translate/translate-symaction',
    }

    Object.keys(testItems).forEach(badLink => {
      const goodLink = testItems[badLink]
      const withBrokenLink = `This verse is background information for the description of the events that follow. (See: [[rc://en/ta/man/${badLink}]])`
      const cleanedLink = `This verse is background information for the description of the events that follow. (See: [[rc://en/ta/man/${goodLink}]])`

      expect(cleanArticleLink(withBrokenLink)).toBe(cleanedLink)
    })
  })

  test('Handles multiple tA links in a note.', () => {
    const notes = [
      'A person who cannot control themselves and drinks too much wine is spoken of as if the person were a slave to the wine. This can be stated in active form. Alternate translation: "and not drinking too much wine" or "and not addicted to wine" (See: [[rc://en/ta/man/translate/figs-metaphor]] and [[rc://en/ta/man/translate/figs-activepassive]])',
      '"Word" here is a metonym for "message," which in turn is a metonym for God himself. This can be stated in active form. Alternate translation: "so that no one insults God\'s word" or "so that no one insults God by saying bad things about his message" (See: [[rc://en/ta/man/translate/figs-activepassive]] and [[rc://en/ta/man/translate/figs-metonymy]])',
      'Passion and pleasure are spoken of as if they were masters over people and had made those people into slaves by lying to them. This can be translated in active form. Alternate translation: "Various passions and pleasures had lied to us and so led us astray" or "We had allowed ourselves to believe the lie that various passions and pleasures could make us happy, and then we were unable to control our feelings or stop doing things we thought would give us pleasure" (See: [[rc://en/ta/man/translate/figs-personification]] and [[rc://en/ta/man/translate/figs-activepassive]])',
    ]

    notes.forEach(note => {
      expect(cleanArticleLink(note)).toBe(note)
    })
  })
})
