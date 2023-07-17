export const GRADES = [
  { text: 'Freshman', id: 9 },
  { text: 'Sophomore', id: 10 },
  { text: 'Junior', id: 11 },
  { text: 'Senior', id: 12 },
];

export const WEEKS = new Array(12)
  .fill([])
  .map((_, i) => [1, 2, 3, 4])
  .reduce((acc, cur, i) => [...acc, ...cur.map((week) => ({ month: i + 1, week }))], []);
