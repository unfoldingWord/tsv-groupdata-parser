jest.unmock('fs-extra')
import path from 'path-extra'
// helpers
import {getOccurrencesForQuote} from '../src/wordOccurrenceHelpers'

describe('getOccurrencesForQuote():', () => {
  test('should generate an array of objects for an original language quote', () => {
    const bookId = "tit"
    const chapter = 1
    const verse = 12
    const quote = "Κρῆτες ἀεὶ ψεῦσται"
    const originalBiblePath = path.join('__tests__', 'fixtures', 'resources', 'el-x-koine', 'bibles', 'ugnt', 'v0.5')
    const words = getOccurrencesForQuote(quote, bookId, chapter, verse, originalBiblePath)
    const expected = [
      {
        occurrence: 1,
        word: "Κρῆτες",
      },
      {
        occurrence: 1,
        word: "ἀεὶ",
      },
      {
        occurrence: 1,
        word: "ψεῦσται",
      }
    ]

    expect(words).toEqual(expected)
  })

  test('should generate an array of objects for an original language quote with punctuation', () => {
    const bookId = "tit"
    const chapter = 1
    const verse = 15
    const quote = "τοῖς μεμιαμμένοις καὶ ἀπίστοις, οὐδὲν καθαρόν"
    const originalBiblePath = path.join('__tests__', 'fixtures', 'resources', 'el-x-koine', 'bibles', 'ugnt', 'v0.5')
    const words = getOccurrencesForQuote(quote, bookId, chapter, verse, originalBiblePath)
    const expected = []

    expect(words).toEqual(expected)
  })
})
