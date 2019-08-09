jest.unmock('fs-extra')
import { generateGroupsIndex, getArticleCategory } from '../src/groupsIndexParser'

describe('tests groupsIndexParser.generateGroupsIndex()', () => {
  test('returns an object with all the tn categories, each one with their groupsIndex', async () => {
    const tnCategoriesPath = '__tests__/fixtures/resources/en/translationHelps/translationNotes/v14'
    const taCategoriesPath = '__tests__/fixtures/resources/en/translationHelps/translationAcademy/v10'
    const result = generateGroupsIndex(tnCategoriesPath, taCategoriesPath)
    expect(result).toMatchSnapshot()
  })
})

describe('tests groupsIndexParser.getArticleCategory()', () => {
  test('returns the category found in an occurrenceNote', async () => {
    const groupId = 'figs-metaphor'
    const category = 'translate'
    const occurrenceNote = 'This is my note (See: [Metaphor](rc://en/ta/man/' + category + '/' + groupId + '))'
    expect(getArticleCategory(occurrenceNote, groupId)).toBe(category)
  })

  test('returns the category found in an occurrenceNote as the second link', async () => {
    const groupId = 'figs-metaphor'
    const category = 'translate'
    const occurrenceNote = 'This is my note (See: [Spelling](rc://en/ta/man/checking/spelling) and [Metaphor](rc://en/ta/man/' + category + '/' + groupId + '))'
    expect(getArticleCategory(occurrenceNote, groupId)).toBe(category)
  })

  test('returns the category found in a Hindi occurrenceNote', async () => {
    const groupId = 'figs-metaphor'
    const category = 'translate'
    const occurrenceNote = 'पौलूस परमेश्वर के सन्देश की इस तरह बात करता है जैसे कि वह कोई वस्तु हो जिसे लोगों को दृश्य रूप में दिखाया जा सकता हो। वैकल्पिक अनुवाद: “उसने मुझे अपना सन्देश समझने के लिए प्रेरित किया” (देखें: [[rc://hi/ta/man/' + category + '/' + groupId + ']])'
    expect(getArticleCategory(occurrenceNote, groupId)).toBe(category)
  })

  test('returns no categories for a note with no links', async () => {
    const groupId = 'some-group-id'
    const occurrenceNote = 'This is my note'
    expect(getArticleCategory(occurrenceNote, groupId)).toBe(null)
  })

  test('returns no categories for a empty occurrenceNote', async () => {
    const groupId = null
    const occurrenceNote = null
    expect(getArticleCategory(occurrenceNote, groupId)).toBe(null)
  })
})
