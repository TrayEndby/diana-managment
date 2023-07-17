import { CATEGORY } from '../../service/GeneralSearchService';

const titles = {
  [CATEGORY.VIDEO]: 'Course Video',
  [CATEGORY.ESSAY]: 'Essay',
  [CATEGORY.ECA]: 'ECA Program',
  [CATEGORY.COLLEGE]: 'College(s)',
  [CATEGORY.PODCAST]: 'Podcast',
};

export const matchCategoryToTitle = (str) => {
  if (str in titles) {
    return titles[str];
  }

  const result = str.charAt(0).toUpperCase() + str.slice(1);
  return result.replace(/[^a-zA-Z ]/g, ' ');
};

export const getSections = (collegeSearch) => {
  if (collegeSearch) {
    return ['college'];
  } else {
    return ['college', 'video', 'essay', 'eca', 'resource:all'];
  }
};
