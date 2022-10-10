import fs from 'fs-extra';
import path from 'path-extra';
// helpers
import { convertTsv9to7 } from '../src/tsvConversion';

jest.unmock('fs-extra');

// constants
const TSV_PATH = path.join(__dirname, 'fixtures/tsv');

describe('Tests convertTsv9to7', function () {
  const fileNames = [
    'en_tn_08-RUT.tsv',
    'en_tn_41-MAT.tsv',
    'en_tn_42-MRK.tsv',
    'en_tn_57-TIT.tsv',
    'hi_tn_57-TIT.tsv',
    'en_tn_57-TIT-invalid-ref.tsv',
    'en_tn_57-TIT-missing-occurrence-note.tsv',
    'en_tn_57-TIT-white-space-as-support-ref.tsv'
  ];

  for (const fileName of fileNames) {
    it(`${fileName} should pass`, () => {
      // given
      const tsvPath = path.join(TSV_PATH, fileName);
      const tsv = fs.readFileSync(tsvPath, 'utf8');
      const expectedLines = getLineCount(tsv);

      // when
      const results = convertTsv9to7(tsv);

      //then
      expect(results.tsv).toBeTruthy();
      const resultsLines = getLineCount(results.tsv);
      expect(resultsLines).toEqual(expectedLines);
      expect(results.errors).toMatchSnapshot();
    });
  }

  it(`should fail insufficient columns`, () => {
    // given
    const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\n' +
      'TIT\t1\t1\txyz8\tfigs-abstractnouns\tἐπίγνωσιν ἀληθείας\t1\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n'
    const expectedLines = getLineCount(tsv);

    // when
    const results = convertTsv9to7(tsv);

    //then
    expect(results.tsv).toEqual(null);
    expect(results.errors).toMatchSnapshot();
  });

  describe('ID tests', function () {
    it(`should catch short ID`, () => {
      // given
      const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
        'TIT\t1\t1\txyz\tfigs-abstractnouns\tἐπίγνωσιν ἀληθείας\t1\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n'
      const expectedLines = getLineCount(tsv);

      // when
      const results = convertTsv9to7(tsv);

      //then
      expect(results.tsv).toBeTruthy();
      const resultsLines = getLineCount(results.tsv);
      expect(resultsLines).toEqual(expectedLines);
      expect(results.errors).toMatchSnapshot();
    });

    it(`should catch invalid chars in ID`, () => {
      // given
      const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
        'TIT\t1\t1\txRpz\tfigs-abstractnouns\tἐπίγνωσιν ἀληθείας\t1\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n'
      const expectedLines = getLineCount(tsv);

      // when
      const results = convertTsv9to7(tsv);

      //then
      expect(results.tsv).toBeTruthy();
      const resultsLines = getLineCount(results.tsv);
      expect(resultsLines).toEqual(expectedLines);
      expect(results.errors).toMatchSnapshot();
    });

    it(`should catch invalid first char in ID`, () => {
      // given
      const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
        'TIT\t1\t1\t0xyz\tfigs-abstractnouns\tἐπίγνωσιν ἀληθείας\t1\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n'
      const expectedLines = getLineCount(tsv);

      // when
      const results = convertTsv9to7(tsv);

      //then
      expect(results.tsv).toBeTruthy();
      const resultsLines = getLineCount(results.tsv);
      expect(resultsLines).toEqual(expectedLines);
      expect(results.errors).toMatchSnapshot();
    });
  });

  describe('OrigQuote tests', function () {
    it(`should correct spaces in OrigQuote`, () => {
      // given
      const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
        'TIT\t1\t1\twxyz\tfigs-abstractnouns\t\u00A0ἐπίγ\u200Bνωσιν\u00A0ἀληθείας\u200B\t1\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n';
      const expected_tsv = 'Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote\n' +
        '1:1\twxyz\t\trc://*/ta/man/translate/figs-abstractnouns\tἐπίγνωσιν ἀληθείας\t1\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://*/ta/man/translate/figs-abstractnouns]])\n';

      // when
      const results = convertTsv9to7(tsv);

      //then
      expect(results.tsv).toEqual(expected_tsv);
      expect(results.errors).toMatchSnapshot();
    });

    it(`should replace ellipsis with &`, () => {
      // given
      const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
        'TIT\t1\t1\twxyz\tfigs-abstractnouns\t ἐπί\u2026 γνω \u2026σιν\u2026ἀλη \u2026 θείας \t1\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n';
      const expected_tsv = 'Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote\n' +
        '1:1\twxyz\t\trc://*/ta/man/translate/figs-abstractnouns\tἐπί & γνω & σιν & ἀλη & θείας\t1\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://*/ta/man/translate/figs-abstractnouns]])\n';

      // when
      const results = convertTsv9to7(tsv);

      //then
      expect(results.tsv).toEqual(expected_tsv);
      expect(results.errors).toMatchSnapshot();
    });

    it(`should replace ... with &`, () => {
      // given
      const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
        'TIT\t1\t1\twxyz\tfigs-abstractnouns\tἐπίγνωσιν...ἀληθείας\t1\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n';
      const expected_tsv = 'Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote\n' +
        '1:1\twxyz\t\trc://*/ta/man/translate/figs-abstractnouns\tἐπίγνωσιν & ἀληθείας\t1\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://*/ta/man/translate/figs-abstractnouns]])\n';

      // when
      const results = convertTsv9to7(tsv);

      //then
      expect(results.tsv).toEqual(expected_tsv);
      expect(results.errors).toMatchSnapshot();
    });
  });

  it(`should warn on not zero occurrence but don't have original quote`, () => {
    // given
    const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
      'TIT\t1\t1\twxyz\tfigs-abstractnouns\t\t1\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n';
    const expected_tsv = 'Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote\n' +
      '1:1\twxyz\t\trc://*/ta/man/translate/figs-abstractnouns\t\t0\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://*/ta/man/translate/figs-abstractnouns]])\n';

    // when
    const results = convertTsv9to7(tsv);

    //then
    expect(results.tsv).toEqual(expected_tsv);
    expect(results.errors).toMatchSnapshot();
  });

  it(`should warn on zero occurrence but have original quote`, () => {
    // given
    const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
      'TIT\t1\t1\twxyz\tfigs-abstractnouns\tἐπίγνωσιν ἀληθείας\t0\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n';
    const expected_tsv = 'Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote\n' +
      '1:1\twxyz\t\trc://*/ta/man/translate/figs-abstractnouns\tἐπίγνωσιν ἀληθείας\t0\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://*/ta/man/translate/figs-abstractnouns]])\n';

    // when
    const results = convertTsv9to7(tsv);

    //then
    expect(results.tsv).toEqual(expected_tsv);
    expect(results.errors).toMatchSnapshot();
  });

  it(`empty support ref`, () => {
    // given
    const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
      'TIT\t1\t1\twxyz\t\tἐπίγνωσιν ἀληθείας\t0\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n';
    const expected_tsv = 'Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote\n' +
      '1:1\twxyz\t\t\tἐπίγνωσιν ἀληθείας\t0\t**knowledge** and **truth** are abstract nouns. See the UST for other ways to express these. Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://*/ta/man/translate/figs-abstractnouns]])\n';

    // when
    const results = convertTsv9to7(tsv);

    //then
    expect(results.tsv).toEqual(expected_tsv);
    expect(results.errors).toMatchSnapshot();
  });

  describe('Test OrigQuote', function () {
    it(`replace html break`, () => {
      // given
      const tsv = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
        'TIT\t1\t1\twxyz\tfigs-abstractnouns\tἐπίγνωσιν ἀληθείας\t-1\tknowledge of the truth\t**knowledge** and **truth** are abstract nouns.<BR>See the UST for other ways to express these.<br>Paul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://en/ta/man/translate/figs-abstractnouns]])\n';
      const expected_tsv = 'Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote\n' +
        '1:1\twxyz\t\trc://*/ta/man/translate/figs-abstractnouns\tἐπίγνωσιν ἀληθείας\t-1\t**knowledge** and **truth** are abstract nouns.\\nSee the UST for other ways to express these.\\nPaul wants people to know the true message about God and Christ so that they can live in a way that pleases God. (See: [[rc://*/ta/man/translate/figs-abstractnouns]])\n';

      // when
      const results = convertTsv9to7(tsv);

      //then
      expect(results.tsv).toEqual(expected_tsv);
      expect(results.errors).toMatchSnapshot();
    });
  });
});

// Helpers

function getLineCount(tsv) {
  const lines = tsv.split('\n');
  let numLines = lines.length;

  if (!lines[numLines - 1]) {
    numLines--;
  }
  return numLines;
}

