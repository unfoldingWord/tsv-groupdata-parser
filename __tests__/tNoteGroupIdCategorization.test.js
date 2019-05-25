import { categorizeGroupData } from '../src/tNoteGroupIdCategorization'
import titGroupData from './fixtures/tit_groupData.json'
import titCategorizedGroupData from './fixtures/tit_categorizedGroupData.json'

describe('categorizeGroupData():', () => {
  test('Should categorized the group data into five groups: discourse, numbers, figures, culture, grammar or other.', async () => {
    const result = categorizeGroupData(titGroupData)

    expect(Object.keys(result)).toEqual(['discourse', 'numbers', 'figures', 'culture', 'grammar', 'other'])
    expect(result).toEqual(titCategorizedGroupData)
  })
})
