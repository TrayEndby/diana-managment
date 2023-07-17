import authService from '../../../service/AuthService';
import collabService from '../../../service/CollaborationService';

export const getNameById = (list, id) => {
  for (let item of list) {
    if (item.id === id) {
      return item.name;
    }
  }
  return '';
};

export const getStatusNameById = (id) => getNameById(collabService.getProjectStatusList(), id);

export const isMyProject = (project) => project && project.owner_id === authService.getUID();

export const isAllowJoin = (project) => {
  const ProjectStatus = collabService.getProjectStatus();
  return (
    project &&
    // !isMyProject(project) &&
    project.status !== ProjectStatus.Public
  );
};

export const isMemberWaitingApprove = (roleInfo) => {
  const MemberStatus = collabService.getMemberStatus();
  return roleInfo.status === MemberStatus.WaitingApproval;
};

export const isMyPost = (post) => post && post.creator_id === authService.getUID();

export const filterProjectsByKeyword = (projects, keyword) => {
  if (!keyword) {
    return projects;
  }
  keyword = keyword.toLowerCase();
  return projects.filter(({ name }) => name.toLowerCase().includes(keyword));
};

export const getRoleName = (roleInfo) => {
  roleInfo = roleInfo || {};
  const { role, status } = roleInfo;
  const RoleTypes = collabService.getRolTypes();
  if (role === RoleTypes.Owner) {
    return 'Owner';
  } else if (role === RoleTypes.Member) {
    const MemberStatus = collabService.getMemberStatus();
    return status === MemberStatus.WaitingApproval ? 'Member (Pending approval)' : 'Member';
  } else {
    return null;
  }
};

export const getProjectDisplayName = (project) => {
  const { name, status } = project;
  const ProjectStatus = collabService.getProjectStatus();
  if (status === ProjectStatus.Public) {
    return `${name} (Public)`;
  } else {
    return `${name} (Private)`;
  }
};
