import fs from 'fs-extra'
import path from 'path-extra'

export const generateGroupsIndex = (tnCategoriesPath, taCategoriesPath) => {
  const categorizedGroupsIndex = {
    discourse: [],
    numbers: [],
    figures: [],
    culture: [],
    grammar: [],
    other: []
  }

  const isDirectory = (item) => fs.lstatSync(path.join(tnCategoriesPath, item)).isDirectory()
  const categories = fs.readdirSync(tnCategoriesPath).filter(isDirectory)

  categories.forEach(categoryName => {
    const booksPath = path.join(tnCategoriesPath, categoryName, 'groups')
    const books = fs.readdirSync(booksPath).filter(item => item !== '.DS_Store');
    books.forEach(bookid => {
      const groupDataPath = path.join(booksPath, bookid)
      const groupDataFiles = fs.readdirSync(groupDataPath).filter((filename) => path.extname(filename) === '.json');
      groupDataFiles.forEach(groupDataFile => {
        const filePath = path.join(groupDataPath, groupDataFile)
        const groupId = groupDataFile.replace('.json', '')
        const groupData = fs.readJsonSync(filePath)

        if (groupData.length > 0) {
          const taArticleCategory = getArticleCategory(groupData[0].contextId.occurrenceNote)
          const fileName = groupId + '.md'
          const articlePath = path.join(taCategoriesPath, taArticleCategory, fileName)
          const groupName = getGroupName(articlePath)
          const groupIndexItem = getGroupIndex(groupId, groupName);

          // Only add the groupIndexItem if it isnt already in the category's groups index.
          if (!categorizedGroupsIndex[categoryName].some(e => e.id === groupIndexItem.id)) {
            categorizedGroupsIndex[categoryName].push(groupIndexItem)// adding group Index Item
          }
        }
      })
    })
  })

  fs.outputJsonSync('categorizedGroupsIndex.json', categorizedGroupsIndex, {spaces:2})

  return categorizedGroupsIndex;
}

const getArticleCategory = (occurrenceNote) => {
  const cutEnd = occurrenceNote.search("rc://en/ta/man/");
  const taArticleCategory = (occurrenceNote.substr(0, 0) + occurrenceNote.substr(cutEnd + 1))
    .replace("c://en/ta/man/", "")
    .split("/")[0]

  return taArticleCategory;
}

const getGroupName = (articlePath) => {
  const articleFile = fs.readFileSync(articlePath, 'utf8');
  // get the article's first line and remove #'s and spaces from beginning/end
  return articleFile.split('\n')[0].replace(/(^\s*#\s*|\s*#\s*$)/gi, '');
}

const getGroupIndex = (groupId, groupName) => {
  return {
    id: groupId,
    name: groupName
  }
}
