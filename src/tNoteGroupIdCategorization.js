/**
 * Hard coded list of tNotes categories
 */
export const tNotesCategories = {
  lexical: {
    "translate-bweight": "Measures and Weights",
    "translate-numbers": "Numbers",
    "translate-fraction": "Fractions",
    "translate-ordinal": "Ordinal Numbers"
  },
  figures: {
    "figs-idiom": "Idiom",
    "figs-irony": "Irony",
    "figs-metaphor": "Metaphor",
    "figs-rquestions": "Rhetorical Questions",
    "figs-simile": "Simile",
    "figs-apostrophe": "apostrophe",
    "figs-euphemism": "Euphemism",
    "figs-hendiadys": "Hendiadys",
    "figs-hyperbole": "Hyperbole",
    "figs-litotes": "litotes",
    "figs-merism": "Merism",
    "figs-metonymy": "Metonymy",
    "figs-parallelism": "Parallelism",
    "figs-personification": "Personification",
    "figs-synecdoche": "Synecdoche",
    "figs-ellipsis": "Ellipsis",
    "figs-doublenegatives": "Double negatives"
  },
  cultural: {
    "translate-symaction": "Symbolic Actions",
    "writing-symlanguage": "Symbolic Language",
    "translate-unknown": "Unknowns",
    "figs-explicit": "Implicit and Explicit Information"
  },
  morphological: {
    "figs-you": "Forms of You",
    "figs-we": "Forms of We",
    "figs-they": "Forms of They",
    "figs-activepassive": "Active or Passive",
    "figs-gendernotations": "Gender",
    "figs-pronouns": "Pronouns",
    "writing-connectingwords": "Connecting Words",
  }
}

/**
 * Gets the category name of a groupId. Returns other as a categpory name
 * if the groupId is not found in the tNotes categories in the list above.
 * @param {string} groupId tA article slug.
 * @returns {string} The category name of a groupId: lexical,
 * figures, cultural, morphological or other.
 */
export const getCategoryForGroupId = (groupId) => {
  let result = 'other';

  Object.keys(tNotesCategories)
    .forEach((category) => {
      if (tNotesCategories[category][groupId]) result = category
    })

  return result;
}

/**
 * Categorizes the group data into five categories: lexical,
 * figures, cultural, morphological and other.
 * @param {Object} groupData Object of groupids that contain an
 * array of contextIds for each groupId.
 * @returns The group data categorized into five categories:
 * lexical, figures, cultural, morphological and other.
 * 
 * {
    lexical: {},
    figures: {
      'figs-metaphor': []// array of groupId objects
    },
    cultural: {},
    morphological: {
      'figs-activepassive': []// array of groupId objects
    },
    other: {
      'figs-abstractnouns': []// array of groupId objects
    }
  }
 */
export const categorizeGroupData = groupData => {
  const categorizedGroupData = {
    lexical: {},
    figures: {
      'figs-metaphor': []
    },
    cultural: {
      'figs-explicit': []
    },
    morphological: {
      'figs-activepassive': []
    },
    other: {
      'figs-abstractnouns': [],
    }
  }

  Object.keys(groupData).forEach(groupId => {
    const category = getCategoryForGroupId(groupId)
    categorizedGroupData[category][groupId] = groupData[groupId]
  })

  return categorizedGroupData;
}