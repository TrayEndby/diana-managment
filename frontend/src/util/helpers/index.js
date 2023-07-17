import moment from 'moment';
// function for helping to get Name from Id passed to TypeDropdown component
export const getNameFromId = (list, value) => list.find((item) => item.id === +value);

// function for helping parse params from the search part of url
export const parseSearchParams = (search) => {
  try {
    search = search.slice(1); // Remove leaded `?`
    return search
      .split('&')
      .map((i) => {
        let [key, value] = i.split('=');
        value = decodeURIComponent(value);
        value = !isNaN(value) ? +value : value;
        return { [key]: value };
      })
      .reduce((a, b) => Object.assign(a, b), {});
  } catch (e) {
    console.error(e);
    return {};
  }
};

export const utcToLocal = (time) =>
  moment.utc(time).local().calendar({
    lastWeek: '[Last] dddd',
  });

export const sortByDate = (arr) => {
  return arr.sort((a, b) => {
    const aa = new Date(a?.created_ts);
    const bb = new Date(b?.created_ts);
    return aa - bb;
  });
};

export const validateEmail = (email) => {
  if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
    return true;
  } else {
    return false;
  }
};

export const MONTHS = [
  '',
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const defer = () => {
  const deferred = {
    promise: null,
    resolve: null,
    reject: null
  };

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
};

export const getPathWithSearchParam = (path, history) => {
  if (history && history.location && history.location.search) {
    return `${path}${history.location.search}`;
  } else {
    return path;
  }
}

export const formatNumber = (num) => num && num.toLocaleString();
