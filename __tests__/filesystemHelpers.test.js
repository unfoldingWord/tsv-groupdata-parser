jest.mock('fs-extra');
import fs from 'fs-extra';
import path from 'path-extra'
import { formatAndSaveGroupData } from '../src/filesystemHelpers'
import categorizedGroupData from './fixtures/tit_categorizedGroupData.json'

describe('formatAndSaveGroupData()', () => {
  beforeAll(() => {
    fs.__setMockDirectories([])
  })

  test('', () => {
    // Expected files.
    const figuresFiles = [
      'figs-metaphor.json',
      'figs-ellipsis.json',
      'figs-metonymy.json',
      'figs-hyperbole.json',
      'figs-personification.json',
      'figs-hendiadys.json',
      'figs-doublenegatives.json'
    ]
    const culturalFiles = ['figs-explicit.json']
    const morphologicalFiles = ['figs-activepassive.json']
    const otherFiles = ['figs-abstractnouns.json', 'figs-hypo.json', 'translate-names.json']

    // formatAndSaveGroupData creates files and persist them in the filesystem (Mock fs in this case).
    formatAndSaveGroupData(categorizedGroupData, 'root', 'tit')

    // Read the directories to get the resulting files,
    const figuresResultFiles = fs.readdirSync(path.join('root', 'figures', 'groups', 'tit'))
    const culturalResultFiles = fs.readdirSync(path.join('root', 'cultural', 'groups', 'tit'))
    const morphologicalResultFiles = fs.readdirSync(path.join('root', 'morphological', 'groups', 'tit'))
    const otherResultFiles = fs.readdirSync(path.join('root', 'other', 'groups', 'tit'))

    // Verify the correct files are being generated in the filesystem.
    expect(figuresFiles).toEqual(figuresResultFiles)
    expect(culturalFiles).toEqual(culturalResultFiles)
    expect(morphologicalFiles).toEqual(morphologicalResultFiles)
    expect(otherFiles).toEqual(otherResultFiles)
  })
})
