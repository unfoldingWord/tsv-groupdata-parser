/**
 * Hard coded list of tNotes categories
 */
export const tNotesCategories = {
  discourse: {
    "writing-background": "Background Information",
    "writing-endofstory": "End of Story",
    "writing-intro": "Types of Writing",
    "writing-newevent": "Introduction of a New Event",
    "figs-events": "Order of Events",
    "figs-exclamations": "Exclamations",
    "figs-parables": "Parables",
    "writing-participants": "Introduction of New and Old Participants",
    "figs-pastforfuture": "Predictive Past",
    "writing-poetry": "Poetry",
    "writing-proverbs": "Proverbs",
    "figs-quotations": "Direct and Indirect Quotations",
    "writing-quotations": "Quotations and Quote Margins",
    "figs-quotesinquotes": "Quotes Within Quotes",
    "figs-sentences": "Sentence Structure",
    "translate-versebridge": "Verse Bridges",
    "figs-exmetaphor": "Extended Metaphor",
    "writing-connectingwords": "Connecting Words",
    "figs-declarative": "Statements - Other Uses",
    "figs-imperative": "Imperatives - Other Uses"
  },
  numbers: {
    "translate-numbers": "Numbers",
    "translate-fraction": "Fractions",
    "translate-ordinal": "Ordinal Numbers"
  },
  figures: {
    "figs-idiom": "Idiom",
    "figs-irony": "Irony",
    "figs-metaphor": "Metaphor",
    "figs-rquestion": "Rhetorical Question",
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
    "figs-doublenegatives": "Double negatives",
    "figs-doublet": "Doublet"
  },
  culture: {
    "figs-explicit": "Implicit and Explicit Information",
    "translate-symaction": "Symbolic Actions",
    "writing-symlanguage": "Symbolic Language",
    "translate-unknown": "Unknowns",
    "translate-bdistance": "Biblical Distance",
    "translate-bmoney": "Biblical Money",
    "translate-bvolume": "Biblical Volume",
    "figs-go": "Go and Come",
    "translate-hebrewmonths": "Hebrew Months",
    "translate-names": "How to Translate Names",
    "translate-bweight": "Measures and Weights"
  },
  grammar: {
    "figs-hypo": "Hypothetical Situations",
    "figs-activepassive": "Active or Passive",
    "figs-gendernotations": "Gender",
    "figs-pronouns": "Pronouns",
    "figs-you": "Forms of You",
    "figs-123person": "First, Second, or Third Person",
    "figs-abstractnouns": "Abstract Nouns",
    "figs-distinguish": "Distinguishing versus Informing or Reminding",
    "figs-exclusive": "Exclusive and Inclusive \"We\"",
    "figs-genericnoun": "Generic Noun Phrases",
    "figs-inclusive": "Inclusive \"We\"",
    "figs-nominaladj": "Nominal Adjectives",
    "figs-possession": "Possession",
    "figs-rpronouns": "Reflexive Pronouns",
    "figs-we": "Forms of We",
    "figs-they": "Forms of They"
  },
  "other": {
    "translate-manuscripts": "Original Manuscripts",
    "guidelines-sonofgodprinciples": "Translating Son and Father",
    "translate-textvariants": "Textual Variants",
    "translate-transliterate": "Copy or Borrow Words",
  }
}

/**
 * Gets the category name of a groupId. Returns other as a categpory name
 * if the groupId is not found in the tNotes categories in the list above.
 * @param {string} groupId tA article slug.
 * @returns {string} The category name of a groupId: discourse,
 * numbers, figures, culture, grammar or other.
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
 * Categorizes the group data into five categories: discourse,
 * numbers, figures, culture, grammar or other.
 * @param {Object} groupData Object of groupids that contain an
 * array of contextIds for each groupId.
 * @returns The group data categorized into five categories:
 * discourse, numbers, figures, culture, grammar or other.
 *
 * {
    discourse: {},
    numbers: {},
    figures: {
      'figs-metaphor': [] // array of groupId objects
    },
    culture: {},
    grammar: {
      'figs-abstractnouns': [], // array of groupId objects
      'figs-activepassive': [] // array of groupId objects
    },
    other: {}
  }
 */
export const categorizeGroupData = groupData => {
  const categorizedGroupData = {
    discourse: {},
    numbers: {},
    figures: {},
    culture: {},
    grammar: {},
    other: {}
  }

  Object.keys(groupData).forEach(groupId => {
    const category = getCategoryForGroupId(groupId)
    categorizedGroupData[category][groupId] = groupData[groupId]
  })

  return categorizedGroupData;
}
