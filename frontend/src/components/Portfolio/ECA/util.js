export const getHoursPerWeek = (avgMinutesPerEvent) => {
  let num_min = Number(avgMinutesPerEvent);
  if (!isNaN(num_min)) {
    return num_min / 60; // return hours
  } else {
    return '';
  }
};

export const getDateFromString = (date_string, name) => {
  if (!date_string) {
    return undefined;
  }
  const splits = date_string.split('/');
  if (splits.length !== 2) {
    throw new Error(`${name} error: Date must in the format of MM/YYYY.`);
  }
  const month = Number(splits[0]);
  const year = Number(splits[1]);
  if (!Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`${name} error: Invalid month.`);
  }
  if (!Number.isInteger(year) || year < 1000 || year > 9999) {
    throw new Error(`${name} error: Invalid year.`);
  }
  return `${year}-${month}-15`; // use 15th day
};

export const parseDateToString = (date) => {
  if (!date) {
    return '';
  }

  try {
    const [year, month] = date.split('-');
    return `${month}/${year}`;
  } catch {
    return date;
  }
};
