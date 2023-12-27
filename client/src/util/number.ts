
// returns null if not a number
export function convertToNumber(maybeNum: number | string): number | null {
  if (typeof maybeNum === 'number') return maybeNum
  if (typeof maybeNum === 'string') {
    if (maybeNum.length > 0) {
      const numFromStr: number = Number(maybeNum)
      // if number conversion was successful
      if (!isNaN(numFromStr)) {
        return numFromStr
      }
    }
  }
  return null
}
