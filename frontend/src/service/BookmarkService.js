import AbstractService from './AbstractService';

/**
 * General structure of the bookmark item structure:
 * id: integer (optional, no need to set)
 * name: string;
 * flag: integer (optional)
 * tag: string[] (optional)
 * item: {title: string (optional) content: string, flag: string (optional)}[]
 * created_ts: string (optional: no need to set)
 */
class BookmarkService extends AbstractService {
    /**
     * list all bookmarks
     */
    async list() {
        const payload = await this.post('/bookmark/get');
        return payload.list || [];
    }

    /**
     * For return structure the general structure of the service
     */
    async getByName(name) {
        const data = {
            list: {
                name,
            },
        };
        const payload = await this.post('/bookmark/get', data);
        return this._returnOneItem(payload.list);
    }

    /**
     * For return structure the general structure of the service
     */
    async getById(id) {
        const data = {
            list: {
                id,
            },
        };
        const payload = await this.post('/bookmark/get', data);
        return this._returnOneItem(payload.list);
    }

    /**
     * item (e.g. [{"title": "section1", "content": "json"}]})
     * tag (optional, e.g. ["profile"])
     */
    async add(name, item) {
        const data = {
            list: {
                name,
                item,
            },
        };
        return this.post('/bookmark/add', data);
    }

    async delete(id) {
        const data = {
            list: {
                id,
            },
        };
        return this.post('/bookmark/delete', data);
    }

    async rename(id, name) {
        const data = {
            mode: 'rename_list',
            list: {
                id,
                name,
            },
        };
        return this.post('/bookmark/update', data);
    }

    /**
     * item (e.g. [{"title": "section1", "content": "json"}])
     */
    async addItem(id, item) {
        const data = {
            mode: 'add_item',
            list: {
                id,
                item,
            },
        };
        return this.post('/bookmark/update', data);
    }

    /**
     * item (e.g. {"title": "item1", "content": "item1 content"})
     */
    async updateItem(id, item) {
        const data = {
            mode: 'update_item_content',
            list: {
                id,
                item: [item],
            },
        };
        return this.post('/bookmark/update', data);
    }

    async deleteItem(id, title) {
        const data = {
            mode: 'delete_item',
            list: {
                id,
                item: [{ title }],
            },
        };
        return this.post('/bookmark/update', data);
    }

    _returnOneItem(list) {
        list = list || [];
        if (list.length === 0) {
            return null;
        } else if (list.length === 1) {
            return list[0];
        } else {
            throw new Error('Multiple key exist');
        }
    }
}

export default new BookmarkService();
