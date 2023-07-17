import AbstractService from './AbstractService';
import authService from './AuthService';
import fileUploadService, { Category } from './FileUploadService';
import calendarService from './CalendarService';

class CollaborationService extends AbstractService {
    constructor() {
        super();
        this.enums = null;
    }

    /** Enum Related apis
     * {
        "RoleType": {
            "None": 0, 
            "Admin": 2, 
            "Member": 4, 
            "Follower": 8, 
            "Liker": 16, 
            "Owner": 1
        }, 
        "MemberStatus": {
            "Deactivated": 64, 
            "Suspended": 32, 
            "Normal": 0,
            "WaitingApproval": 1
        }, 
        "ProjectStatus": {
            "Deactivated": 64, 
            "Public": 2, 
            "Normal": 0
        }
        }
    }, 
     */
    async fetchEnums() {
        if (!this.enums) {
            const res = await this.get('/project/const');
            this.enums = res.const_values;
        }
        return this.enums;
    }

    getRolTypes() {
        return this.enums.RoleType;
    }

    getMemberStatus() {
        return this.enums.MemberStatus;
    }

    getMemberStatusNameMap() {
        const MemberStatus = this.getMemberStatus();
        return {
            [MemberStatus.Deactivated]: 'Deactivated',
            [MemberStatus.Suspended]: 'Suspended',
            [MemberStatus.WaitingApproval]: 'Waiting approval',
            [MemberStatus.Normal]: 'Active',
        };
    }

    getProjectStatus() {
        return this.enums.ProjectStatus;
    }

    getProjectStatusList() {
        const projectStatus = this.getProjectStatus();
        return [
            {
                name: 'Private',
                id: projectStatus.Normal,
            },
            {
                name: 'Public',
                id: projectStatus.Public,
            },
        ];
    }

    /** Project related apis */
    /**
     * Project attrs:
     * eca_type number
     * name string
     * owner_id string
     * owner_name string
     * picture_id bytes
     * overview string
     * description string
     * tags string
     * status integer
     * created_ts: timestamp
     * updated_ts: timestamp
     */

    /**
     * Role attrs:
     * status: Enum of MemberStatus
     * role: Enum of RoleType
     */

    /**
     * Return a list of projects created by the user
     * Items are not returned for performance reasons, use get to get items from a specific project
     */
    async _getAllProjects() {
        const payload = await this.get('/project/list');
        const projects = payload.project || [];
        const roles = this._getRoleMap(payload.role || []);
        return [projects, roles];
    }

    _getRoleMap(roleList) {
        const map = {};
        roleList.forEach((role) => (map[role.project_id] = role));
        return map;
    }

    async getPublicProjects() {
        const [projects, roles] = await this._getAllProjects();
        const PROJECT_STATUS = this.getProjectStatus();
        const publicProjects = projects.filter(({ status }) => status === PROJECT_STATUS.Public);
        return [publicProjects, roles];
    }

    async getPublicProjectDetails(id) {
        let [projects, roles] = await this._getAllProjects();
        projects = projects.filter((project) => project.id === id);
        if (projects[0]) {
            const project = projects[0];
            const roleInfo = roles[project.id];
            return [project, roleInfo];
        } else {
            throw new Error('Cannot find project');
        }
    }

    async getMyProjects() {
        const [projects, roles] = await this._getAllProjects();
        const RolTypes = this.getRolTypes();
        const uid = authService.getUID();
        const myProjects = projects.filter(({ id, owner_id }) => {
            return owner_id === uid || (roles[id] && roles[id].role === RolTypes.Member);
        });
        return [myProjects, roles];
    }

    async getMyProjectDetails(id) {
        const data = {
            project: {
                id,
            },
        };
        const payload = await this.post('/project/get', data);
        const project = payload.project ? payload.project[0] : null;
        return project;
    }

