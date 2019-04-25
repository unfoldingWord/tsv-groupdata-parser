import stringTokenizer from 'string-punctuation-tokenizer'

function countStringInArray(array, string) {
  return array.filter(item => item == string).length;
}

/**
 * search for previous occurrences of word to get occurrence
 * for this instance
 * @param {string} verseString - The string to search in.
 * @param {string} substr - The sub string to search for.
 * @param {string} quote - the orig language quote.
 * @param {number} substrIndex - substring index number.
 */
function getWordOccurrence(verseString, substr, quote, substrIndex) {
  if (!verseString.includes(quote)) {

  }
  const quoteSubStrIndex = verseString.indexOf(quote);
  const previousStr = verseString.substring(0, quoteSubStrIndex);
  // let previousOccurrences = previousStr.split(new RegExp(substr, 'gi')).length - 1
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
  if ((quote.split(new RegExp(substr, 'gi')).length - 1) > 1) {
    const quoteSubstrings = stringTokenizer.tokenizeWithPunctuation(quote)
    const leftSubstrs = quoteSubstrings.slice(0, substrIndex)
    let previousSubstrOccurrences = countStringInArray(leftSubstrs, substr)
    occurrence = ++previousSubstrOccurrences
  }

  return occurrence
}


export function getWordOccurrencesForQuote(quote, verseString) {
  let words = []
  const substrings = stringTokenizer.tokenizeWithPunctuation(quote)

  substrings.forEach((substring, index) => {
    const word = {
      word: substring,
      occurrence: getWordOccurrence(verseString, substring, quote, index),
    }

    words.push(word)
  });

  return words
}
