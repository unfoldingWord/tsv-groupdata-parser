import { categorizeGroupData } from '../src/tNoteGroupIdCategorization'
import titGroupData from './fixtures/tit_groupData.json'
import titCategorizedGroupData from './fixtures/tit_categorizedGroupData.json'

describe('categorizeGroupData():', () => {
  test('Should categorized the group data into five groups: lexical, figures, cultural, morphological or other.', async () => {
    const result = categorizeGroupData(titGroupData);

    expect(Object.keys(result)).toEqual(['lexical', 'figures', 'cultural', 'morphological','other'])
    expect(result).toEqual(titCategorizedGroupData)
  })
})
