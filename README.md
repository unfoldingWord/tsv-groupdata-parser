# tsv-groupdata-parser

[![Build Status](https://api.travis-ci.org/translationCoreApps/tsv-groupdata-parser.svg?branch=master)](https://travis-ci.org/translationCoreApps/tsv-groupdata-parser)
[![npm](https://img.shields.io/npm/dt/tsv-groupdata-parser.svg)](https://www.npmjs.com/package/tsv-groupdata-parser)
[![npm](https://img.shields.io/npm/v/tsv-groupdata-parser.svg)](https://www.npmjs.com/package/tsv-groupdata-parser)

Parses the translationNotes TSVs files to generate the GroupIndex and GroupData for the translationCore Desktop app.

## Usage

```js
  import {
    tsvToGroupData,
    categorizeGroupData,
    formatAndSaveGroupData
  } from 'tsv-groupdata-parser';

  // tsvToGroupData() example
  const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv';
  const groupData = await tsvToGroupData(filepath, "translationNotes");

  // or
  tsvToGroupData(filepath, "translationNotes").then((data) => {
    const groupData = data;
  });

  // categorizeGroupData() example
  const categorizedGroupData = categorizeGroupData(groupData)
  const rootOutputPath = 'translationCore/resources/en/thelps/tNotes'

  // formatAndSaveGroupData() example
  formatAndSaveGroupData(categorizedGroupData, rootOutputPath, 'tit')
```

## Builds

Builds are made using babel 7 (babel-cli) for more infor see: [Babel CLI docs](https://babeljs.io/docs/en/babel-cli)
