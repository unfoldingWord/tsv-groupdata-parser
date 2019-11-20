import fs from 'fs-extra';
import path from 'path-extra';
import { getGroupName } from './helpers/resourcesHelpers';

export const generateGroupsIndex = (tnCategoriesPath, taCategoriesPath) => {
  const categorizedGroupsIndex = {
    discourse: [],
    numbers: [],
    figures: [],
    culture: [],
    grammar: [],
    other: [],
  };
  let error = false;

  const isDirectory = item => fs.lstatSync(path.join(tnCategoriesPath, item)).isDirectory();
  const categories = fs.readdirSync(tnCategoriesPath).filter(isDirectory);

  categories.forEach(categoryName => {
    const booksPath = path.join(tnCategoriesPath, categoryName, 'groups');
    const books = fs.readdirSync(booksPath).filter(item => item !== '.DS_Store');

    books.forEach(bookid => {
      const groupDataPath = path.join(booksPath, bookid);
      const groupDataFiles = fs.readdirSync(groupDataPath).filter(filename => path.extname(filename) === '.json');
      let taArticleCategory;
      let groupName;

      groupDataFiles.forEach(groupDataFile => {
        try {
          const filePath = path.join(groupDataPath, groupDataFile);
          const groupId = groupDataFile.replace('.json', '');
          const groupData = fs.readJsonSync(filePath);
          taArticleCategory = null;
          groupName = null;

          if (groupData.length > 0) {
            taArticleCategory = getArticleCategory(groupData[0].contextId.occurrenceNote, groupId);

            if (taArticleCategory) {
              const fileName = groupId + '.md';
              const articlePath = path.join(taCategoriesPath, taArticleCategory, fileName);
              groupName = getGroupName(articlePath);
              const groupIndexItem = getGroupIndex(groupId, groupName);

              // Only add the groupIndexItem if it isn't already in the category's groups index.
              if (!categorizedGroupsIndex[categoryName].some(e => e.id === groupIndexItem.id)) {
                categorizedGroupsIndex[categoryName].push(groupIndexItem); // adding group Index Item
              }
            }
          }
        } catch (e) {
          console.error(`generateGroupsIndex() - error processing entry: bookid: ${bookid}, groupDataFile: ${groupDataFile}, taArticleCategory: ${taArticleCategory}, groupName: ${groupName}`);
          error = true;
        }
      });
    });
  });

  if (error) {
    throw new Error(`generateGroupsIndex() - error processing index`);
  }

  return categorizedGroupsIndex;
};

/**
 * Gets the category of the given groupId from the links in the occurrenceNote
 * @param {string} occurrenceNote
 * @param {string} groupId
 * @returns {string} the matched category
 */
export const getArticleCategory = (occurrenceNote, groupId) => {
  if (occurrenceNote && groupId) {
    const pattern = '(?<=rc:\\/\\/[^\\/]+\\/ta\\/man\\/)[^\\/]+?(?=\\/' + groupId + ')';
    const categoryRE = new RegExp(pattern);
    const match = occurrenceNote.match(categoryRE);

    if (match) {
      return match[0];
    }
  }
  return null;
};

const getGroupIndex = (groupId, groupName) => ({
  id: groupId,
  name: groupName,
});
