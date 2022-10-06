import fs from 'fs-extra';
import path from 'path-extra';
// helpers
import { convertTsv9to7 } from '../src/tsvConversion';

jest.unmock('fs-extra');

// constants
const TSV_PATH = path.join(__dirname, 'fixtures/tsv');

describe('Tests convertTsv9to7', function () {
  const fileNames = ['en_tn_57-TIT.tsv'];

  for (const fileName of fileNames) {
    it(`${fileName} should pass`, () => {
      // given
      const tsvPath = path.join(TSV_PATH, fileName);
      const tsv = fs.readFileSync(tsvPath, 'utf8');

      // when
      const results = convertTsv9to7(tsv);

      //then
      expect(Array.isArray(results.tsvObjects)).toBeTruthy();
      expect(results.errors).toBeTruthy();
    });
  }
});
