import path from 'path-extra';
// helpers
import {
  tsvToGroupData, cleanGroupId, cleanOccurrenceNoteLinks,
} from '../src/tsvToGroupData';
jest.unmock('fs-extra');
// constants
const RESOURCES_PATH = path.join(__dirname, 'fixtures', 'resources');
const ORIGINAL_BIBLE_PATH = path.join(RESOURCES_PATH, 'el-x-koine', 'bibles', 'ugnt', 'v0.11');

describe('tsvToGroupData():', () => {
  test('Parses a book tN TSVs to an object with a lists of group ids', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv';
    const result = await tsvToGroupData(filepath, 'translationNotes', null, ORIGINAL_BIBLE_PATH, RESOURCES_PATH, 'en');
    expect(result).toMatchSnapshot();
  });

  test('It returns the categorized group data if the param categorized is true { categorized: true }', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv';
    const result = await tsvToGroupData(filepath, 'translationNotes', { categorized: true }, ORIGINAL_BIBLE_PATH, RESOURCES_PATH, 'en');
    expect(result).toMatchSnapshot();
  });

  test('It returns the uncategorized group data if the param categorized is false { categorized: false }', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv';
    const result = await tsvToGroupData(filepath, 'translationNotes', { categorized: false }, ORIGINAL_BIBLE_PATH, RESOURCES_PATH, 'en');
    expect(result).toMatchSnapshot();
  });

  test('It returns the categorized group data for MRK.tsv', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_42-MRK.tsv';
    const result = await tsvToGroupData(filepath, 'translationNotes', { categorized: true }, ORIGINAL_BIBLE_PATH, RESOURCES_PATH, 'en');
    expect(result).toMatchSnapshot();
  });

  test('It returns the categorized group data for MAT.tsv', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_41-MAT.tsv';
    const result = await tsvToGroupData(filepath, 'translationNotes', { categorized: true }, ORIGINAL_BIBLE_PATH, RESOURCES_PATH, 'en');
    expect(result).toMatchSnapshot();
  });

  test('It returns the categorized group data for Hindi TIT.tsv', async () => {
    const filepath = '__tests__/fixtures/tsv/hi_tn_57-TIT.tsv';
    const result = await tsvToGroupData(filepath, 'translationNotes', { categorized: true }, ORIGINAL_BIBLE_PATH, RESOURCES_PATH, 'hi');
    expect(result).toMatchSnapshot();
  });

  test('It returns the categorized group data for RUT.tsv', async () => {
    const ORIGINAL_BIBLE_PATH = path.join(RESOURCES_PATH, 'hbo', 'bibles', 'uhb', 'v2.1.12');
    const filepath = '__tests__/fixtures/tsv/en_tn_08-RUT.tsv';
    const result = await tsvToGroupData(filepath, 'translationNotes', { categorized: true }, ORIGINAL_BIBLE_PATH, RESOURCES_PATH, 'hi');
    expect(result).toMatchSnapshot();
  });

  test('It should not crash on missing occurrence notes', async () => {
    const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT-missing-occurrence-note.tsv';
    const result = await tsvToGroupData(filepath, 'translationNotes', null, ORIGINAL_BIBLE_PATH, RESOURCES_PATH, 'en');
    expect(result).toMatchSnapshot();
  });
});

describe('cleanGroupId()', () => {
  test('it cleans groupId bad links coming from the tsv SupportReference.', () => {
    const testItems = {
      'writing-background': 'writing-background',
      'writing_background': 'writing-background',
      'translate_textvariants': 'translate-textvariants',
      'translate:writing_background': 'writing-background',
      'translate/translate_textvariants': 'translate-textvariants',
      'translate:translate_textvariants': 'translate-textvariants',
      'translate:translate_versebridge': 'translate-versebridge',
      'translate:translate-symaction': 'translate-symaction',
      'figs-explicit<br><br><br>': 'figs-explicit',
      ' figs-explicit ': 'figs-explicit',
    };

    Object.keys(testItems).forEach(badGroupId => {
      const cleaned = cleanGroupId(badGroupId);
      expect(cleaned).toBe(testItems[badGroupId]);
    });
  });
});

