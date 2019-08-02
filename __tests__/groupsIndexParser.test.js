jest.unmock('fs-extra')
import { generateGroupsIndex, getArticleCategory } from '../src/groupsIndexParser'
// fixture files
import categorizedGroupsIndex from './fixtures/categorizedGroupsIndex.json'

describe('tests groupsIndexParers.generateGroupsIndex()', () => {
  test('returns an object with all the tn categories, each one with their groupsIndex', async () => {
    const tnCategoriesPath = '__tests__/fixtures/resources/en/translationHelps/translationNotes/v14'
    const taCategoriesPath = '__tests__/fixtures/resources/en/translationHelps/translationAcademy/v10'

    const result = generateGroupsIndex(tnCategoriesPath, taCategoriesPath)

    expect(result).toEqual(categorizedGroupsIndex)
  })
})

describe('tests groupsIndexParers.getArticleCategory()', () => {
  test('returns the category found in an occurrenceNote', async () => {
    const groupId = 'figs-metaphor'
    const category = 'translate'
    const occurrenceNote = 'This is my note (See: [[rc://en/ta/man/' + category + '/' + groupId + ']])'
    expect(getArticleCategory(occurrenceNote, groupId)).toBe(category)
  })

  test('returns the category found in an occurrenceNote as the second link', async () => {
    const groupId = 'figs-metaphor'
    const category = 'translate'
    const occurrenceNote = 'This is my note (See: [[rc://en/ta/man/checking/spelling]] and [[rc://en/ta/man/' + category + '/' + groupId + ']])'
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

