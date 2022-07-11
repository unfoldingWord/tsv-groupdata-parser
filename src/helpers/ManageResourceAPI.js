import fs from 'fs-extra';
import path from 'path-extra';
import { parseReferenceToList } from '../tsvToGroupData';
import { verseObjectsToString } from './verseObjecsHelper';
import {
  getVerseList,
  getVerseSpanRange,
  isVerseSpan,
} from './verseHelpers';

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

  isVerseInRange(chapter, verse, endChapter, endVerse) {
    if (chapter < endChapter) {
      return true;
    }

    if (chapter === endChapter) {
      if (verse <= endVerse) {
        return true;
      }
    }
    return false;
  }

  getVerseStringFromRef(ref) {
    let verseObjects_ = [];
    const chunks = parseReferenceToList(ref);

    for (const chunk of chunks) {
      if (!chunk.endVerse) {
        const chapterData = this.resource[chunk.chapter];
        const { verseObjects = null } = chapterData[chunk.verse];
        verseObjects_ = verseObjects_.concat(verseObjects);
      } else { // handle range
        let chapter = chunk.chapter;
        let verse = chunk.verse;
        const endVerse = chunk.endVerse;
        const endChapter = chunk.endChapter || chapter;

        while (this.isVerseInRange(chapter, verse, endChapter, endVerse)) {
          const chapterData = this.resource[chapter];
          const verseData = chapterData[verse];

          if (!verseData) { // if past end of chapter
            chapter += 1;
            verse = 1;
            continue;
          }

          const { verseObjects = null } = verseData;
          verseObjects_ = verseObjects_.concat(verseObjects);
        }
      }
    }
  }

  getVerseString(chapter, verseStr) {
    const chapterData = this.resource[chapter];
    let verseObjects_ = [];
    const verses = getVerseList(verseStr);

    for (const verse of verses) {
      if (isVerseSpan(verse)) {
        const { low, high } = getVerseSpanRange(verse);

        if (low && high) {
          for (let i = low; i <= high; i++) {
            const { verseObjects = null } = chapterData[i];
            verseObjects_ = verseObjects_.concat(verseObjects);
          }
        }
      } else {
        const { verseObjects = null } = chapterData[verse];

        if (verseObjects) {
          verseObjects_ = verseObjects_.concat(verseObjects);
        }
      }
    }

    return verseObjectsToString(verseObjects_);
  }
}

export default ManageResource;
