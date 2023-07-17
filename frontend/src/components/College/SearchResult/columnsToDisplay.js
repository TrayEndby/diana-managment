import collegeService from '../../../service/CollegeService';

const majors = collegeService.listMajors().map((major) => {
  return {
    ...major,
    category: 'Major Rankings',
  };
});

let hasCache = false;
let columnsToDisplay = [
  { key: 'name', text: 'Name', category: '' },
  { key: 'status_str', text: 'Status' },
  { key: 'city', text: 'City' },
  { key: 'state', text: 'State' },
  { key: 'evaluation', text: 'Admission difficulty' },
  { key: 'inStateTuition', text: 'In state tuition', category: 'Cost' },
  { key: 'outStateTuition', text: 'Out state tuition', category: 'Cost' },
  ...majors,
];

const fetchColumnsToDisplay = async () => {
  try {
    const sports = await collegeService.listSportsAsync();
    const menSports = sports.map(({ id, name }) => {
      return {
        key: `MenSports-${id}`,
        text: `(Men) ${name}`,
        category: "Sports"
      }
    });
    const womenSports = sports.map(({ id, name }) => {
      return {
        key: `WomenSports-${id}`,
        text: `(Women) ${name}`,
        category: "Sports"
      }
    });
    columnsToDisplay = [...columnsToDisplay, ...menSports, ...womenSports];
    return true;
  } catch(e) {
    console.error(e);
    return false;
  }
}

const getColumnsToDisplay = async () => {
  if (!hasCache) {
    hasCache = await fetchColumnsToDisplay();
  }
  return columnsToDisplay;
};

export default getColumnsToDisplay;
