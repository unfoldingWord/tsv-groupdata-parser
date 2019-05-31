export function verseObjectsToString(verseObjects) {
  return verseObjects
    .map((verseObject, index) => {
      let previousVerseObject = verseObjects[index - 1]
      if (previousVerseObject && previousVerseObject.children) {
        const { children } = previousVerseObject
        previousVerseObject = children[children.length - 1]
      }

      if (previousVerseObject && previousVerseObject.text === ' ' && verseObject.text === ' ') {
        return ''
      }
      if (verseObject.text) {
        let text = verseObject.text
        if (text.includes('\n')) text = text.replace('\n', '\u0020')
        return text
      } else if (verseObject.children) {
        return verseObjectsToString(verseObject.children)
      }
    })
    .join('')
    .replace('  ', '')
}
