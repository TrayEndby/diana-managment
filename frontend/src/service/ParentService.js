import AbstractService from './AbstractService';

class ParentService extends AbstractService {
    async listParentIncomeLvl() {
        const payload = await this.post('/profile/list', {
            mode: 25,
        });
        return payload.nameIds;
    }

    async listParentExpertiseType() {
        const payload = await this.post('/profile/listParentExpertiseType', {});
        return payload?.nameIds || [];
    }

    async getExpertise() {
        const payload = await this.post('/profile/getParentExpertise', {});
        return payload?.parentExpertise || [];
    }

    /**
     * @param {data} data // data[{expertise: number}, {expertise: number}]
     */
    async parentExpertiseInsert(data) {
        const payload = await this.post('/profile/parentExpertiseInsert', { parentExpertise: data });
        return payload || {}
    };

    /**
     * @param {data} data // data[{id: number, expertise: number}, {id: number, expertise: number}]
     */
    async parentExpertiseUpdate(data) {
        const payload = await this.post('/profile/parentExpertiseUpdate', { parentExpertise: data });
        return payload || {}
    };

    /**
     * @param {data} data // data[{expertise: number}, {expertise: number}]
     */
    async parentExpertiseDeleteById(data) {
        const payload = await this.post('/profile/parentExpertiseDeleteById', { parentExpertise: data });
        return payload || {}
    };

    async getChildren() {
        const payload = await this.post('/profile/parentListChildren', {});
        return payload?.child || [];
    }

    /**
     * @param {data} data // data[{name: string, email: string}, {name: string, email: string}]
    */
    async parentInsertOrUpdateChildren(data) {
        const payload = await this.post('/profile/parentInsertOrUpdateChildren', { child: data });
        return payload
    };

    /**
     * @param {data} data // data[{name: string, email: string}, {name: string, email: string}]
    */
    async parentDeleteChildren(data) {
        const payload = await this.post('/profile/parentDeleteChildren', { child: data });
        return payload
    };

}

export default new ParentService();
