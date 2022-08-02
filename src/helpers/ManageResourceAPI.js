import fs from 'fs-extra';
import path from 'path-extra';
import { getVerseString } from './verseHelpers';

class ManageResource {
  constructor(originalBiblePath, bookId) {
    this.resource = {};
    this.sourcePath = originalBiblePath;
    this.bookId = bookId;
    this.loadBook();
  }

  loadBook() {
    if (this.sourcePath && this.bookId) {
      const bookDir = path.join(this.sourcePath, this.bookId);

      if (fs.existsSync(bookDir)) {
        const chapters = fs.readdirSync(bookDir).filter(filename => path.extname(filename) === '.json');

        for (let index = 0; index < chapters.length; index++) {
          const chapterFilename = chapters[index];
          const chapterFilePath = path.join(bookDir, chapterFilename);

          if (fs.existsSync(chapterFilePath)) {
            const chapter = chapterFilename.replace('.json', '');
            const chapterObject = fs.readJsonSync(chapterFilePath);
            this.resource[chapter] = chapterObject;
          } else {
            console.error(`${chapterFilePath}, path does not exist`);
          }
        }
      } else {
        console.error(`${bookDir}, path does not exist`);
      }
    } else {
      console.error(`bookId or originalBiblePath is undefined`);
    }
  }

  getResource() {
    return this.resource;
  }

  getVerseObjects(chapter, verse) {
    return this.resource[chapter][verse];
  }

  /**
   * find all verses in ref
   * @param {string} ref
   * @returns {string}
   */
  getVerseStringFromRef(ref) {
    const bookData = this.resource;
    const verseString = getVerseString(bookData, ref);

    if (!verseString) {
      // eslint-disable-next-line no-throw-literal
      throw `Reference not found: ${ref}`;
    }
    return verseString;
  }
}

export default ManageResource;
