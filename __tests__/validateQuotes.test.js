jest.unmock('fs-extra')
import fs from 'fs-extra'
import path from 'path-extra'
import ospath from 'ospath'

import { validateTsvQuotes } from '../src/helpers/validateQuotes'

describe('validateTsvQuotes():', () => {
  test('', async () => {
    const RESOURCE_PATH = path.join(ospath.home(), 'translationCore', 'resources')
    const UGNT_PATH = path.join(RESOURCE_PATH, 'el-x-koine', 'bibles', 'ugnt', 'v0.6')
    const UHB_PATH = path.join(RESOURCE_PATH, 'hbo', 'bibles', 'uhb', 'v2.1.1')
    const tsvFilesPath = path.join(ospath.home(), 'Downloads', 'en_tn')
    const result = await validateTsvQuotes({ UGNT_PATH, UHB_PATH }, tsvFilesPath)

    console.log('result', result.length)
    fs.outputJsonSync('corruptedQuotes.json', result, { spaces: 2 })
    // expect(result).toEqual()
  })
})
