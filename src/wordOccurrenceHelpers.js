import stringTokenizer from 'string-punctuation-tokenizer'
// constants
const ELLIPSES = '\u2026'
const THREE_DOTS = '...'

function countStringInArray(array, string) {
  return array.filter(item => item == string).length;
}

function substrOccurrencesInQuote(quote, substr, substrIndex) {
  const quoteSubstrings = stringTokenizer.tokenizeWithPunctuation(quote)
  const leftSubstrs = quoteSubstrings.slice(0, substrIndex)
  return countStringInArray(leftSubstrs, substr)
}

export function getQuoteOmittedString(quote, verseString) {
  quote = quote.replace(/\.../g, '\u2026')
  const quoteChunks = quote.split(ELLIPSES)
  let missingWordsIndices = [];

  quoteChunks.forEach((quoteChunk, index) => {
    let quoteChunkSubStrIndex

    // Get quote chunk closer to next quote chunk
    if (index < (quoteChunks.length - 1)) {
      console.log('1- index < (quoteChunks.length - 1)')
      const nextQuoteChunk = quoteChunks[index + 1]
      const nextChunkIndex = verseString.indexOf(nextQuoteChunk)
      console.log('nextQuoteChunk', nextQuoteChunk, 'nextChunkIndex', nextChunkIndex)
      if (nextChunkIndex) {
        const strBeforeNextQuote = verseString.substring(0, nextChunkIndex)
        quoteChunkSubStrIndex = strBeforeNextQuote.lastIndexOf(quoteChunk)
      }
      console.log('quoteChunkSubStrIndex', quoteChunkSubStrIndex)
      missingWordsIndices.push(quoteChunkSubStrIndex + (index === 0 ? quoteChunk.length : 0))
    } else if (index === (quoteChunks.length - 1) && quoteChunks.length >= 3) {// if is last quote chunk
      console.log('2- last chunk')
      const lastMissingWordEndingIndex = verseString.indexOf(quoteChunk);
      const sliced = verseString.slice(lastMissingWordEndingIndex)
      const stringPrecedingLastChunk = verseString.replace(sliced, '')
      const previousQuoteChunk = quoteChunks[index - 1]
      const startIndex = stringPrecedingLastChunk.lastIndexOf(previousQuoteChunk) + previousQuoteChunk.length

      missingWordsIndices.push(startIndex + (index === 0 ? quoteChunk.length : 0))
      const endIndex = verseString.indexOf(quoteChunk);
      missingWordsIndices.push(endIndex + (index === 0 ? quoteChunk.length : 0))
    } else {
      console.log('3- else')
      quoteChunkSubStrIndex = verseString.indexOf(quoteChunk);
      missingWordsIndices.push(quoteChunkSubStrIndex + (index === 0 ? quoteChunk.length : 0))
    }
  })

  console.log('missingWordsIndices', missingWordsIndices)

  const missingStrings = []
  missingWordsIndices.forEach((startIndex, i) => {
    if (!((i + 1) % 2 == 0)) { // if index is odd number
      const endIndex = missingWordsIndices[i + 1]
      const missingString = verseString.slice(startIndex, endIndex)
      missingStrings.push(missingString)
    }
  });

  // console.log('missingStrings', missingStrings)

  let wholeQuote = '';

  quoteChunks.forEach((chunk, index) => {
    const missingWord = missingStrings[index] || ''
    wholeQuote = wholeQuote + chunk + missingWord
  });

  console.log('====================================');
  console.log('wholeQuote', wholeQuote);
  console.log('====================================');

  return wholeQuote;
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
    cleanedQuote = quote.replace(/\.../g, '\u2026')
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
