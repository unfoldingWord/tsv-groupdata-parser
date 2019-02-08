# tsv-groupdata-parser

[![Build Status](https://api.travis-ci.org/translationCoreApps/tsv-groupdata-parser.svg?branch=master)](https://travis-ci.org/translationCoreApps/tsv-groupdata-parser) 
[![npm](https://img.shields.io/npm/dt/tsv-groupdata-parser.svg)](https://www.npmjs.com/package/tsv-groupdata-parser)
[![npm](https://img.shields.io/npm/v/tsv-groupdata-parser.svg)](https://www.npmjs.com/package/tsv-groupdata-parser)

Parses the translationNotes TSVs files to generate the GroupIndex and GroupData for the translationCore Desktop app.

## Usage

```js
  const filepath = '__tests__/fixtures/tsv/en_tn_57-TIT.tsv';
  const result = await tsvToGroupdata(filepath, "translationNotes");
    // or
  tsvToGroupdata(filepath, "translationNotes").then((data) => {
    const result = data;
  });
```

## Builds

Builds are made using babel 7 (babel-cli) for more infor see: [Babel CLI docs](https://babeljs.io/docs/en/babel-cli)
