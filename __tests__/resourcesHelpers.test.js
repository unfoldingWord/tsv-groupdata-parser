import fs from 'fs-extra'
import { getBibleIdForLanguage, getGroupName } from '../src/helpers/resourcesHelpers'

jest.mock('fs-extra')

describe('tests getGroupName()', () => {
  beforeAll(() => {
    fs.__setMockFS({
      '/en/translationHelps/translationAcademy/articles/test.md': '# test #\n\nThis is a test',
    })
  })

  test('Get Group Name', () => {
    const groupName = getGroupName('/en/translationHelps/translationAcademy/articles/test.md')
    const expectedGroupName = 'test'
    expect(groupName).toEqual(expectedGroupName)
  })
})

describe('tests getBibleIdForLanguage()', () => {
  beforeAll(() => {
    fs.__setMockFS({
      '/en/bibles': ['t4t', 'udb', 'ulb', 'ult', 'ust'],
      '/hi/bibles': ['irv', 'udb', 'ulb'],
      '/ru/bibles': ['rb1', 'rb2'],
    })
  })

  test('Getting the English Bible', () => {
    const bibleId = getBibleIdForLanguage('/en/bibles')
    const expectedBibleId = 'ult'
    expect(bibleId).toEqual(expectedBibleId)
  })

  test('Getting the Hindi Bible', () => {
    const bibleId = getBibleIdForLanguage('/hi/bibles')
    const expectedBibleId = 'irv'
    expect(bibleId).toEqual(expectedBibleId)
  })

  test('Getting the Russian Bible', () => {
    const bibleId = getBibleIdForLanguage('/ru/bibles')
    const expectedBibleId = 'rb1'
    expect(bibleId).toEqual(expectedBibleId)
  })
})
