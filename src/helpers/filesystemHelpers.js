import fs from 'fs-extra';
import path from 'path-extra';

/**
 * Formats and saves the groupData into the 5 tN categories in the desired
 * filesystem structure (discourse, numbers, figures, culture, grammar or other)
 * which include all the json files for the catgory based on the tA articles
 * @param {object} categorizedGroupData groupData categorized in 5 categories:
 * discourse, numbers, figures, culture, grammar or other.
 * @param {string} rootDestinationPath root directory where the files will be saved.
 * @param {string} bookId book id.
 */
export const formatAndSaveGroupData = (categorizedGroupData, rootDestinationPath, bookId) =>
  new Promise((resolve, reject) => {
    try {
      const categories = Object.keys(categorizedGroupData);

      categories.forEach(categoryName => {
        const categoryData = categorizedGroupData[categoryName];
        const groupIds = Object.keys(categoryData);

        if (groupIds.length === 0) {
          fs.ensureDirSync(path.join(rootDestinationPath, categoryName, 'groups', bookId));
        }

        groupIds.forEach(groupId => {
          const filename = groupId + '.json';
          const groupData = categoryData[groupId];
          const savePath = path.join(rootDestinationPath, categoryName, 'groups', bookId, filename);

          fs.outputJsonSync(savePath, groupData, { spaces: 2 });
        });
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });

/**
 * Persists the groupsIndex for each of the tN group category.
 * (discourse, numbers, figures, culture, grammar or other)
 * @param {object} categorizedGroupsIndex categorized groupsIndex.
 * @param {string} outputPath path to the tN categories folders.
 */
export const saveGroupsIndex = (categorizedGroupsIndex, outputPath) => {
  Object.keys(categorizedGroupsIndex).forEach(categoryName => {
    const categoryGroupsIndex = categorizedGroupsIndex[categoryName];
    fs.outputJsonSync(path.join(outputPath, categoryName, 'index.json'), categoryGroupsIndex, { spaces: 2 });
  });
};
