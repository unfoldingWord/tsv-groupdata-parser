export function cleanQuoteString(quote) {
  return (
    quote
      // replace weird closing quotation mark with correct one
      .replace(/\”/gi, '"')
      // remove space before opening quotation mark
      .replace(/\“ /gi, '"')
      // replace weird opening quotation mark with correct one
      .replace(/\“/gi, '"')
      // add space after
      .replace(/,\"/gi, ', "')
      // remove space after opening quotation mark
      .replace(/, \" /gi, ', "')
      // remove spaces before question marks
      .replace(/\s+([?])/gi, '$1')
      // remove double spaces
      .replace(/  /gi, ' ')
      // remove spaces before commas
      .replace(/ , /gi, ', ')
      // remove spaces before periods
      .replace(/ ."/gi, '."')
      // remove space before apostrophes
      .replace(/ ’./gi, '’.')
      .trim()
  )
}
