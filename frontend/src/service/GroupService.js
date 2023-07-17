import AbstractService from './AbstractService';
import calendarService from './CalendarService';

const GroupRole = {
    Regular: 0,
    Owner: 1,
    Creator: 2, // XXX TODO: verify
};

// Service to manage groups
class GroupService extends AbstractService {
    /**
     * GroupInfo
     * string name
     * string description
     * uint32 flag
     * uint32 status
     * @param {GroupInfo} grp
     * @param {boolean} createCalendar // create calendar for the group or not
     * @return grp with id
     */
    async create(grp, createCalendar) {
        const data = {
            mode: 'create_group',
            grp,
        };
        const payload = await this.post('/messaging', data);
        const res = payload.grp[0];
        if (createCalendar) {
            await this._addGroupToCalendar(res.id, grp.name);
        }
        return res;
    }

    /**
     *
     * @param {number} id
     */
    async deactivate(id) {
        const data = {
            mode: 'deactivate_group',
            grp: { id },
        };
        return this.post('/messaging', data);
    }

    async reactivate(id) {
        const data = {
            mode: 'reactivate_group',
            grp: { id },
        };
        return this.post('/messaging', data);
    }

    /**
     * GroupInfo
     * string name
     * string description
     * uint32 flag
     * uint32 status
     * @param {number} od
     * @param {GroupInfo} grp
     */
    async update(id, grp) {
        const data = {
            mode: 'update_group',
            grp: {
                ...grp,
                id,
            },
        };
        return this.post('/messaging', data);
    }

    /**
     *
     * @param {number} id
     * @return grp
     * id
     * name
     * description
     * created_ts
     * member
     *  role: this is the role of the user in the group.
     *  0 is a regular member, 1 is owner.
     */
    async list() {
        const data = {
            mode: 'get_group',
        };
        const payload = await this.post('/messaging', data);
        return payload.grp || [];
    }

    /**
     *
     * @param {number} id
     * @return grp
     * id
     * name
     * description
     * created_ts
     * member
     *  role: this is the role of the user in the group.
     *  0 is a regular member, 1 is owner.
     */
    async findGroup() {
        const data = {
            mode: 'get_public_group',
        };
        const payload = await this.post('/messaging', data);
        return payload.grp || [];
    }

    /**
     *
     * @param {number} id
     * @return member - list
     * string user_id
     * int32 role: 0 is a regular member, 1 is owner.
     * string user_name
     * string created_ts
     * string status_message
     * bool online
     */
    async listMembers(groupId) {
        const data = {
            mode: 'get_member',
            grp: {
                id: groupId,
            },
        };
        const payload = await this.post('/messaging', data);
        const grp = payload.grp ? payload.grp[0] : {};
        return grp.member || [];
    }

    /**
     *
     * @param {number} groupId
     * @param {string} user_id
     * @param {number} role 0 is a regular member, 1 is owner
     */
    async addMember(groupId, user_id, role) {
        const data = {
            mode: 'add_member',
            grp: {
                id: groupId,
                member: [
                    {
                        user_id,
                        role,
                    },
                ],
            },
        };
        return this.post('/messaging', data);
    }

    /**
     *
     * @param {number} groupId
     * @param {string} user_id
     */
    async deleteMember(groupId, user_id) {
        const data = {
            mode: 'delete_member',
            grp: {
                id: groupId,
                member: [
                    {
                        user_id,
                    },
                ],
            },
        };
        return this.post('/messaging', data);
    }

    /**
     *
     * @param {number} groupId
     * @param {string} user_id
     * @param {number} role 0 is a regular member, 1 is owner
     */
    async updateMember(groupId, user_id, role) {
        const data = {
            mode: 'update_member',
            grp: {
                id: groupId,
                member: [
                    {
                        user_id,
                        role,
                    },
                ],
            },
        };
        return this.post('/messaging', data);
    }

    async _addGroupToCalendar(groupId, name) {
        try {
            await calendarService.addCalendar({
                name,
                description: 'Group Calendar',
                group_id: groupId,
            });
        } catch (e) {
            console.error(e);
        }
    }
}

export default new GroupService();

export { GroupRole };
