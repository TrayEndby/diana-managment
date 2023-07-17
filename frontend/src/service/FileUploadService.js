import AbstractService from './AbstractService';
import authService from './AuthService';

export const Category = {
    Profile: 'profile-image',
    Project: 'project-image',
    MessageMedia: 'message-media'
};

class FileUploadService extends AbstractService {
    constructor() {
        super();
        this.idCache = {};
        this.urlCache = {};
    }

    /**
     * @returns {number} id
     */
    async upload(file, name, category, bePublic) {
        const formData = new FormData();
        formData.set('category', category);
        formData.set('name', name);
        formData.append('file', file);
        if (bePublic) {
            formData.set('public', 1);
        }
        const payload = await this.uploadPic('/upload', formData);
        this._clearURLCache(category, name);
        return payload.id;
    }

    /**
     * category: profile-image, project-image
     */
    async delete(name, category) {
        this._clearURLCache(category, name);
        return this.get('/delete', { category, name });
    }

    /**
     * 
     * @param {*} category 
     * @param {*} user_id 
     * @param {*} name 
     * @param {*} AUTH_UID (optional) for public access to use
     */
    async download(category, user_id, name, AUTH_UID) {
        if (name == null) {
            return null;
        }
        const url = this._getDownloadURL(category, user_id, name);
        if (this.urlCache[url] === undefined) {
            try {
                this.urlCache[url] = await this._download(url, AUTH_UID);
            } catch (e) {
                console.error(e);
                this.urlCache[url] = null;
            }
        }
        return this.urlCache[url];
    }

    /**
     * 
     * @param {*} category 
     * @param {*} user_id 
     * @param {*} name 
     * @param {*} AUTH_UID (optional) for public access to use
     */
    async publicImageDownload(category, user_id, name, AUTH_UID) {
        if (name == null) {
            return null;
        }
        const url = this._getPublicImageDownloadURL(category, user_id, name);
        if (this.urlCache[url] === undefined) {
            try {
                this.urlCache[url] = await this._download(url, AUTH_UID);
            } catch (e) {
                console.error(e);
                this.urlCache[url] = null;
            }
        }
        return this.urlCache[url];
    }

    async downloadById(id) {
        if (id == null) {
            return null;
        }
        if (this.idCache[id] === undefined) {
            try {
                const data = await this._download(`/download?id=${id}`);
                this.idCache[id] = data;
            } catch (e) {
                console.error(e);
                this.idCache[id] = null;
            }
        }
        return this.idCache[id];
    }

    async _download(url, AUTH_UID) {
        const response = await this.downloadPic(url, AUTH_UID);
        const base64 = Buffer.from(response.data, 'binary').toString('base64');
        return `data:image/jpeg;base64,${base64}`;
    }

    _getDownloadURL(category, user_id, name) {
        return `/download?category=${category}&user_id=${user_id}&name=${name}`;
    }

    _getPublicImageDownloadURL(category, user_id, name) {
        return `/p/download/image?category=${category}&user_id=${user_id}&name=${name}`;
    }

    async _clearURLCache(category, name) {
        const url = this._getDownloadURL(category, authService.getUID(), name);
        delete this.urlCache[url];
    }
}

export default new FileUploadService();
