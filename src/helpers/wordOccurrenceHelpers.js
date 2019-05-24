/* eslint-disable no-param-reassign */
import stringTokenizer from 'string-punctuation-tokenizer'
import { ELLIPSIS, THREE_DOTS } from '../utils/constants'
import { getWholeQuote } from './ellipsisHelpers'

function countStringInArray(array, string) {
  return array.filter(item => item == string).length
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
 * @param {string} wholeQuote - whole quote without ellipsis.
 * @param {number} ellipsisCount - number of ellipses already
 * pass in the loop
 */
function getWordOccurrence(verseString, substr, quote, substrIndex, wholeQuote, ellipsisCount) {
  console.log('ellipsisCount', ellipsisCount, quote, 'substr', substr)
  const goodQuote = quote.includes(ELLIPSIS) ? wholeQuote : quote
  const quoteSubStrIndex = verseString.indexOf(goodQuote)
  const precedingStr = verseString.substring(0, quoteSubStrIndex)
  const precedingStrs = stringTokenizer.tokenizeWithPunctuation(precedingStr)
  let precedingOccurrences = 0

  for (let i = 0; i <= quoteSubStrIndex; i++) {
    const stringItem = precedingStrs[i]
    if (stringItem === substr) {
      precedingOccurrences++
    }
  }

  let occurrence = ++precedingOccurrences

  // if substr is found in quote more than once
  if (goodQuote.split(new RegExp(substr, 'gi')).length - 1 > 1) {
    if (quote.includes(ELLIPSIS)) {
      quote = quote.replace(/\.../g, '')
    }
    let precedingSubstrOccurrences = substrOccurrencesInQuote(quote, substr, substrIndex)
    occurrence = ++precedingSubstrOccurrences
  }

  return occurrence
}

export function getWordOccurrencesForQuote(quote, verseString) {
  const words = []
  let wholeQuote = ''

  if (quote.includes(THREE_DOTS)) {
    quote = quote.replace(/\.../g, ELLIPSIS)
    wholeQuote = getWholeQuote(quote, verseString)
  }

  const substrings = stringTokenizer.tokenizeWithPunctuation(quote)

  let ellipsisCount = 0
  substrings.forEach((substring, index) => {
    let word = {}

    if (substring === ELLIPSIS) {
      ++ellipsisCount
      word = {
        word: substring,
      }
    } else {
      word = {
        word: substring,
        occurrence: getWordOccurrence(verseString, substring, quote, index, wholeQuote, ellipsisCount),
      }
    }

    words.push(word)
  })

  return words
}
