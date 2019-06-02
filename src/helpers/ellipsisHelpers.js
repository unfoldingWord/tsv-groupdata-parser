/* eslint-disable no-param-reassign */
import { ELLIPSIS } from '../utils/constants'

function indexPlusOneIsOdd(n) {
  return !((n + 1) % 2 == 0)
}

export function getOmittedWordsInQuote(quote, verseString) {
  quote = quote.replace(/\.../g, ELLIPSIS)
  const quoteChunks = quote.split(ELLIPSIS)
  const missingWordsIndices = []

  quoteChunks.forEach((quoteChunk, index) => {
    let quoteChunkSubStrIndex

    // if index plus one is odd & is not the last item in the array
    if (indexPlusOneIsOdd(index) && index < quoteChunks.length - 1 && index !== 2) {
      let nextQuoteChunk = quoteChunks[index + 1]
      if (!verseString.includes(nextQuoteChunk)) nextQuoteChunk = nextQuoteChunk.trim()
      const splittedVerse = verseString.split(quoteChunk)
      const useLastIndexOf = splittedVerse.length === 2 ? splittedVerse[0].includes(nextQuoteChunk) : false
      // eslint-disable-next-line prettier/prettier
      const nextChunkIndex = useLastIndexOf ?
        verseString.lastIndexOf(nextQuoteChunk) : verseString.indexOf(nextQuoteChunk)

      if (nextChunkIndex) {
        const strBeforeNextQuote = verseString.substring(0, nextChunkIndex)
        // TRICKY: in some cases the chunck isnt found in the preceding string because of extra space in the string.
        if (!strBeforeNextQuote.includes(quoteChunk)) {
          quoteChunk = quoteChunk.trim()
          quoteChunks[index] = quoteChunk
        }

        // Determine whether to use the last Index or first index of quoteChunk
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
      // Determine whether to use the last Index or first index of quoteChunk.
      // if it's the last quoteChunk in the array use lastIndexOf string.
      const useLastIndexOf = quoteChunks.length === index + 1
      // eslint-disable-next-line prettier/prettier
      const lastMissingWordEndingIndex = useLastIndexOf ?
        verseString.lastIndexOf(quoteChunk) : verseString.indexOf(quoteChunk)
      const sliced = verseString.slice(lastMissingWordEndingIndex)
      const stringPrecedingLastChunk = verseString.replace(sliced, '')
      const previousQuoteChunk = quoteChunks[index - 1]
      const startIndex = stringPrecedingLastChunk.lastIndexOf(previousQuoteChunk) + previousQuoteChunk.length
      missingWordsIndices.push(startIndex + (index === 0 ? quoteChunk.length : 0))
      if (!verseString.includes(quoteChunk)) {
        quoteChunk = quoteChunk.trim()
        quoteChunks[index] = quoteChunk
      }

      // eslint-disable-next-line prettier/prettier
      const endIndex = useLastIndexOf ?
        verseString.lastIndexOf(quoteChunk) : verseString.indexOf(quoteChunk)

      missingWordsIndices.push(endIndex + (index === 0 ? quoteChunk.length : 0))
    } else {
      if (!verseString.includes(quoteChunk)) {
        quoteChunk = quoteChunk.trim()
        quoteChunks[index] = quoteChunk
      }
      // Determine whether to use the last Index or first index of quoteChunk.
      const previousQuoteChunk = quoteChunks[index - 1]
      const splittedVerse = verseString.split(previousQuoteChunk)
      const useLastIndexOf = splittedVerse.length === 2 ? splittedVerse[0].includes(quoteChunk) : false
      // eslint-disable-next-line prettier/prettier
      quoteChunkSubStrIndex = useLastIndexOf ?
        verseString.lastIndexOf(quoteChunk) : verseString.indexOf(quoteChunk)
      missingWordsIndices.push(quoteChunkSubStrIndex + (index === 0 ? quoteChunk.length : 0))
    }
  })

  const omittedStrings = []
  missingWordsIndices.forEach((startIndex, i) => {
    if (!((i + 1) % 2 == 0)) {
      // if index is odd number
      const endIndex = missingWordsIndices[i + 1]
      const missingString = verseString.slice(startIndex, endIndex)
      omittedStrings.push(missingString)
    }
  })

  let wholeQuote = ''
  quoteChunks.forEach((chunk, index) => {
    const missingWord = omittedStrings[index] || ''
    wholeQuote = wholeQuote + chunk + missingWord
  })

  return {
    wholeQuote,
    omittedStrings,
  }
}
