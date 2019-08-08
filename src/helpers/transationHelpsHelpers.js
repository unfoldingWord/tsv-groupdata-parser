import fs from 'fs-extra'
import path from 'path-extra'

export const translationHelps = {
  ta: 'translationAcademy',
  tn: 'translationNotes',
  tw: 'translationWords',
  tq: 'translationQuestions',
}

export const getGroupName = articlePath => {
  const articleFile = fs.readFileSync(articlePath, 'utf8')
  // get the article's first line and remove #'s and spaces from beginning/end
  return articleFile.split('\n')[0].replace(/(^\s*#\s*|\s*#\s*$)/gi, '')
}

/**
 * Returns an array of versions found in the path that start with [vV]\d
 * @param {String} resourcePath - base path to search for versions
 * @return {Array} - array of versions, e.g. ['v1', 'v10', 'v1.1']
 */
export function getVersionsInPath(resourcePath) {
  if (!resourcePath || !fs.pathExistsSync(resourcePath)) {
    return null
  }
  const isVersionDirectory = name => {
    const fullPath = path.join(resourcePath, name)
    return fs.lstatSync(fullPath).isDirectory() && name.match(/^v\d/i)
  }
  return sortVersions(fs.readdirSync(resourcePath).filter(isVersionDirectory))
}

/**
 * Returns a sorted an array of versions so that numeric parts are properly ordered (e.g. v10a < v100)
 * @param {Array} versions - array of versions unsorted: ['v05.5.2', 'v5.5.1', 'V6.21.0', 'v4.22.0', 'v6.1.0', 'v6.1a.0', 'v5.1.0', 'V4.5.0']
 * @return {Array} - array of versions sorted:  ["V4.5.0", "v4.22.0", "v5.1.0", "v5.5.1", "v05.5.2", "v6.1.0", "v6.1a.0", "V6.21.0"]
 */
export function sortVersions(versions) {
  // Don't sort if null, empty or not an array
  if (!versions || !Array.isArray(versions)) {
    return versions
  }
  // Only sort of all items are strings
  for (let i = 0; i < versions.length; ++i) {
    if (typeof versions[i] !== 'string') {
      return versions
    }
  }
  versions.sort((a, b) => String(a).localeCompare(b, undefined, { numeric: true }))
  return versions
}

/**
 * Return the full path to the highest version folder in resource path
 * @param {String} resourcePath - base path to search for versions
 * @return {String} - path to highest version
 */
export function getLatestVersionInPath(resourcePath) {
  const versions = sortVersions(getVersionsInPath(resourcePath))
  if (versions && versions.length) {
    return path.join(resourcePath, versions[versions.length - 1])
  }
  return null // return illegal path
}
