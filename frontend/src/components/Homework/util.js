import { Status } from './enums';
import homeworkService, { Flag } from 'service/HomeworkService';
import userProfileSearchService from 'service/UserProfileSearchService';
import * as ROUTES from 'constants/routes';
import { PROFILE_TYPE } from 'constants/profileTypes';

export const getSelectedHomeworkIds = (items) => {
  return items.filter((item) => item.selected).map((item) => item.id);
};

export const hasSelected = (items) => {
  return getSelectedHomeworkIds(items).length > 0;
};

export const isInstructor = () => {
  const profile = userProfileSearchService.getProfile();
  const userType = profile?.basic?.type || [];
  return userType.includes(PROFILE_TYPE.ContentCreator);
};

export const normalizeInstructorHomeworks = ({
  publicArticles,
  allArticles,
}) => {
  const folder = [];
  folder.push(_getInstructorAssignment(publicArticles));
  const submitted = allArticles.filter((article) => article.share_type != null);
  folder.push(_getInstructorSubmitted(submitted));
  return folder;
};

export const normalizeUserHomeworks = (
  { publicArticles, allArticles },
  sharedUsersMap,
) => {
  const folder = [];
  const myHomeworks = allArticles.filter(
    (article) => article.share_type == null,
  );
  const myPrivateHomeworks = myHomeworks.filter(
    ({ flag }) => flag !== Flag.Published && flag !== Flag.Public,
  );
  folder.push(_getUserMy(myPrivateHomeworks, sharedUsersMap));
  folder.push(_getUserAll(publicArticles, myPrivateHomeworks));
  return folder;
};

const _normalizeHomework = (item, front_end_status) => {
  return {
    ...item,
    selected: false,
    front_end_status,
  };
};

const _getInstructorAssignment = (homeworks) => {
  const [sprints, idToProgramMap] = homeworkService.getSprints();
  if (homeworks.length > 0) {
    homeworks.forEach((homework) => {
      const program = idToProgramMap.get(homework.event_id);
      if (program) {
        const status =
          homework.flag === Flag.Public
            ? Status.COACH_DRAFT
            : Status.COACH_PUBLISHED;
        program.homeworks.push(_normalizeHomework(homework, status));
      }
    });
  }

  return {
    name: 'Homework folders',
    path: ROUTES.HOMEWORK_ADMIN_ASSIGNMENT,
    children: sprints,
  };
};

const _getInstructorSubmitted = (homeworks) => {
  let children = [];
  if (homeworks.length > 0) {
    const [sprints, idToProgramMap] = homeworkService.getSprints();
    children = sprints;
    homeworks.forEach((homework) => {
      const program = idToProgramMap.get(homework.event_id);
      if (program) {
        program.homeworks.push(
          _normalizeHomework(homework, Status.COACH_TO_REVIEW),
        );
      }
    });
  }

  children = _excludeEmptySprints(children);

  return {
    name: 'Submitted homework',
    path: ROUTES.HOMEWORK_ADMIN_SUBMITTED,
    children,
  };
};

const _getUserMy = (homeworks, sharedUsersMap) => {
  let children = [];
  if (homeworks.length > 0) {
    const [sprints, idToProgramMap] = homeworkService.getSprints();
    children = sprints;
    homeworks.forEach((homework) => {
      const program = idToProgramMap.get(homework.event_id);
      if (program) {
        const status = _isSharedToInstructors(
          sharedUsersMap.get(homework.id),
          program.instructor,
        )
          ? Status.USER_SHARED
          : Status.USER_DRAFT;
        program.homeworks.push(_normalizeHomework(homework, status));
      }
    });

    children = _excludeEmptySprints(children);
  }

  return {
    name: 'My homework',
    path: ROUTES.HOMEWORK_USER_MY,
    children,
  };
};

const _getUserAll = (homeworks, myHomeworks) => {
  let children = [];
  if (homeworks.length > 0) {
    const [sprints, idToProgramMap] = homeworkService.getSprints();
    children = sprints;
    const programTitleMap = new Map();
    myHomeworks.forEach(({ title, event_id }) => {
      let titleSet;
      if (!programTitleMap.has(event_id)) {
        titleSet = new Set();
        programTitleMap.set(event_id, titleSet);
      } else {
        titleSet = programTitleMap.get(event_id);
      }
      titleSet.add(title)
    });

    homeworks.forEach((homework) => {
      const event_id = homework.event_id;
      const program = idToProgramMap.get(event_id);
      if (program) {
        const titleSet = programTitleMap.get(event_id);
        const status = titleSet && titleSet.has(homework.title)
          ? Status.USER_COPIED
          : Status.USER_READY_FOR_COPY;
        program.homeworks.push(_normalizeHomework(homework, status));
      }
    });
  }

  return {
    name: 'All homework',
    path: ROUTES.HOMEWORK_USER_ALL,
    children,
  };
};

const _isSharedToInstructors = (sharedUsers, instructors) => {
  if (!sharedUsers) {
    return false;
  }
  for (let instructor of instructors) {
    if (sharedUsers.has(instructor.id)) {
      return true;
    }
  }
  return false;
};

const _excludeEmptySprints = (sprints) => {
  return sprints.filter((sprint) => {
    sprint.children = sprint.children.filter(
      (program) => program.homeworks.length > 0,
    );
    return sprint.children.length > 0;
  });
};
