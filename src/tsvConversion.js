
/**
 * conver array of Reference chunks to reference string
 * @param {string} tsv - data in 9 column format
 * @return {string}
 */
export function convertTsv9to7(tsv) {
  let tsvObjects;

  try {
    tsvObjects = tsvtojson_(tsv);
  } catch (e) {
    console.error(`convertTsv9to7() - could not convert TSV data to json"`, e);
    tsvObjects = null;
  }

  if (Array.isArray(tsvObjects)) {
    ??
  } else {
    console.error(`convertTsv9to7() - invalid tsv data"`);
    tsvObjects = null;
  }

  return tsvObjects;
}

/**
 * convert tsv data to json objects
 *  taken from tsvtojson - with fs.readFileSync removed
 * @param tsv
 * @param headers
 * @param splitString
 * @returns {*[]}
 */
export const tsvtojson_ = (tsv, headers, splitString) => {
  let header = headers || [];
  let json = [];
  let splitString_ = splitString || '\n';
  tsv.split(splitString_).forEach((line, index) => {
    if (!index && !header.length) {
      header = line.split('\t');
    } else {
      let obj = {};
      line.split('\t').forEach((value, index) => {
        value ? (obj[header[index]] = value) : '';
      });
      Object.keys(obj).length ? json.push(obj) : '';
    }
  });
  return json;
};
