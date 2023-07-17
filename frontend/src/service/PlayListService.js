import AbstractService from './AbstractService';

class PlayListService extends AbstractService {
    /**
     * Type 0 = Video (default)
     * Type 1 = Essay
     * Type 2 = ECA
     *
     * Return an array of playlist
     * Attribute of each playlist:
     * id: string
     * name: string
     * created_ts: string
     */
    async list(type = 0) {
        let data = {
            type,
        };
        let payload = await this.post('/playlist/get', data);
        return payload.list || [];
    }

    /**
     * Return an array of video playlist
     */
    async listVideos() {
        return this.list(0);
    }

    /**
     * Return an array of essay playlist
     */
    async listEssays() {
        return this.list(1);
    }

    /**
     * Return an array of ECA playlist
     */
    async listECAs() {
        return this.list(2);
    }

    /**
     * Return an array of ECA playlist
     */
    async listEducators() {
        return this.list(3);
    }

    /**
     * Type 0 = Video (default)
     * Type 1 = Essay
     * Type 2 = ECA
     * Type 3 = Educators
     *
     * Return a play list with Attribute:
     * id: string,
     * name: string,
     * tag: string[],
     * item: [{
     *  title: string,
     *  url: string
     * }]
     */
    async getPlayListById(type, id) {
        let data = {
            type,
            list: { id },
        };
        let payload = await this.post('/playlist/get', data);
        let list = payload.list;
        if (!list || list.length === 0) {
            throw new Error("List doesn't exist");
        }
        return list[0];
    }

    async getVideoListById(id) {
        return this.getPlayListById(0, id);
    }

    async getEssayListById(id) {
        return this.getPlayListById(1, id);
    }

    async getECAListById(id) {
        return this.getPlayListById(2, id);
    }

    async getEducatorsListById(id) {
        return this.getPlayListById(3, id);
    }

    /**
     * add a new playlist
     * Type 0 = Video (default)
     * Type 1 = Essay
     * Type 2 = ECA
     * Parameters:
     * name: string,
     * item (Optional): {
     *  title: string,
     *  url: string,
     *  video: {vid: string} or
     *  essay: {id: string} or
     *  eca_program: {id: string} or
     * }[],
     * tag?: string[] (not used, yet)
     */
    async add(type, name, item, tag) {
        let data = {
            type,
            list: {
                name,
                tag,
                item,
            },
        };
        return await this.post('/playlist/add', data);
    }

    async addVideoList(name, item) {
        return this.add(0, name, item);
    }

    async addEssayList(name, item) {
        return this.add(1, name, item);
    }

    async addECAList(name, item) {
        return this.add(2, name, item);
    }

    async addEducatorList(name, item) {
        return this.add(3, name, item);
    }

    /**
     * delete playlist by id
     */
    async delete(id) {
        let data = {
            list: { id },
        };
        return await this.post('/playlist/delete', data);
    }

    async rename(id, newName) {}

    /**
     * Add item to a playlist
     * @param {string} id
     * @param {object[]} item {title: string, url: string, video: {vid: string}}[]
     *
     */
    async addItem(id, item) {
        let data = {
            mode: 'add_item',
            list: {
                id,
                item,
            },
        };
        return await this.post('/playlist/update', data);
    }

    /**
     * Add item to a playlist
     * @param {string} id
     * @param {object[]} item {title: string, url: string, video: {vid: string}}[]
     *
     */
    async deleteItem(id, item) {
        let data = {
            mode: 'delete_item',
            list: {
                id,
                item,
            },
        };
        return await this.post('/playlist/update', data);
    }
}

window.PlayListService = new PlayListService();

export default new PlayListService();
