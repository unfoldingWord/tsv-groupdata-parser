import { tsvToGroupData } from '../src/tsvToGroupData'
import titGroupData from './fixtures/tit_groupData.json'

describe('tsvToGroupData():', () => {
  test('Parses a book tN TSVs to an object with a lists of group ids', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv'
    const result = await tsvToGroupData(filepath, "translationNotes");
  
    expect(result).toEqual(titGroupData)
  })
})
