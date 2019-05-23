import stringTokenizer from 'string-punctuation-tokenizer'
import { ELLIPSES, THREE_DOTS } from '../utils/constants'
import { getQuoteOmittedString } from './ellipsisHelpers'

function countStringInArray(array, string) {
  return array.filter(item => item == string).length;
}

function substrOccurrencesInQuote(quote, substr, substrIndex) {
  const quoteSubstrings = stringTokenizer.tokenizeWithPunctuation(quote)
  const leftSubstrs = quoteSubstrings.slice(0, substrIndex)
  return countStringInArray(leftSubstrs, substr)
}

/**
 * search for previous occurrences of word to get occurrence
 * for this instance
 * @param {string} verseString - The string to search in.
 * @param {string} substr - The sub string to search for.
 * @param {string} quote - the orig language quote.
 * @param {number} substrIndex - substring index number.
 * @param {string} quoteOmittedString - string omitted by ellipses
 */
function getWordOccurrence(verseString, substr, quote, substrIndex, quoteOmittedString) {
  const quoteWithOmittedString = quote.includes(ELLIPSES) ?
    quote.replace(ELLIPSES, quoteOmittedString) : quote
  const quoteSubStrIndex = verseString.indexOf(quoteWithOmittedString);
  const previousStr = verseString.substring(0, quoteSubStrIndex);
  const previousStrs = stringTokenizer.tokenizeWithPunctuation(previousStr)
  let previousOccurrences = 0;

  for (let i = 0; i <= quoteSubStrIndex; i++) {
    const stringItem = previousStrs[i];
    if (stringItem === substr) {
      previousOccurrences++;
    }
  }

  let occurrence = ++previousOccurrences

  // if substr is found in quote more than once
  if ((quoteWithOmittedString.split(new RegExp(substr, 'gi')).length - 1) > 1) {
    if (quote.includes(ELLIPSES)) {
      quote = quote.replace(/\.../g, '')
    }
    let previousSubstrOccurrences = substrOccurrencesInQuote(quote, substr, substrIndex)
    occurrence = ++previousSubstrOccurrences
  }

  return occurrence
}

export function getWordOccurrencesForQuote(quote, verseString) {
  let words = [],
      quoteOmittedString = '',
      cleanedQuote = quote

  if (quote.includes(THREE_DOTS)) {
    cleanedQuote = quote.replace(/\.../g, ELLIPSES)
    quoteOmittedString = getQuoteOmittedString(quote, verseString)
  }

  const substrings = stringTokenizer.tokenizeWithPunctuation(cleanedQuote)

  substrings.forEach((substring, index) => {
    const word = {
      word: substring,
      occurrence: getWordOccurrence(verseString, substring, cleanedQuote, index, quoteOmittedString),
    }

    words.push(word)
  });

  return words
}
