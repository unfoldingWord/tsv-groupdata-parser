/* eslint-disable no-param-reassign */
import stringTokenizer from 'string-punctuation-tokenizer'
import { ELLIPSIS, THREE_DOTS } from '../utils/constants'
import { getOmittedWordsInQuote } from './ellipsisHelpers'

function countStringInArray(array, string) {
  return array.filter(item => item == string).length
}

function cleanRegex(str) {
  return str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1')
}

function tokenizeQuote(quote) {
  /* eslint-disable prettier/prettier */
  const tokens = stringTokenizer.tokenizeWithPunctuation(quote)

  // apostrophes should not be tokenized therefore adding it the the end of the preceding token.
  return tokens
    .map((token, index) => {
      let nextToken;

      if (index < (tokens.length - 1)) { // if next token exists
        nextToken = tokens[index + 1]
      }

      // if next token is a closing apostrophe then add it to the end of the current token
      if (nextToken === '’') {
        return `${token}${nextToken}`
      } else {
        return token
      }
    })
    .filter(token => token !== '’')
}

function substrOccurrencesInQuote(quote, substr, substrIndex, ellipsisCount, quoteOmittedStrings) {
  const quoteSubstrings = tokenizeQuote(quote)
  let precedingSubstrs = quoteSubstrings.slice(0, substrIndex)
  let localEllipsisCount = 0

  precedingSubstrs.forEach((precedingSubstr, index) => {
    if (precedingSubstr === ELLIPSIS) {
      ++localEllipsisCount
      const untokenizedString = quoteOmittedStrings[localEllipsisCount - 1]
      const missingPrecedingSubstrs = tokenizeQuote(untokenizedString).reverse()
      // Add tokenized missing strings to precedingSubstrs for accurate occurrence number search
      missingPrecedingSubstrs.forEach(missingPrecedingSubstr => {
        precedingSubstrs.splice(index, 0, missingPrecedingSubstr)
      })
    }
  })

  // filter out ellipsis
  precedingSubstrs = precedingSubstrs.filter(item => item !== ELLIPSIS)

  return countStringInArray(precedingSubstrs, substr)
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
 * @param {string} quoteOmittedStrings - list of omitted strings in the quote.
 * pass in the loop
 */
function getWordOccurrence(verseString, substr, quote, substrIndex, wholeQuote, ellipsisCount, quoteOmittedStrings) {
  const goodQuote = quote.includes(ELLIPSIS) ? wholeQuote : quote
  const quoteSubStrIndex = verseString.indexOf(goodQuote)
  const precedingStr = verseString.substring(0, quoteSubStrIndex)
  const precedingStrs = tokenizeQuote(precedingStr)
  let precedingOccurrences = 0

  for (let i = 0; i <= quoteSubStrIndex; i++) {
    const stringItem = precedingStrs[i]
    if (stringItem === substr) {
      precedingOccurrences++
    }
  }

  let occurrence = ++precedingOccurrences

  // if substr is found in quote more than once
  if (goodQuote.split(new RegExp(cleanRegex(substr), 'gi')).length - 1 > 1) {
    const precedingSubstrOccurrences = substrOccurrencesInQuote(quote, substr, substrIndex, ellipsisCount, quoteOmittedStrings)
    occurrence += precedingSubstrOccurrences
  }

  return occurrence
}

export function getWordOccurrencesForQuote(quote, verseString) {
  const words = []
  let wholeQuote = ''
  let quoteOmittedStrings

  if (quote.includes(THREE_DOTS)) {
    quote = quote.replace(/\.../g, ELLIPSIS)
    const quoteOmittedWords = getOmittedWordsInQuote(quote, verseString)
    wholeQuote = quoteOmittedWords.wholeQuote
    quoteOmittedStrings = quoteOmittedWords.omittedStrings
  }

  const substrings = tokenizeQuote(quote)

  // console.log('substrings', substrings)

  let ellipsisCount = 0
  substrings.forEach((substring, index) => {
    let word = {}

    if (substring === ELLIPSIS) {
      ++ellipsisCount
      word = {
        word: substring,
      }
    } else {
      const occurrence = getWordOccurrence(verseString, substring, quote, index, wholeQuote, ellipsisCount, quoteOmittedStrings)
      word = {
        word: substring,
        occurrence,
      }
    }

    words.push(word)
  })

  return words
}
