import path from 'path-extra';
import fs from 'fs-extra';
// helpers
import {tsvToGroupData, tsvToGroupData7Cols} from '../src/tsvToGroupData';

// constants
const RESOURCES_PATH = path.join(__dirname, 'fixtures', 'resources');
const ORIGINAL_BIBLE_PATH_V0_11 = path.join(RESOURCES_PATH, 'el-x-koine', 'bibles', 'ugnt', 'v0.11');
const TSV_PATH_TIT = path.join(RESOURCES_PATH, '__tests__/fixtures/tsv/en_tn_57-TIT.tsv');
const RESOURCES_COPY_PATH = path.join(RESOURCES_PATH);

const TSV9_TEMPLATE = 'Book\tChapter\tVerse\tID\tSupportReference\tOrigQuote\tOccurrence\tGLQuote\tOccurrenceNote\n' +
  '{Book}\t{Chapter}\t{Verse}\t{ID}\t{SupportReference}\t{OrigQuote}\t{Occurrence}\t{GLQuote}\t{OccurrenceNote}\n';
const TSV9_TEST_DATA_DEFAULTS_TIT = {
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

const TIT_TEST = {
  ORIGINAL_BIBLE_PATH: ORIGINAL_BIBLE_PATH_V0_11,
  TSV_PATH: TSV_PATH_TIT,
  TSV_TEMPLATE: TSV9_TEMPLATE,
  TSV_TEST_DATA_DEFAULTS: TSV9_TEST_DATA_DEFAULTS_TIT,
};

// originalVerse tit 1:15 = 'πάντα καθαρὰ τοῖς καθαροῖς; τοῖς δὲ μεμιαμμένοις καὶ ἀπίστοις, οὐδὲν καθαρόν; ἀλλὰ μεμίανται αὐτῶν καὶ ὁ νοῦς, καὶ ἡ συνείδησις. \n';


const ORIGINAL_BIBLE_PATH_V0_30 = path.join(RESOURCES_PATH, 'el-x-koine', 'bibles', 'ugnt', 'v0.30_Door43-Catalog');
const TSV_PATH_PHP = path.join(RESOURCES_PATH, '__tests__/fixtures/tsv/en_tn_PHP-verse-range.tsv');

// php 1:1-2;2:5 =
// "Παῦλος καὶ Τιμόθεος, δοῦλοι Χριστοῦ Ἰησοῦ; πᾶσιν τοῖς ἁγίοις ἐν Χριστῷ Ἰησοῦ τοῖς οὖσιν ἐν Φιλίπποις, σὺν ἐπισκόποις καὶ διακόνοις: \n" +
// " χάρις ὑμῖν καὶ εἰρήνη ἀπὸ Θεοῦ Πατρὸς ἡμῶν καὶ Κυρίου Ἰησοῦ Χριστοῦ. \n" +
// " τοῦτο φρονεῖτε ἐν ὑμῖν, ὃ καὶ ἐν Χριστῷ Ἰησοῦ; "

const TSV7_TEMPLATE = 'Reference\tID\tTags\tSupportReference\tQuote\tOccurrence\tNote\n' +
  '{Reference}\t{ID}\t{Tags}\t{SupportReference}\t{OrigQuote}\t{Occurrence}\t{Note}\n';
const TSV7_TEST_DATA_DEFAULTS_PHP = {
  'Reference': '1:1-2,2:5',
  'ID': 'ezsy',
  'Tags': '',
  'SupportReference': 'rc://*/ta/man/translate/figs-abstractnouns',
  'OrigQuote': 'καὶ & ἐν',
  'Occurrence': '-1',
  'Note': ' Testing Highlighting',
};

const PHP_TEST = {
  ORIGINAL_BIBLE_PATH: ORIGINAL_BIBLE_PATH_V0_30,
  TSV_PATH: TSV_PATH_PHP,
  TSV_TEMPLATE: TSV7_TEMPLATE,
  TSV_TEST_DATA_DEFAULTS: TSV7_TEST_DATA_DEFAULTS_PHP,
  isTSV7: true,
  bookId: 'PHP',
  languageId: 'en',
};

const tests = [
  { name: 'simple ampersand with verse range 4', data: { Reference: '1:1-2,2:5', OrigQuote: 'ἡμῶν & Χριστοῦ' }, config: PHP_TEST, expect: 'quote' },
  { name: 'simple ampersand with verse range 3', data: { Reference: '1:1-2,2:5', OrigQuote: 'Χριστῷ & Ἰησοῦ' }, config: PHP_TEST, expect: 'quote' },
  { name: 'simple ampersand with verse range 2', data: { Reference: '1:1-2,2:5', OrigQuote: 'δοῦλοι & Ἰησοῦ' }, config: PHP_TEST, expect: 'quote' },
  { name: 'simple ampersand with verse range', data: { Reference: '1:1-2,2:5', OrigQuote: 'καὶ & ἐν' }, config: PHP_TEST, expect: 'quote' },
  { name: 'simple ampersand 3', data: { Reference: '1:1', OrigQuote: 'καὶ & ἐν' }, config: PHP_TEST, expect: 'quote' },
  { name: 'simple ampersand', data: { OrigQuote: 'καθαροῖς & τοῖς' }, config: TIT_TEST, expect: 'quote' },
  { name: 'simple ampersand 2', data: { OrigQuote: 'τοῖς & καὶ' }, config: TIT_TEST, expect: 'quote' },
  { name: 'all occurrences', data: { OrigQuote: 'καὶ', Occurrence: '-1' }, config: TIT_TEST, expect: 'quote' },
  { name: 'multiple ellipsis and phrases', data: { OrigQuote: 'τοῖς καθαροῖς…καὶ ἀπίστοις…τοῖς καθαροῖς…καὶ ἀπίστοις' }, config: TIT_TEST, expect: 'quote' },
  { name: 'multiple ellipsis', data: { OrigQuote: 'τοῖς…καὶ…τοῖς…καὶ' }, config: TIT_TEST, expect: 'quote' },
  { name: 'multiple ellipsis 2', data: { OrigQuote: 'τοῖς…καὶ…τοῖς…καὶ…τοῖς…καὶ' }, config: TIT_TEST, expect: 'quote' },
  { name: 'multiple ellipsis 3', data: { OrigQuote: 'τοῖς…καὶ…τοῖς…καὶ…τοῖς…καὶ…τοῖς…καὶ' }, config: TIT_TEST, expect: 'quote' },
  { name: 'simple ellipsis', data: { OrigQuote: 'τοῖς…καὶ' }, config: TIT_TEST, expect: 'quote' },
  { name: 'second occurrence', data: { OrigQuote: 'καὶ', Occurrence: '2' }, config: TIT_TEST, expect: 'quote' },
  { name: 'fifth occurrence', data: { OrigQuote: 'καὶ', Occurrence: '5' }, config: TIT_TEST, expect: 'quote' },
];

describe('tsvToGroupData() - testing quotes', () => {
  beforeEach(() => {
    fs.__resetMockFS();
    fs.__loadDirIntoMockFs(RESOURCES_COPY_PATH, RESOURCES_COPY_PATH);
  });

  for (const test_ of tests) {
    test(`Test ${test_.name}`, async () => {
      const filepath = test_.config.TSV_PATH;
      const newData = generateTestTsv(filepath, test_);
      const toolName = 'translationNotes';
      let result, supportReference;

      if (test_.config.isTSV7) {
        const params = { categorized: false };
        result = await tsvToGroupData7Cols(filepath, test_.config.bookId, RESOURCES_PATH, test_.config.languageId, toolName, test_.config.ORIGINAL_BIBLE_PATH, params);
        supportReference = newData.SupportReference.split('/')[6];
      } else {
        result = await tsvToGroupData(filepath, toolName, null, test_.config.ORIGINAL_BIBLE_PATH, RESOURCES_PATH, 'en');
        supportReference = newData.SupportReference;
      }

      const category = result[supportReference];
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
 * @param {object} testConfig - test configuration to use
 */
function generateTestTsv(tsvPath, testConfig) {
  const newData = {
    ...testConfig.config.TSV_TEST_DATA_DEFAULTS,
    ...testConfig.data,
  };
  let tsvContents = testConfig.config.TSV_TEMPLATE;

  for (const key of Object.keys(newData)) {
    const stringToReplace = '{' + key + '}';
    tsvContents = tsvContents.replaceAll(stringToReplace, newData[key]);
  }
  fs.writeFileSync(tsvPath, tsvContents, 'utf8');
  // const verify = fs.readFileSync(tsvPath, 'utf8');
  // console.log(verify);
  return newData;
}
