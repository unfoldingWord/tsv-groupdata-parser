
export function verseObjectsToString(verseObjects) {
  return verseObjects.map(verseObject => verseObject.text).join('');
};
