import { tsvToGroupdata } from '../src/tsvToGroupdata'
import titGroupIds from './fixtures/tit_groupIds.json'

describe('tsvToGroupdata():', () => {
  test('Parses a book tN TSVs to an object with a lists of group ids', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv'
    const result = await tsvToGroupdata(filepath, "translationNotes");
  
    expect(result).toEqual(titGroupIds)
  })
})
