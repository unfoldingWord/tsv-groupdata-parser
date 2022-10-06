import fs from 'fs-extra';
import path from 'path-extra';
// helpers
import { convertTsv9to7 } from '../src/tsvConversion';

jest.unmock('fs-extra');

// constants
const TSV_PATH = path.join(__dirname, 'fixtures/tsv');

describe('Tests convertTsv9to7', function () {
  const fileNames = ['en_tn_08-RUT.tsv', 'en_tn_41-MAT.tsv', 'en_tn_42-MRK.tsv', 'en_tn_57-TIT.tsv', 'hi_tn_57-TIT.tsv'];

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

