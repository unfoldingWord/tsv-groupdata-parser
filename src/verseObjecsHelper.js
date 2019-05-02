
export function verseObjectsToString(verseObjects) {
  return verseObjects.map(verseObject => {
    if (verseObject.text)
      return verseObject.text
    else if (verseObject.children){
      return verseObjectsToString(verseObject.children)
    }
  }).join('');
};
