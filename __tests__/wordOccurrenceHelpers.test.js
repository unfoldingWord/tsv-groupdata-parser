jest.unmock('fs-extra')
import path from 'path-extra'
import ManageResource from '../src/ManageResource'
import {getWordOccurrencesForQuote} from '../src/wordOccurrenceHelpers'

function getTestResult(bookId, chapter, verse, quote) {
  const originalBiblePath = path.join('__tests__', 'fixtures', 'resources', 'el-x-koine', 'bibles', 'ugnt', 'v0.5')
  const resourceApi = new ManageResource(originalBiblePath, bookId)
  const verseString = resourceApi.getVerseString(chapter, verse)
  const words = getWordOccurrencesForQuote(quote, verseString)

  return words;
}

describe('getOccurrencesForQuote():', () => {
  // test('', () => {
  //   const quote = "οὔτε‘ ἐνκατελείφθη εἰς ᾍδην"
  //   const words = getTestResult('act', 2, 31, quote)
  //   const expected = [
  //     {
  //       word: "οὔτε",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "‘ ",// take a look at this
  //       occurrence: 1,
  //     },
  //     {
  //       word: "ἐνκατελείφθη",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "εἰς",
  //       occurrence: 1,
  //     },
  //     {
  //       word: "ᾍδην",
  //       occurrence: 1,
  //     },
  //   ]

  //   expect(words).toEqual(expected)
  // })

  // test('should generate an array of objects for an original language quote with punctuation', () => {
  //   const quote = "μεμιαμμένοις καὶ ἀπίστοις, οὐδὲν καθαρόν"
  //   const result = getTestResult('tit', 1, 15, quote)
  //   const expected = []

  //   expect(result).toEqual(expected)
  // })

    // test('', () => {
  //   const quote = "καὶ ... τοῖς ἔθνεσιν ὁ Θεὸς τὴν μετάνοιαν εἰς ζωὴν ἔδωκεν"
  //   const words = getTestResult('act', 11, 18, quote)
  //   const expected = []

  //   expect(words).toEqual(expected)
  // })

  // test('', () => {
  //   const quote = "εἰς ... σωτηρίαν ἕως ἐσχάτου τῆς γῆς"
  //   const words = getTestResult('act', 13, 47, quote)
  //   const expected = []

  //   expect(words).toEqual(expected)
  // })

  // test('', () => {
  //   const quote = "στάσεως καὶ ζητήσεως οὐκ ὀλίγης ... πρὸς αὐτοὺς"
  //   const words = getTestResult('act', 15, 2, quote)
  //   const expected = []

  //   expect(words).toEqual(expected)
  // })


  test('should generate an array of objects for an original language quote', () => {
    const quote = "Κρῆτες ἀεὶ ψεῦσται"
    const result = getTestResult('tit', 1, 12, quote)
    const expected = [
      {
        word: "Κρῆτες",
        occurrence: 1,
      },
      {
        word: "ἀεὶ",
        occurrence: 1,
      },
      {
        word: "ψεῦσται",
        occurrence: 1,
      }
    ]

    expect(result).toEqual(expected)
  })

  test('', () => {
    const quote = "ἐν κακίᾳ καὶ φθόνῳ διάγοντες"
    const result = getTestResult('tit', 3, 3, quote)
    const expected = [
      {
        word: "ἐν",
        occurrence: 1,
      },
      {
        word: "κακίᾳ",
        occurrence: 1,
      },
      {
        word: "καὶ",
        occurrence: 3,
      },
      {
        word: "φθόνῳ",
        occurrence: 1,
      },
      {
        word: "διάγοντες",
        occurrence: 1,
      },
    ]

    expect(result).toEqual(expected)
  })

  test('', () => {
    const quote = "ματαιολόγοι, καὶ φρεναπάται"
    const words = getTestResult('tit', 1, 10, quote)
    const expected = [
      {
        word: "ματαιολόγοι",
        occurrence: 1,
      },
      {
        word: ",",
        occurrence: 2,
      },
      {
        word: "καὶ",
        occurrence: 2,
      },
      {
        word: "φρεναπάται",
        occurrence: 1,
      },
    ]

    expect(words).toEqual(expected)
  })


  test('', () => {
    const quote = "Κλαύδιος Λυσίας, τῷ κρατίστῳ ἡγεμόνι Φήλικι, χαίρειν"
    const words = getTestResult('act', 23, 26, quote)
    const expected = [
      {
        word: "Κλαύδιος",
        occurrence: 1,
      },
      {
        word: "Λυσίας",
        occurrence: 1,
      },
      {
        word: ",",
        occurrence: 1,
      },
      {
        word: "τῷ",
        occurrence: 1,
      },
      {
        word: "κρατίστῳ",
        occurrence: 1,
      },
      {
        word: "ἡγεμόνι",
        occurrence: 1,
      },
      {
        word: "Φήλικι",
        occurrence: 1,
      },
      {
        word: ",",
        occurrence: 2,
      },
      {
        word: "χαίρειν",
        occurrence: 1,
      },
    ]

    expect(words).toEqual(expected)
  })

  test('', () => {
    const quote = "τοῦ δοῦναι μετάνοιαν τῷ Ἰσραὴλ καὶ ἄφεσιν ἁμαρτιῶν"
    const words = getTestResult('act', 5, 31, quote)
    const expected = [
      {
        word: "τοῦ",
        occurrence: 1,
      },
      {
        word: "δοῦναι",
        occurrence: 1,
      },
      {
        word: "μετάνοιαν",
        occurrence: 1,
      },
      {
        word: "τῷ",
        occurrence: 1,
      },
      {
        word: "Ἰσραὴλ",
        occurrence: 1,
      },
      {
        word: "καὶ",
        occurrence: 2,
      },
      {
        word: "ἄφεσιν",
        occurrence: 1,
      },
      {
        word: "ἁμαρτιῶν",
        occurrence: 1,
      }
    ]

    expect(words).toEqual(expected)
  })

  test('', () => {
    const quote = "καὶ ἐτελεύτησεν καὶ ἐτάφη"
    const words = getTestResult('act', 2, 29, quote)
    const expected = [
      {
        word: "καὶ",
        occurrence: 1,
      },
      {
        word: "ἐτελεύτησεν",
        occurrence: 1,
      },
      {
        word: "καὶ",
        occurrence: 2,
      },
      {
        word: "ἐτάφη",
        occurrence: 1,
      },
    ]

    expect(words).toEqual(expected)
  })

  test('', () => {
    const quote = "τίμιος παντὶ τῷ λαῷ"
    const result = getTestResult('act', 5, 34, quote)
    const expected = [
      {
        word: "τίμιος",
        occurrence: 1
      },
      {
        word: "παντὶ",
        occurrence: 1
      },
      {
        word: "τῷ",
        occurrence: 2
      },
      {
        word: "λαῷ",
        occurrence: 1
      }
    ]

    expect(result).toEqual(expected)
  })

  test('', () => {
    const quote = "πάντες ὅσοι ἐπείθοντο αὐτῷ διελύθησαν"
    const result = getTestResult('act', 5, 36, quote)
    const expected = [
      {
        word: "πάντες",
        occurrence: 1
      },
      {
        word: "ὅσοι",
        occurrence: 1
      },
      {
        word: "ἐπείθοντο",
        occurrence: 1
      },
      {
        word: "αὐτῷ",
        occurrence: 1
      },
      {
        word: "διελύθησαν",
        occurrence: 1
      }
    ]

    expect(result).toEqual(expected)
  })

  test('', () => {
    const quote = "ἐὰν μὴ οὗτοι μείνωσιν ἐν τῷ πλοίῳ, ὑμεῖς σωθῆναι οὐ δύνασθε"
    const result = getTestResult('act', 27, 31, quote)
    const expected = [
      {
        word: "ἐὰν",
        occurrence: 1
      },
      {
        word: "μὴ",
        occurrence: 1
      },
      {
        word: "οὗτοι",
        occurrence: 1
      },
      {
        word: "μείνωσιν",
        occurrence: 1
      },
      {
        word: "ἐν",
        occurrence: 1
      },
      {
        word: "τῷ",
        occurrence: 2
      },
      {
        word: "πλοίῳ",
        occurrence: 1
      },
      {
        word: ",",
        occurrence: 2
      },
      {
        word: "ὑμεῖς",
        occurrence: 1
      },
      {
        word: "σωθῆναι",
        occurrence: 1
      },
      {
        word: "οὐ",
        occurrence: 1
      },
      {
        word: "δύνασθε",
        occurrence: 1
      }
    ]

    expect(result).toEqual(expected)
  })
})
