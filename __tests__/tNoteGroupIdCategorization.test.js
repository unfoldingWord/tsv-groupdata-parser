import { categorizeGroupData } from '../src/tNoteGroupIdCategorization'
import titGroupData from './fixtures/tit_groupData.json'
import titCategorizedGroupData from './fixtures/tit_categorizedGroupData.json'
jest.unmock('fs-extra');
import fs from 'fs-extra';

describe('categorizeGroupData():', () => {
  test('Should categorized the group data into five groups: discourse, numbers, figures, culture, grammar or other.', async () => {
    const result = categorizeGroupData(titGroupData);
    fs.outputJsonSync('tit_categorizedGroupData.json', result, {spaces: 2})

    expect(Object.keys(result)).toEqual(['discourse', 'numbers', 'figures', 'culture', 'grammar','other'])
    // expect(result).toEqual(titCategorizedGroupData)
  })
})
