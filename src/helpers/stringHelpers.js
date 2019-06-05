export function cleanQuoteString(quote) {
  return (
    quote
      // replace weird quotation marks with correct ones
      .replace(/\”/gi, '"')
      // .replace(/\“ /gi, '"')
      .replace(/\“/gi, '"')
      // remove spaces before question marks
      .replace(/\s+([?])/gi, '$1')
      // remove double spaces
      .replace(/  /gi, ' ')
      .trim()
    // ,\"
  )
}
