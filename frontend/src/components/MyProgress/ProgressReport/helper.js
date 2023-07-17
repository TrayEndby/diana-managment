export const getCurrentMonth = () => new Date().getMonth() + 1;

/**
 *
 * @param {number} s Length of sequence
 */
export const range = (s) => new Array(s).fill(0).map((_, i) => i);

/**
 *
 * @param {number} m Month
 */
export const getMonth = (m) => {
  let fixedMax = m > 12 ? m - 12 : m;
  return fixedMax <= 0 ? 12 + fixedMax : fixedMax;
};
