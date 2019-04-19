import stringTokenizer from 'string-punctuation-tokenizer'
import ManageResource from './ManageResource'
/**
 * search for previous occurrences of word to get occurrence for this instance
 * @param {Array} wordObjects so far in current verse
 * @param {string} text
 * @return {number} occurrence of this word in verse
 */
export function getWordOccurrence(wordObjects, text) {
  let occurrence = 1;
  for (let i = 0, l = wordObjects.length; i < l; i++) {
    if (wordObjects[i] === text) {
      occurrence++;
    }
  }
  return occurrence;
}

export function getOccurrencesForQuote(quote, bookId, chapter, verse, originalBiblePath) {
  let words = []
  const substrings = stringTokenizer.tokenizeWithPunctuation(quote)
  const resourceApi = new ManageResource(originalBiblePath)
  resourceApi.loadChapter(bookId, chapter)
  const wordObjects = resourceApi.getVerse(chapter, verse)

  substrings.forEach(substring => {
    const word = {
      occurrence: getWordOccurrence(wordObjects, substring),
      word: substring,
    }

    words.push(word)
  });

  return words
}
