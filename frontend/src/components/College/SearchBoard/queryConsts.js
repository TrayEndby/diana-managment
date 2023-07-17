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
  general: {
    satMath: 0,
    satReadingAndWriting: 1,
    actMath: 2,
    actEnglish: 3,
    actCompose: 4,
    collegeTypes: 5, // Array of indexes
  },
  location: {
    campus: 6, // Array of indexes
  },
  chancing: {
    safety: 7,
    target: 8,
    reach: 9,
    minPercentage: 10,
    maxPercentage: 11,
  },
  academics: {
    bestByMajor: 12, // String
  },
  cost: {
    inStateTuition: 13,
    outStateTuition: 14,
  },
  sportsTeams: {
    menSports: 15, // Array of indexes
    womenSports: 16, // Array of indexes
  },
};
