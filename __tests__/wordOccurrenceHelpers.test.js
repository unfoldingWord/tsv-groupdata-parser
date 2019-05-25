jest.unmock('fs-extra')
import path from 'path-extra'
// helpers
import ManageResource from '../src/helpers/ManageResourceAPI'
import { getWordOccurrencesForQuote } from '../src/helpers/wordOccurrenceHelpers'

function getTestResult(bookId, chapter, verse, quote) {
  const originalBiblePath = path.join('__tests__', 'fixtures', 'resources', 'el-x-koine', 'bibles', 'ugnt', 'v0.5')
  const resourceApi = new ManageResource(originalBiblePath, bookId)
  const verseString = resourceApi.getVerseString(chapter, verse)
  const words = getWordOccurrencesForQuote(quote, verseString)

  return words
}

describe('getWordOccurrencesForQuote():', () => {
  test('', () => {
    const quote = 'οὔτε‘ ἐνκατελείφθη εἰς ᾍδην'
    const words = getTestResult('act', 2, 31, quote)
    const expected = [
      {
        word: 'οὔτε',
        occurrence: 1,
      },
      {
        word: '‘',
        occurrence: 1,
      },
      {
        word: 'ἐνκατελείφθη',
        occurrence: 1,
      },
      {
        word: 'εἰς',
        occurrence: 1,
      },
      {
        word: 'ᾍδην',
        occurrence: 1,
      },
    ]
    expect(words).toEqual(expected)
  })
  test('should generate an array of objects for an original language quote with ellipsis', () => {
    const checks = [
      {
        bookId: 'tit',
        chapter: 1,
        verse: 15,
        quote: 'τοῖς ... μεμιαμμένοις καὶ ἀπίστοις, οὐδὲν καθαρόν', // omitted δὲ
        expected: [
          {
            word: 'τοῖς',
            occurrence: 2,
          },
          {
            word: '\u2026',
          },
          {
            word: 'μεμιαμμένοις',
            occurrence: 1,
          },
          {
            word: 'καὶ',
            occurrence: 1,
          },
          {
            word: 'ἀπίστοις',
            occurrence: 1,
          },
          {
            word: ',',
            occurrence: 1,
          },
          {
            word: 'οὐδὲν',
            occurrence: 1,
          },
          {
            word: 'καθαρόν',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'act',
        chapter: 1,
        verse: 2,
        quote: 'ἄχρι ἧς ἡμέρας ... ἀνελήμφθη', // omitted: ἐντειλάμενος τοῖς ἀποστόλοις διὰ Πνεύματος Ἁγίου , οὓς ἐξελέξατο,
        expected: [
          {
            word: 'ἄχρι',
            occurrence: 1,
          },
          {
            word: 'ἧς',
            occurrence: 1,
          },
          {
            word: 'ἡμέρας',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'ἀνελήμφθη',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'act',
        chapter: 1,
        verse: 2,
        quote: 'ἐντειλάμενος ... διὰ Πνεύματος Ἁγίου', // omitted "τοῖς ἀποστόλοις"
        expected: [
          {
            word: 'ἐντειλάμενος',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'διὰ',
            occurrence: 1,
          },
          {
            word: 'Πνεύματος',
            occurrence: 1,
          },
          {
            word: 'Ἁγίου',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'act',
        chapter: 1,
        verse: 10,
        quote: 'ἀτενίζοντες ... εἰς τὸν οὐρανὸν', // omitted ἦσαν
        expected: [
          {
            word: 'ἀτενίζοντες',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'εἰς',
            occurrence: 1,
          },
          {
            word: 'τὸν',
            occurrence: 1,
          },
          {
            word: 'οὐρανὸν',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'act',
        chapter: 3,
        verse: 21,
        quote: 'στόματος τῶν ἁγίων ... αὐτοῦ προφητῶν', // omitted: ἀπ’ αἰῶνος
        expected: [
          {
            word: 'στόματος',
            occurrence: 1,
          },
          {
            word: 'τῶν',
            occurrence: 1,
          },
          {
            word: 'ἁγίων',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'αὐτοῦ',
            occurrence: 1,
          },
          {
            word: 'προφητῶν',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'act',
        chapter: 15,
        verse: 2,
        quote: 'στάσεως καὶ ζητήσεως οὐκ ὀλίγης ... πρὸς αὐτοὺς', // omitted τῷ Παύλῳ καὶ τῷ Βαρναβᾷ
        expected: [
          {
            word: 'στάσεως',
            occurrence: 1,
          },
          {
            word: 'καὶ',
            occurrence: 1,
          },
          {
            word: 'ζητήσεως',
            occurrence: 1,
          },
          {
            word: 'οὐκ',
            occurrence: 1,
          },
          {
            word: 'ὀλίγης',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'πρὸς',
            occurrence: 1,
          },
          {
            word: 'αὐτοὺς',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'mat',
        chapter: 1,
        verse: 5,
        quote: 'Σαλμὼν ... ἐγέννησεν τὸν Βόες ἐκ τῆς Ῥαχάβ', // omitted: δὲ
        expected: [
          {
            word: 'Σαλμὼν',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'ἐγέννησεν',
            occurrence: 1,
          },
          {
            word: 'τὸν',
            occurrence: 1,
          },
          {
            word: 'Βόες',
            occurrence: 1,
          },
          {
            word: 'ἐκ',
            occurrence: 1,
          },
          {
            word: 'τῆς',
            occurrence: 1,
          },
          {
            word: 'Ῥαχάβ',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'mat',
        chapter: 1,
        verse: 12,
        quote: 'τὸν Σαλαθιήλ, Σαλαθιὴλ ... ἐγέννησεν τὸν Ζοροβαβέλ', // omitted: δὲ
        expected: [
          {
            word: 'τὸν',
            occurrence: 1,
          },
          {
            word: 'Σαλαθιήλ',
            occurrence: 1,
          },
          {
            word: ',',
            occurrence: 2,
          },
          {
            word: 'Σαλαθιὴλ',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'ἐγέννησεν',
            occurrence: 2,
          },
          {
            word: 'τὸν',
            occurrence: 2,
          },
          {
            word: 'Ζοροβαβέλ',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'mat',
        chapter: 1,
        verse: 18,
        quote: 'πρὶν ... συνελθεῖν αὐτοὺς', // omitted: ἢ
        expected: [
          {
            word: 'πρὶν',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'συνελθεῖν',
            occurrence: 1,
          },
          {
            word: 'αὐτοὺς',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'mat',
        chapter: 1,
        verse: 24,
        quote: 'ὡς προσέταξεν ... ὁ ἄγγελος Κυρίου', // omitted: αὐτῷ
        expected: [
          {
            word: 'ὡς',
            occurrence: 1,
          },
          {
            word: 'προσέταξεν',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'ὁ',
            occurrence: 2,
          },
          {
            word: 'ἄγγελος',
            occurrence: 1,
          },
          {
            word: 'Κυρίου',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'mat',
        chapter: 2,
        verse: 13,
        quote: 'ἕως ... εἴπω σοι', // omitted:ἂν
        expected: [
          {
            word: 'ἕως',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'εἴπω',
            occurrence: 1,
          },
          {
            word: 'σοι',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'rom',
        chapter: 1,
        verse: 18,
        quote: 'τὴν ἀλήθειαν ... κατεχόντων', // omitted: ἐν ἀδικίᾳ
        expected: [
          {
            word: 'τὴν',
            occurrence: 1,
          },
          {
            word: 'ἀλήθειαν',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'κατεχόντων',
            occurrence: 1,
          },
        ],
      },
      {
        bookId: 'rom',
        chapter: 1,
        verse: 27,
        quote: 'καὶ ... ἄρσενες ἀφέντες τὴν φυσικὴν χρῆσιν τῆς θηλείας', // omitted: οἱ
        expected: [
          {
            word: 'καὶ',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'ἄρσενες',
            occurrence: 1,
          },
          {
            word: 'ἀφέντες',
            occurrence: 1,
          },
          {
            word: 'τὴν',
            occurrence: 1,
          },
          {
            word: 'φυσικὴν',
            occurrence: 1,
          },
          {
            word: 'χρῆσιν',
            occurrence: 1,
          },
          {
            word: 'τῆς',
            occurrence: 1,
          },
          {
            word: 'θηλείας',
            occurrence: 1,
          },
        ],
      },
      {
        // figs-metonymy
        bookId: 'mat',
        chapter: 3,
        verse: 5,
        quote: 'τότε ... Ἱεροσόλυμα ... πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος',
        expected: [
          {
            word: 'τότε',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'Ἱεροσόλυμα',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'πᾶσα',
            occurrence: 1,
          },
          {
            word: 'ἡ',
            occurrence: 1,
          },
          {
            word: 'Ἰουδαία',
            occurrence: 1,
          },
          {
            word: ',',
            occurrence: 2,
          },
          {
            word: 'καὶ',
            occurrence: 2,
          },
          {
            word: 'πᾶσα',
            occurrence: 2,
          },
          {
            word: 'ἡ',
            occurrence: 2,
          },
          {
            word: 'περίχωρος',
            occurrence: 1,
          },
        ],
      },
      {
        // figs-ellipsis
        bookId: 'mat',
        chapter: 1,
        verse: 7,
        quote: 'Ῥοβοάμ, Ῥοβοὰμ ... ἐγέννησεν τὸν Ἀβιά, Ἀβιὰ ... ἐγέννησεν τὸν Ἀσάφ',
        expected: [
          {
            word: 'Ῥοβοάμ',
            occurrence: 1,
          },
          {
            word: ',',
            occurrence: 1,
          },
          {
            word: 'Ῥοβοὰμ',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'ἐγέννησεν',
            occurrence: 2,
          },
          {
            word: 'τὸν',
            occurrence: 2,
          },
          {
            word: 'Ἀβιά',
            occurrence: 1,
          },
          {
            word: ',',
            occurrence: 2,
          },
          {
            word: 'Ἀβιὰ',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'ἐγέννησεν',
            occurrence: 3,
          },
          {
            word: 'τὸν',
            occurrence: 3,
          },
          {
            word: 'Ἀσάφ',
            occurrence: 1,
          },
        ],
      },
      {
        // figs-metonymy
        bookId: 'mat',
        chapter: 3,
        verse: 5,
        quote: 'τότε ... Ἱεροσόλυμα ... πᾶσα ἡ Ἰουδαία, καὶ πᾶσα ἡ περίχωρος',
        expected: [
          {
            word: 'τότε',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'Ἱεροσόλυμα',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'πᾶσα',
            occurrence: 1,
          },
          {
            word: 'ἡ',
            occurrence: 1,
          },
          {
            word: 'Ἰουδαία',
            occurrence: 1,
          },
          {
            word: ',',
            occurrence: 2,
          },
          {
            word: 'καὶ',
            occurrence: 2,
          },
          {
            word: 'πᾶσα',
            occurrence: 2,
          },
          {
            word: 'ἡ',
            occurrence: 2,
          },
          {
            word: 'περίχωρος',
            occurrence: 1,
          },
        ],
      },
      {
        // figs-metaphor
        bookId: 'rev',
        chapter: 3,
        verse: 17,
        quote: 'σὺ εἶ ὁ ταλαίπωρος ... ἐλεεινὸς ... πτωχὸς ... τυφλὸς, καὶ γυμνός',
        expected: [
          {
            word: 'σὺ',
            occurrence: 1,
          },
          {
            word: 'εἶ',
            occurrence: 1,
          },
          {
            word: 'ὁ',
            occurrence: 1,
          },
          {
            word: 'ταλαίπωρος',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'ἐλεεινὸς',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'πτωχὸς',
            occurrence: 1,
          },
          {
            word: '\u2026',
          },
          {
            word: 'τυφλὸς',
            occurrence: 1,
          },
          {
            word: ',',
            occurrence: 8,
          },
          {
            word: 'καὶ',
            occurrence: 7,
          },
          {
            word: 'γυμνός',
            occurrence: 1,
          },
        ],
      },
    ]
    checks.forEach(({ bookId, chapter, verse, quote, expected }) => {
      const result = getTestResult(bookId, chapter, verse, quote)
      expect(result).toEqual(expected)
    })
  })
  test('should generate an array of objects for an original language quote', () => {
    const quote = 'Κρῆτες ἀεὶ ψεῦσται'
    const result = getTestResult('tit', 1, 12, quote)
    const expected = [
      {
        word: 'Κρῆτες',
        occurrence: 1,
      },
      {
        word: 'ἀεὶ',
        occurrence: 1,
      },
      {
        word: 'ψεῦσται',
        occurrence: 1,
      },
    ]
    expect(result).toEqual(expected)
  })
  test('', () => {
    const quote = 'ἐν κακίᾳ καὶ φθόνῳ διάγοντες'
    const result = getTestResult('tit', 3, 3, quote)
    const expected = [
      {
        word: 'ἐν',
        occurrence: 1,
      },
      {
        word: 'κακίᾳ',
        occurrence: 1,
      },
      {
        word: 'καὶ',
        occurrence: 3,
      },
      {
        word: 'φθόνῳ',
        occurrence: 1,
      },
      {
        word: 'διάγοντες',
        occurrence: 1,
      },
    ]
    expect(result).toEqual(expected)
  })
  test('', () => {
    const quote = 'ματαιολόγοι, καὶ φρεναπάται'
    const words = getTestResult('tit', 1, 10, quote)
    const expected = [
      {
        word: 'ματαιολόγοι',
        occurrence: 1,
      },
      {
        word: ',',
        occurrence: 2,
      },
      {
        word: 'καὶ',
        occurrence: 2,
      },
      {
        word: 'φρεναπάται',
        occurrence: 1,
      },
    ]
    expect(words).toEqual(expected)
  })
  test('', () => {
    const quote = 'Κλαύδιος Λυσίας, τῷ κρατίστῳ ἡγεμόνι Φήλικι, χαίρειν'
    const words = getTestResult('act', 23, 26, quote)
    const expected = [
      {
        word: 'Κλαύδιος',
        occurrence: 1,
      },
      {
        word: 'Λυσίας',
        occurrence: 1,
      },
      {
        word: ',',
        occurrence: 1,
      },
      {
        word: 'τῷ',
        occurrence: 1,
      },
      {
        word: 'κρατίστῳ',
        occurrence: 1,
      },
      {
        word: 'ἡγεμόνι',
        occurrence: 1,
      },
      {
        word: 'Φήλικι',
        occurrence: 1,
      },
      {
        word: ',',
        occurrence: 2,
      },
      {
        word: 'χαίρειν',
        occurrence: 1,
      },
    ]
    expect(words).toEqual(expected)
  })
  test('', () => {
    const quote = 'τοῦ δοῦναι μετάνοιαν τῷ Ἰσραὴλ καὶ ἄφεσιν ἁμαρτιῶν'
    const words = getTestResult('act', 5, 31, quote)
    const expected = [
      {
        word: 'τοῦ',
        occurrence: 1,
      },
      {
        word: 'δοῦναι',
        occurrence: 1,
      },
      {
        word: 'μετάνοιαν',
        occurrence: 1,
      },
      {
        word: 'τῷ',
        occurrence: 1,
      },
      {
        word: 'Ἰσραὴλ',
        occurrence: 1,
      },
      {
        word: 'καὶ',
        occurrence: 2,
      },
      {
        word: 'ἄφεσιν',
        occurrence: 1,
      },
      {
        word: 'ἁμαρτιῶν',
        occurrence: 1,
      },
    ]
    expect(words).toEqual(expected)
  })
  test('', () => {
    const quote = 'καὶ ἐτελεύτησεν καὶ ἐτάφη'
    const words = getTestResult('act', 2, 29, quote)
    const expected = [
      {
        word: 'καὶ',
        occurrence: 1,
      },
      {
        word: 'ἐτελεύτησεν',
        occurrence: 1,
      },
      {
        word: 'καὶ',
        occurrence: 2,
      },
      {
        word: 'ἐτάφη',
        occurrence: 1,
      },
    ]
    expect(words).toEqual(expected)
  })
  test('', () => {
    const quote = 'τίμιος παντὶ τῷ λαῷ'
    const result = getTestResult('act', 5, 34, quote)
    const expected = [
      {
        word: 'τίμιος',
        occurrence: 1,
      },
      {
        word: 'παντὶ',
        occurrence: 1,
      },
      {
        word: 'τῷ',
        occurrence: 2,
      },
      {
        word: 'λαῷ',
        occurrence: 1,
      },
    ]
    expect(result).toEqual(expected)
  })
  test('', () => {
    const quote = 'πάντες ὅσοι ἐπείθοντο αὐτῷ διελύθησαν'
    const result = getTestResult('act', 5, 36, quote)
    const expected = [
      {
        word: 'πάντες',
        occurrence: 1,
      },
      {
        word: 'ὅσοι',
        occurrence: 1,
      },
      {
        word: 'ἐπείθοντο',
        occurrence: 1,
      },
      {
        word: 'αὐτῷ',
        occurrence: 1,
      },
      {
        word: 'διελύθησαν',
        occurrence: 1,
      },
    ]
    expect(result).toEqual(expected)
  })
  test('', () => {
    const quote = 'ἐὰν μὴ οὗτοι μείνωσιν ἐν τῷ πλοίῳ, ὑμεῖς σωθῆναι οὐ δύνασθε'
    const result = getTestResult('act', 27, 31, quote)
    const expected = [
      {
        word: 'ἐὰν',
        occurrence: 1,
      },
      {
        word: 'μὴ',
        occurrence: 1,
      },
      {
        word: 'οὗτοι',
        occurrence: 1,
      },
      {
        word: 'μείνωσιν',
        occurrence: 1,
      },
      {
        word: 'ἐν',
        occurrence: 1,
      },
      {
        word: 'τῷ',
        occurrence: 2,
      },
      {
        word: 'πλοίῳ',
        occurrence: 1,
      },
      {
        word: ',',
        occurrence: 2,
      },
      {
        word: 'ὑμεῖς',
        occurrence: 1,
      },
      {
        word: 'σωθῆναι',
        occurrence: 1,
      },
      {
        word: 'οὐ',
        occurrence: 1,
      },
      {
        word: 'δύνασθε',
        occurrence: 1,
      },
    ]
    expect(result).toEqual(expected)
  })
})
