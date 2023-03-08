import path from 'path-extra';
import fs from 'fs-extra';
// helpers
import { tsvToGroupData } from '../src/tsvToGroupData';

// constants
const RESOURCES_PATH = path.join(__dirname, 'fixtures', 'resources');
const ORIGINAL_BIBLE_PATH = path.join(RESOURCES_PATH, 'el-x-koine', 'bibles', 'ugnt', 'v0.11');
const TSV_PATH = path.join(RESOURCES_PATH, '__tests__/fixtures/tsv/en_tn_57-TIT.tsv');
const RESOURCES_COPY_PATH = path.join(RESOURCES_PATH);

const TSV9_TEMPLATE = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
  '{Book}\t{Chapter}\t{Verse}\t{ID}\t{SupportReference}\t{OrigQuote}\t{Occurrence}\t{GLQuote}\t{OccurrenceNote}\n';
const TSV_TEST_DATA_DEFAULTS = {
  'Book': 'TIT',
  'Chapter': '1',
  'Verse': '15',
  'ID': 'n3wk',
  'SupportReference': 'figs-metaphor',
  'OrigQuote': 'τοῖς…μεμιαμμένοις καὶ ἀπίστοις, οὐδὲν καθαρόν',
  'Occurrence': '1',
  'GLQuote': 'to those who are corrupt and unbelieving, nothing is pure',
  'OccurrenceNote': 'Paul speaks of sinners as if they were physically dirty. Alternate translation: “if people are morally defiled and do not believe, they cannot do anything pure” or “when people are full of sin and unbelief, nothing that they do is acceptable to God” (See: [Metaphor](rc://en/ta/man/translate/figs-metaphor))',
};

const tests = [
  { name: 'all occurrences', data: { OrigQuote: 'καὶ', Occurrence: '-1' }, expect: 'quote' },
  { name: 'multiple ellipsis and phrases', data: { OrigQuote: 'τοῖς καθαροῖς…καὶ ἀπίστοις…τοῖς καθαροῖς…καὶ ἀπίστοις' }, expect: 'quote' },
  { name: 'multiple ellipsis', data: { OrigQuote: 'τοῖς…καὶ…τοῖς…καὶ' }, expect: 'quote' },
  { name: 'multiple ellipsis 2', data: { OrigQuote: 'τοῖς…καὶ…τοῖς…καὶ…τοῖς…καὶ' }, expect: 'quote' },
  { name: 'multiple ellipsis 3', data: { OrigQuote: 'τοῖς…καὶ…τοῖς…καὶ…τοῖς…καὶ…τοῖς…καὶ' }, expect: 'quote' },
  { name: 'simple ellipsis', data: { OrigQuote: 'τοῖς…καὶ' }, expect: 'quote' },
  { name: 'second occurrence', data: { OrigQuote: 'καὶ', Occurrence: '2' }, expect: 'quote' },
  { name: 'fifth occurrence', data: { OrigQuote: 'καὶ', Occurrence: '5' }, expect: 'quote' },
];

// originalVerse = 'πάντα καθαρὰ τοῖς καθαροῖς; τοῖς δὲ μεμιαμμένοις καὶ ἀπίστοις, οὐδὲν καθαρόν; ἀλλὰ μεμίανται αὐτῶν καὶ ὁ νοῦς, καὶ ἡ συνείδησις. \n';

describe('tsvToGroupData() - testing quotes', () => {
  beforeEach(() => {
    fs.__resetMockFS();
    fs.__loadDirIntoMockFs(RESOURCES_COPY_PATH, RESOURCES_COPY_PATH);
  });

  for (const test_ of tests) {
    test(`Test ${test_.name}`, async () => {
      const filepath = TSV_PATH;
      const newData = generateTestTsv(filepath, test_.data);
      const result = await tsvToGroupData(filepath, 'translationNotes', null, ORIGINAL_BIBLE_PATH, RESOURCES_PATH, 'en');
      const category = result[newData.SupportReference];
      const check = category[0];
      const contextId = check.contextId;
      const testValue = contextId[test_.expect];
      expect(testValue).toMatchSnapshot();
    });
  }
});

/**
 * creates a TSV file using defaults
 * @param {string} tsvPath - path for file
 * @param {object} testData - definitions to use to override default values
 */
function generateTestTsv(tsvPath, testData) {
  const newData = {
    ...TSV_TEST_DATA_DEFAULTS,
    ...testData,
  };
  let tsvContents = TSV9_TEMPLATE;

  for (const key of Object.keys(newData)) {
    const stringToReplace = '{' + key + '}';
    tsvContents = tsvContents.replaceAll(stringToReplace, newData[key]);
  }
  fs.writeFileSync(tsvPath, tsvContents, 'utf8');
  // const verify = fs.readFileSync(tsvPath, 'utf8');
  // console.log(verify);
  return newData;
}
