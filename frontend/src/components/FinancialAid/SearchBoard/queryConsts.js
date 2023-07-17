/**
 * Open/closed principle
 * This const should be open for extension, but closed for modification
 * Only for adding new keys. Don't change and don't delete anything.
 */

/**
 *
 * @param {number} index
 * @param {string|number} value
 */
export const createQueryParemeter = (index, value) => encodeURI(`${JSON.stringify(index)}=${JSON.stringify(value)}&`);

/**
 *
 * @param {string} search
 */
export const parseSearch = (search) => {
  if (search[0] === '?') {
    search = search.slice(1);
  }

  const result = search
    .split('&')
    .filter(Boolean)
    .map((i) => {
      let [key, value] = i.split('=').map(decodeURI).map(JSON.parse);
      return { [key]: value };
    })
    .reduce((a, b) => ({ ...a, ...b }), {});

  return result;
};

export default {
  residency: 1,
  award_type: 2,
  qualified_institution: 3,
  qualified_study: 4,
  award_amount: 5
};
