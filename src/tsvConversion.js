import {
  HARD_NL,
  HTML_BREAK,
  HTML_BREAK2,
  trimWhiteSpace,
} from './tsvToGroupData';

/**
 *
 * @param {array} errors
 * @param {string} message
 * @param {string} line
 * @param {number} lineNum
 */
function appendErrors(errors, message, line = null, lineNum = -1) {
  let msg = message;

  if (line) {
    msg += `, in line ${lineNum}: ${line}`;
  }

  console.log(msg);
  errors.push(msg);
}

/**
 * trim white space from value
 * @param value
 * @returns {*}
 */
function trimValue(value) {
  if (typeof value === 'string') {
    value = value.replaceAll(HARD_NL, '\n');
    value = trimWhiteSpace(value);
  }

  return value;
}

/**
 * trim each of the fields of leading and trailing white space
 * @param obj
 * @param keys
 */
function trimKeys(obj, keys) {
  for (const key of keys) {
    let value = obj[key];
    let newValue = (value === null) || (value === undefined) ? '' : value;

    if (value) {
      newValue = trimValue(value);
    }

    if (newValue !== value) {
      obj[key] = newValue;
    }
  }
}

/**
 * convert array of Reference chunks to reference string
 * @param {string} tsv - data in 9 column format
 * @returns {{tsvObjects: *[], errors: (string|null)}}
 */
export function convertTsv9to7(tsv) {
  let tsvObjects;
  const errors = [];
  let line;
  let lineNum;

  try {
    tsvObjects = tsvtojson_(tsv);
  } catch (e) {
    const msg = `convertTsv9to7() - could not convert TSV data to json: "` + e.toString();
    appendErrors(errors, msg);
    tsvObjects = null;
  }

  try {
    if (tsvObjects && Array.isArray(tsvObjects) && tsvObjects.length) {
      const lines = tsv.split('\n');
      const line0 = lines[0];
      const fields = line0.split('\t');

      const expectedFields = ['Book', 'Chapter', 'Verse', 'ID', 'SupportReference', 'OrigQuote', 'Occurrence', 'GLQuote', 'OccurrenceNote'];
      let missingFields = false;
      let extraFields = false;

      for (const expected of expectedFields) {
        if (!fields.includes(expected)) {
          const msg = `missing field '${expected}' in header`;
          appendErrors(errors, msg);
          missingFields = true;
        }
      }

      for (const field of fields) {
        if (!expectedFields.includes(field)) {
          const msg = `extra field '${field}' in header`;
          appendErrors(errors, msg);
          extraFields = true;
        }
      }

      if (fields.length !== expectedFields.length) {
        line = line0;
        lineNum = 1;
        throw `Number of columns should be ${expectedFields.length}, but ${fields.length} columns found`;
      }

      if (missingFields || extraFields) {
        line = line0;
        lineNum = 1;
        throw `Invalid Field names in header`;
      }

      for (let i = 0, l = tsvObjects.length; i < l; i++) {
        // keep track of current line for error reporting
        line = lines[i + 1];
        lineNum = i + 2;

        const tsvObject = tsvObjects[i];
        trimKeys(tsvObject, expectedFields);
        // console.log(i, tsvObject, tsv[i + 1]);
      }
    } else {
      throw `convertTsv9to7() - invalid tsv data, could not parse`;
    }
  } catch (e) {
    const msg = e.toString();
    appendErrors(errors, msg, line, lineNum);
    tsvObjects = null;
  }
  return {
    tsvObjects,
    errors: errors ? errors.join('\n') : null,
  };
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
        // eslint-disable-next-line no-unused-expressions
        value ? (obj[header[index]] = value) : '';
      });

      // eslint-disable-next-line no-unused-expressions
      Object.keys(obj).length ? json.push(obj) : '';
    }
  });
  return json;
};
