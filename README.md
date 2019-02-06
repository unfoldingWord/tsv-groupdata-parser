# tsv-groupdata-parser

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