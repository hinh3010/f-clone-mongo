/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */

export const pick = (
  object: Record<string, any>,
  keys: string[],
  searchField: string | undefined = 'search'
): object => {
  return keys
    .concat(searchField)
    .reduce((obj: Record<string, any>, key: string) => {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        if (searchField === key) {
          obj.$text = { $search: object[key] }
        } else {
          obj[key] = object[key]
        }
      }
      return obj
    }, {})
}
