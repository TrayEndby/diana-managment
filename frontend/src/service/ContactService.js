import AbstractService from './AbstractService';

class ContactService extends AbstractService {
    constructor() {
        super();
        this.contactListCache = null;
    }

    /** Contact management apis */
    /**
     * Contact contact
     * string contact_id
     * string tags
     * uint32 status
     */

    /**
     * Add contact
     * @param {string} contact_id
     * @param {number} status (optional)
     * @param {string[]} tags (optional)
     */
    async addContact(contact_id, status, tags) {
        const data = {
            mode: 'contact_add',
            contact: {
                contact_id,
                status,
                tags,
            },
        };
        await this.post('/messaging', data);
        this._deleteContactListCache();
    }

    /**
     * Update contact
     * @param {string} contact_id
     * @param {number} status (optional)
     * @param {string[]} tags (optional)
     */
    async updateContact(contact_id, status, tags) {
        const data = {
            mode: 'contact_update',
            contact: {
                contact_id,
                status,
                tags,
            },
        };
        await this.post('/messaging', data);
        this._deleteContactListCache();
    }

    /**
     * Delete contact
     * @param {string} contact_id
     */
    async deleteContact(contact_id) {
        const data = {
            mode: 'contact_delete',
            contact: {
                contact_id,
            },
        };
        await this.post('/messaging', data);
        this._deleteContactListCache();
    }

    /**
     * List contact
     * @return
     * Contact
     *  contact_id: string,
     *  email: string,
     *  name: string
     */
    async listContact() {
        if (this.contactListCache == null) {
            const data = {
                mode: 'contact_list',
            };
            const payload = await this.post('/messaging', data);
            this.contactListCache = payload.contact || [];
        }
        return this.contactListCache;
    }

    _deleteContactListCache() {
        this.contactListCache = null;
    }
}

export default new ContactService();