describe('cleanOccurrenceNoteLinks()', () => {
  test('fixes occurrenceNote links', () => {
    const testItems = {
      '[[rc://en/ta/man/translate/writing-background]]': '[Background Information](rc://en/ta/man/translate/writing-background)',
      '[[rc://en/ta/man/translate/writing_background]]': '[Background Information](rc://en/ta/man/translate/writing-background)',
      '[[rc://en/ta/man/translate:writing_background]]': '[Background Information](rc://en/ta/man/translate/writing-background)',
      '[[rc://en/ta/man/translate/translate_textvariants]]': '[Textual Variants](rc://en/ta/man/translate/translate-textvariants)',
      '[[rc://en/ta/man/translate:translate_textvariants]]': '[Textual Variants](rc://en/ta/man/translate/translate-textvariants)',
      '[[rc://en/ta/man:translate:translate_versebridge]]': '[Verse Bridges](rc://en/ta/man/translate/translate-versebridge)',
      '[[rc://en/ta/man/translate:translate-symaction]]': '[Symbolic Action](rc://en/ta/man/translate/translate-symaction)',
      '(See: [[rc://en/ta/man/translate/figs-activepassive]] ) and [[rc://en/ta/man/translate/figs-idiom]])': '(See: [Active or Passive](rc://en/ta/man/translate/figs-activepassive) and [Idiom](rc://en/ta/man/translate/figs-idiom))',
    };

    Object.keys(testItems).forEach(badLink => {
      const goodLink = testItems[badLink];
      const withBrokenLink = `This verse is background information for the description of the events that follow. (See: ${badLink})`;
      const expectedCleanedNotes = `This verse is background information for the description of the events that follow. (See: ${goodLink})`;
      const cleanedNotes = cleanOccurrenceNoteLinks(withBrokenLink, RESOURCES_PATH, 'en', 'tit', '1');
      expect(cleanedNotes).toBe(expectedCleanedNotes);
    });
  });

  test('tests various tN occurrenceNotes', () => {
    const testItems = [
      {
        lang: 'en',
        bookId: 'mat',
        occurrenceNotes: 'Supported scripture (See: [John 2:17](../../jhn/02/17.md))',
        expectedCleanNotes: 'Supported scripture (See: [John 2:17](rc://en/ult/book/jhn/02/17))',
      },
      {
        lang: 'en',
        occurrenceNotes: 'A person who cannot control themselves and drinks too much wine (See: [[rc://en/ta/man/translate/figs-metaphor]] and [[rc://en/ta/man/translate/figs-activepassive]])',
        expectedCleanNotes: 'A person who cannot control themselves and drinks too much wine (See: [Metaphor](rc://en/ta/man/translate/figs-metaphor) and [Active or Passive](rc://en/ta/man/translate/figs-activepassive))',
      },
      {
        lang: 'en',
        occurrenceNotes: '"Word" here is a metonym for "message," which in turn is a metonym for God himself. (See: [[rc://en/ta/man/translate/figs-activepassive]] and [[rc://en/ta/man/translate/figs-metonymy]])',
        expectedCleanNotes: '"Word" here is a metonym for "message," which in turn is a metonym for God himself. (See: [Active or Passive](rc://en/ta/man/translate/figs-activepassive) and [Metonymy](rc://en/ta/man/translate/figs-metonymy))',
      },
      {
        lang: 'en',
        occurrenceNotes: 'Passion and pleasure are spoken of as if they were masters over people and had made those people into slaves by lying to them. (See: [[rc://en/ta/man/translate/figs-personification]] and [[rc://en/ta/man/translate/figs-activepassive]])',
        expectedCleanNotes: 'Passion and pleasure are spoken of as if they were masters over people and had made those people into slaves by lying to them. (See: [Personification](rc://en/ta/man/translate/figs-personification) and [Active or Passive](rc://en/ta/man/translate/figs-activepassive))',
      },
      {
        lang: 'en',
        bookId: 'rev',
        chapter: 22,
        occurrenceNotes: 'Here "words" refers to the message that they formed. See how you translated this in [Revelation 22:7](./07.md). Alternate translation: "This prophetic message of this book" (See: [[rc://en/ta/man/translate/figs-metonymy]])',
        expectedCleanNotes: 'Here "words" refers to the message that they formed. See how you translated this in [Revelation 22:7](rc://en/ult/book/rev/22/07). Alternate translation: "This prophetic message of this book" (See: [Metonymy](rc://en/ta/man/translate/figs-metonymy))',
      },
      {
        lang: 'en',
        bookId: 'rev',
        chapter: '1',
        occurrenceNotes: 'This will result in God\'s ultimate and final victory over sin and evil. [Revelation 1:2](./01.md) (See: [[rc://en/tw/dict/bible/kt/sin]] and [[rc://en/tw/dict/bible/kt/evil]] and [[rc://en/tw/dict/bible/kt/eternity]])',
        expectedCleanNotes: 'This will result in God\'s ultimate and final victory over sin and evil. [Revelation 1:2](rc://en/ult/book/rev/01/01) (See: [sin, sinful, sinner, sinning](rc://en/tw/dict/bible/kt/sin) and [evil, wicked, wickedness, wickedly](rc://en/tw/dict/bible/kt/evil) and [eternity, everlasting, eternal, forever](rc://en/tw/dict/bible/kt/eternity))',
      },
      {
        lang: 'hi',
        bookId: '1jn',
        occurrenceNotes: 'का अगुवा था। उसने इस अभिव्यक्ति का प्रयोग उनको अपना प्रेम दिखाने के लिए किया। देखें आपने किस प्रकार इसका [1 यूहन्ना 2:1](../02/01.md) में अनुवाद किया। वैकल्पिक अनुवाद: “मसीह में मेरे प्रिय बच्चों” और “तुम जो मेरे लिए मेरे अपने बच्चों के सामान प्रिय हो” (देखें: [[rc://hi/ta/man/translate/figs-metaphor]] )',
        expectedCleanNotes: 'का अगुवा था। उसने इस अभिव्यक्ति का प्रयोग उनको अपना प्रेम दिखाने के लिए किया। देखें आपने किस प्रकार इसका [1 यूहन्ना 2:1](rc://hi/irv/book/1jn/02/01) में अनुवाद किया। वैकल्पिक अनुवाद: “मसीह में मेरे प्रिय बच्चों” और “तुम जो मेरे लिए मेरे अपने बच्चों के सामान प्रिय हो” (देखें: [रूपक](rc://hi/ta/man/translate/figs-metaphor))',
      },
    ];

    testItems.forEach(testItem => {
      const cleanedOccurrenceNote = cleanOccurrenceNoteLinks(testItem.occurrenceNotes, RESOURCES_PATH, testItem.lang, testItem.bookId, testItem.chapter);
      expect(cleanedOccurrenceNote).toBe(testItem.expectedCleanNotes);
    });
  });
});
