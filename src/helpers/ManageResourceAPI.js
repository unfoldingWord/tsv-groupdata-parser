import fs from 'fs-extra';
import path from 'path-extra';
import { verseObjectsToString } from './verseObjecsHelper';

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

  getVerseString(chapter, verse) {
    let verseObjects_ = [];
    let isString = typeof verse === 'string';
    let [start, end] = isString ? verse.split('-') : [verse];
    let isRange = !!end;
    let startInt = isString ? parseInt(start, 10) : verse;

    if (isRange) {
      let endInt = parseInt(end, 10);

      if (!isNaN(startInt) && !isNaN(endInt)) {
        start = startInt;
        end = (endInt > startInt) ? endInt : startInt;
      } else {
        isRange = false;
      }
    } else {
      if (!isNaN(startInt)) {
        start = startInt;
      }
    }

    const chapterData = this.resource[chapter];
    const { verseObjects } = chapterData[start];
    verseObjects_ = verseObjects;

    if (isRange) {
      for (let i = start + 1; i <= end; i++) {
        const { verseObjects } = chapterData[i];
        verseObjects_ = verseObjects_.concat(verseObjects);
      }
    }

    return verseObjectsToString(verseObjects_);
  }
}

export default ManageResource;
