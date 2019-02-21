jest.unmock('fs-extra')
import { generateGroupsIndex } from '../src/groupsIndexHelpers'
// fixture files
import categoriesGroupsIndex from './fixtures/categoriesGroupsIndex.json'

describe('generateGroupsIndex():', () => {
  test('returns an object with all the tn categories, each one with their groupsIndex', async () => {
    const tnCategoriesPath = '__tests__/fixtures/resources/en/translationHelps/translationNotes/v14'
    const taCategoriesPath = '__tests__/fixtures/resources/en/translationHelps/translationAcademy/v10'

    const result = generateGroupsIndex(tnCategoriesPath, taCategoriesPath)

    expect(result).toEqual(categoriesGroupsIndex)
  })
})