    /**
     * data: {
     *  name: string,
     *  eca_type: number,
     *  status: string
     *  overview: string (optional),
     *  description: string (optional),
     * }
     */
    async createProject(data, pic) {
        const payload = await this.post('/project/add', {
            project: {
                ...data,
            },
        });
        const id = payload.project[0].id;
        if (pic) {
            try {
                const picture_id = await this._uploadPic(id, pic);
                await this.updateProject(id, {
                    ...data,
                    picture_id,
                });
            } catch (e) {
                console.error(e);
            }
        }
        await this._addProjectToCalendar(id, data.name);
    }

    /**
     * data structure is the same as creatProject
     */
    async updateProject(id, data, pic) {
        let picture_id = data.picture_id;
        if (pic) {
            picture_id = await this._uploadPic(id, pic);
        }
        return this.post('/project/update', {
            mode: 'update_project',
            project: {
                ...data,
                id,
                picture_id,
            },
        });
    }

    async deleteProject(project) {
        if (project.item) {
            for (let item of project.item) {
                await this.deletePost(project.id, item.id);
            }
        }
        if (project.member) {
            for (let member of project.member) {
                this.deleteMember(project.id, member.user_id);
            }
        }
        return this.post('/project/delete', {
            project: { id: project.id },
        });
    }

    /* Member related apis */
    /**
     * memberInfo: {
     *  user_id: string,
     *  name: string,
     *  role: number (from enums.RoleType),
     *  title: string
     * }
     */
    getMemberActions() {
        return {
            Deactivate: 'deactivate_member',
            Reactivate: 'reactivate_member',
            Suspend: 'suspend_member',
            Reinstate: 'reinstate_member',
            Delete: 'delete_member',
        };
    }

    async addMember(projectId) {
        return this.post('/project/update', {
            mode: 'add_member',
            project: {
                id: projectId,
                member: [
                    {
                        user_id: authService.getUID(),
                        role: this.getRolTypes().Member,
                        status: this.getMemberStatus().WaitingApproval,
                    },
                ],
            },
        });
    }

    async memberAction(action, projectId, memberId) {
        return this.post('/project/update', {
            mode: action,
            project: {
                id: projectId,
                member: [
                    {
                        user_id: memberId,
                    },
                ],
            },
        });
    }

    async deleteMember(projectId, memberId) {
        return this.post('/project/update', {
            mode: 'delete_member',
            project: {
                id: projectId,
                member: [
                    {
                        user_id: memberId,
                    },
                ],
            },
        });
    }

    async approveMember(projectId, memberInfo) {
        return this.post('/project/update', {
            mode: 'update_member',
            project: {
                id: projectId,
                member: [
                    {
                        ...memberInfo,
                        name: undefined,
                        status: this.getMemberStatus().Normal,
                    },
                ],
            },
        });
    }

    /* Post related apis */
    /*
     * id: number
     * creator_id: string
     * creator_name: string
     * project_id: integer
     * name: string
     * text: string
     * type: integer
     * status: integer
     * created_ts: string
     * updated_ts: string
     * parent_item: integer
     */

    async newPost(projectId, data) {
        return this.post('/project/update', {
            mode: 'add_item',
            project: {
                id: projectId,
                item: [
                    {
                        ...data,
                    },
                ],
            },
        });
    }

    async deletePost(projectId, postId) {
        return this.post('/project/update', {
            mode: 'delete_item',
            project: {
                id: projectId,
                item: [
                    {
                        id: postId,
                    },
                ],
            },
        });
    }

    async replyPost(projectId, postId, text) {
        return this.post('/project/update', {
            mode: 'add_item',
            project: {
                id: projectId,
                item: [
                    {
                        text,
                        parent_item: postId,
                    },
                ],
            },
        });
    }

    _getUploadName(id) {
        return `kyros-project-${id}`;
    }

    async _uploadPic(id, pic) {
        const name = this._getUploadName(id);
        return fileUploadService.upload(pic, name, Category.Project, true);
    }

    async _addProjectToCalendar(projectId, projectName) {
        try {
            await calendarService.addCalendar({
                name: `Project: ${projectName}`,
                description: 'Project Calendar',
                project_id: projectId
            });
        } catch (e) {
            console.error(e);
        }
    }
}

export default new CollaborationService();
