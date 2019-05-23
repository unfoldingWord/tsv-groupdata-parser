/* eslint-disable no-param-reassign */
import { ELLIPSES } from '../utils/constants'

function indexPlusOneIsOdd(n) {
  return !((n + 1) % 2 == 0)
}

export function getQuoteOmittedString(quote, verseString) {
  quote = quote.replace(/\.../g, ELLIPSES)
  const quoteChunks = quote.split(ELLIPSES)
  const missingWordsIndices = []

  quoteChunks.forEach((quoteChunk, index) => {
    let quoteChunkSubStrIndex

    // if index plus 1 is odd & is not the last item in the array
    if (indexPlusOneIsOdd(index) && index < quoteChunks.length - 1 && index !== 2) {
      let nextQuoteChunk = quoteChunks[index + 1]
      if (!verseString.includes(nextQuoteChunk)) nextQuoteChunk = nextQuoteChunk.trim()
      const nextChunkIndex = verseString.indexOf(nextQuoteChunk)
      if (nextChunkIndex) {
        const strBeforeNextQuote = verseString.substring(0, nextChunkIndex)
        // TRICKY: in some cases the chunck isnt found in the preceding string because of extra space in the string.
        if (!strBeforeNextQuote.includes(quoteChunk)) {
          quoteChunk = quoteChunk.trim()
          quoteChunks[index] = quoteChunk
        }

        // The code below determines whether to use the last Index or first index of quoteChunk
        const lastIndexOfQuoteChunk = strBeforeNextQuote.lastIndexOf(quoteChunk)
        if (lastIndexOfQuoteChunk + quoteChunk.length === strBeforeNextQuote.length) {
          const precedingLastQuoteChunkoccurrence = strBeforeNextQuote.slice(lastIndexOfQuoteChunk)
          if (precedingLastQuoteChunkoccurrence.includes(quoteChunk)) {
            // if quote chunk is found again in preceding string
            quoteChunkSubStrIndex = strBeforeNextQuote.indexOf(quoteChunk)
          }
        } else {
          quoteChunkSubStrIndex = strBeforeNextQuote.lastIndexOf(quoteChunk)
        }
      }
      missingWordsIndices.push(quoteChunkSubStrIndex + (index === 0 ? quoteChunk.length : 0))
    } else if ((index === quoteChunks.length - 1 || index >= 2) && quoteChunks.length >= 3) {
      // if is last quote chunk
      const lastMissingWordEndingIndex = verseString.indexOf(quoteChunk)
      const sliced = verseString.slice(lastMissingWordEndingIndex)
      const stringPrecedingLastChunk = verseString.replace(sliced, '')
      const previousQuoteChunk = quoteChunks[index - 1]
      const startIndex = stringPrecedingLastChunk.lastIndexOf(previousQuoteChunk) + previousQuoteChunk.length

      missingWordsIndices.push(startIndex + (index === 0 ? quoteChunk.length : 0))

      if (!verseString.includes(quoteChunk)) {
        quoteChunk = quoteChunk.trim()
        quoteChunks[index] = quoteChunk
      }
      const endIndex = verseString.indexOf(quoteChunk)
      missingWordsIndices.push(endIndex + (index === 0 ? quoteChunk.length : 0))
    } else {
      if (!verseString.includes(quoteChunk)) {
        quoteChunk = quoteChunk.trim()
        quoteChunks[index] = quoteChunk
      }
      quoteChunkSubStrIndex = verseString.indexOf(quoteChunk)
      missingWordsIndices.push(quoteChunkSubStrIndex + (index === 0 ? quoteChunk.length : 0))
    }
  })

  const missingStrings = []
  missingWordsIndices.forEach((startIndex, i) => {
    if (!((i + 1) % 2 == 0)) {
      // if index is odd number
      const endIndex = missingWordsIndices[i + 1]
      const missingString = verseString.slice(startIndex, endIndex)
      missingStrings.push(missingString)
    }
  })

  let wholeQuote = ''
  quoteChunks.forEach((chunk, index) => {
    const missingWord = missingStrings[index] || ''
    wholeQuote = wholeQuote + chunk + missingWord
  })

  return wholeQuote
}
