import deepEqual from 'deep-equal';
import { getVerses, getVerseString } from '../src/helpers/verseHelpers';

const bookData = {
  '1': {
    'front' : '1:Front;',
    '1' : '1:1;',
    '2' : '1:2;',
    '3-4' : '1:3-4;',
    '5' : '1:5;',
    '6' : '1:6;',
    '7' : '1:7;',
  },
  '2': {
    'front' : '2:Front;',
    '1' : '2:1;',
    '2' : '2:2;',
    '3-4' : '2:3-4;',
    '5' : '2:5;',
    '6' : '2:6;',
    '7' : '2:7;',
  },
};

const checks = [
  { ref: '1:1', expectedVerses: [{ chapter: 1, verse: 1, verseData: '1:1;' }], expectedStr: '1:1;' },
  { ref: '1:front', expectedVerses: [{ chapter: 1, verse: 'front', verseData: '1:Front;' }], expectedStr: '1:Front;' },
  { ref: '1:intro', expectedVerses: [{ chapter: 1, verse: 'intro', verseData: undefined }], expectedStr: null },
  { ref: 'intro:intro', expectedVerses: [{ chapter: 'intro', verse: 'intro', verseData: undefined }], expectedStr: null },
  { ref: '1:1-2', expectedVerses: [{ chapter: 1, verse: 1, verseData: '1:1;' }, { chapter: 1, verse: 2, verseData: '1:2;' }], expectedStr: '1:1;1:2;' },
  { ref: '1:1,2', expectedVerses: [{ chapter: 1, verse: 1, verseData: '1:1;' }, { chapter: 1, verse: 2, verseData: '1:2;' }], expectedStr: '1:1;1:2;' },
  { ref: '1:12', expectedVerses: [{ chapter: 1, verse: 12, verseData: undefined }], expectedStr: null },
  { ref: '3:1', expectedVerses: [{ chapter: 3, verse: 1, verseData: undefined }], expectedStr: null },
  { ref: '1:7-2:1', expectedVerses: [{ chapter: 1, verse: 7, verseData: '1:7;' }, { chapter: 2, verse: 1, verseData: '2:1;' }], expectedStr: '1:7;2:1;' },
  { ref: '1:2-3', expectedVerses: [{ chapter: 1, verse: 2, verseData: '1:2;' }, { chapter: 1, verse: '3-4', verseData: '1:3-4;' }], expectedStr: '1:2;1:3-4;' },
  { ref: '1:2-5', expectedVerses: [{ chapter: 1, verse: 2, verseData: '1:2;' }, { chapter: 1, verse: '3-4', verseData: '1:3-4;' }, { chapter: 1, verse: 5, verseData: '1:5;' }], expectedStr: '1:2;1:3-4;1:5;' },
  { ref: '1:3-4', expectedVerses: [{ chapter: 1, verse: '3-4', verseData: '1:3-4;' }], expectedStr: '1:3-4;' },
  { ref: '2:4-5', expectedVerses: [{ chapter: 2, verse: '3-4', verseData: '2:3-4;' }, { chapter: 2, verse: 5, verseData: '2:5;' } ], expectedStr: '2:3-4;2:5;' },
  { ref: '2:7-3:1', expectedVerses: [{ chapter: 2, verse: 7, verseData: '2:7;' }], expectedStr: '2:7;' },
  { ref: '2:7;3:1', expectedVerses: [{ chapter: 2, verse: 7, verseData: '2:7;' }, { chapter: 3, verse: 1, verseData: undefined }], expectedStr: null },
];

describe('test references', () => {
  test('getVerses() tests should pass', () => {
    checks.forEach(check => {
      const expected = check.expectedVerses;
      const ref = check.ref;
      const result = getVerses(bookData, ref) ;

      if (!deepEqual(result, expected)) {
        console.log(`Failing test "${ref}": Expected "${JSON.stringify(expected)}"\nBut got "${JSON.stringify(result)}"`);
      }
      expect(expected).toEqual(result);
    });
  });
  test('getVerseString() - tests should pass', () => {
    checks.forEach(check => {
      const expected = check.expectedStr;
      const ref = check.ref;
      const result = getVerseString(bookData, ref) ;

      if (!deepEqual(result, expected)) {
        console.log(`Failing test "${ref}": Expected "${expected}"\nBut got "${result}"`);
      }
      expect(expected).toEqual(result);
    });
  });
});
