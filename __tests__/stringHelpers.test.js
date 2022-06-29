import { cleanQuoteString } from '../src/helpers/stringHelpers';

describe('tests cleanQuoteString()', () => {
  test('tests should pass ellipsis and break (&) tests', () => {
    const checks = [
      {
        before: ' & ',
        after:  ' … ',
      },
      {
        before: '& ',
        after:  '&',
      },
      {
        before: ' &',
        after:  '&',
      },
      {
        before: 'this & that',
        after:  'this … that',
      },
      {
        before: 'this ... that',
        after:  'this … that',
      },
      {
        before: 'this … that',
        after:  'this … that',
      },
    ];

    checks.forEach(({ before, after }) => {
      const cleaned = cleanQuoteString(before);
      expect(cleaned).toEqual(after);
    });
  });
});
