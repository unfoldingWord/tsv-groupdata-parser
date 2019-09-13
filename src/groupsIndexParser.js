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

  const isDirectory = item => fs.lstatSync(path.join(tnCategoriesPath, item)).isDirectory();
  const categories = fs.readdirSync(tnCategoriesPath).filter(isDirectory);

  categories.forEach(categoryName => {
    const booksPath = path.join(tnCategoriesPath, categoryName, 'groups');
    const books = fs.readdirSync(booksPath).filter(item => item !== '.DS_Store');

    books.forEach(bookid => {
      const groupDataPath = path.join(booksPath, bookid);
      const groupDataFiles = fs.readdirSync(groupDataPath).filter(filename => path.extname(filename) === '.json');

      groupDataFiles.forEach(groupDataFile => {
        const filePath = path.join(groupDataPath, groupDataFile);
        const groupId = groupDataFile.replace('.json', '');
        const groupData = fs.readJsonSync(filePath);

        if (groupData.length > 0) {
          const taArticleCategory = getArticleCategory(groupData[0].contextId.occurrenceNote, groupId);

          if (taArticleCategory) {
            const fileName = groupId + '.md';
            const articlePath = path.join(taCategoriesPath, taArticleCategory, fileName);
            const groupName = getGroupName(articlePath);
            const groupIndexItem = getGroupIndex(groupId, groupName);

            // Only add the groupIndexItem if it isn't already in the category's groups index.
            if (!categorizedGroupsIndex[categoryName].some(e => e.id === groupIndexItem.id)) {
              categorizedGroupsIndex[categoryName].push(groupIndexItem); // adding group Index Item
            }
          }
        }
      });
    });
  });

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
