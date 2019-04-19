import fs from 'fs-extra'
import path from 'path-extra'

class ManageResource {
  constructor(sourcePath) {
    this.resource = {}
    this.sourcePath = sourcePath
  }

  loadChapter(bookId, chapter) {
    const bookDir = path.join(this.sourcePath, bookId);
    if (fs.existsSync(bookDir)) {
      const chapterFile = path.join(bookDir, chapter + '.json');
      if (fs.existsSync(chapterFile) && !this.resource[chapter]) {
        const chapterObject = fs.readFileSync(chapterFile)
        this.resource[chapter] = chapterObject;
      } else {
        console.error(`${chapterFile}, path does not exist`)
      }
    } else {
      console.error(`${bookDir}, path does not exist`)
    }
  }

  getResource() {
    return this.resource;
  }

  getVerse(chapter, verse) {
    return this.resource[chapter][verse];
  }
}

export default ManageResource;
