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
    const discourseFiles = []
    const numbersFiles = []
    const figuresFiles = [
      'figs-metaphor.json',
      'figs-ellipsis.json',
      'figs-metonymy.json',
      'figs-hyperbole.json',
      'figs-personification.json',
      'figs-hendiadys.json',
      'figs-doublenegatives.json'
    ]
    const cultureFiles = ['figs-explicit.json', 'translate-names.json']
    const grammarFiles = ['figs-abstractnouns.json', 'figs-activepassive.json', 'figs-hypo.json']
    const otherFiles = []

    // formatAndSaveGroupData creates files and persist them in the filesystem (Mock fs in this case).
    formatAndSaveGroupData(categorizedGroupData, 'root', 'tit')

    // Read the directories to get the resulting files,
    const discourseResultFiles = fs.readdirSync(path.join('root', 'discourse', 'groups', 'tit'))
    const numbersResultFiles = fs.readdirSync(path.join('root', 'numbers', 'groups', 'tit'))
    const figuresResultFiles = fs.readdirSync(path.join('root', 'figures', 'groups', 'tit'))
    const cultureResultFiles = fs.readdirSync(path.join('root', 'culture', 'groups', 'tit'))
    const grammarResultFiles = fs.readdirSync(path.join('root', 'grammar', 'groups', 'tit'))
    const otherResultFiles = fs.readdirSync(path.join('root', 'other', 'groups', 'tit'))

    // Verify the correct files are being generated in the filesystem.
    expect(discourseFiles).toEqual(discourseResultFiles)
    expect(numbersFiles).toEqual(numbersResultFiles)
    expect(figuresFiles).toEqual(figuresResultFiles)
    expect(cultureFiles).toEqual(cultureResultFiles)
    expect(grammarFiles).toEqual(grammarResultFiles)
    expect(otherFiles).toEqual(otherResultFiles)
  })
})
