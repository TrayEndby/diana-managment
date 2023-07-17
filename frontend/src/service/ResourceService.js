import AbstractService from './AbstractService';

const Resource_Type = {
    Article: 1,
    Podcast: 2,
    Sprint: 5,
    FQA: 9,
};

class ResourceService extends AbstractService {
    /**
     * list resources
     * Resource resource
     *  uint32 type - type can be used to retrieve desired resources
     * @param {Resource_Type} type
     * @return
     * repeated Resource resource
     *  uint64 id
     *  string title
     *  string source
     *  string tags (podcast only)
     *  uint32 type (podcast only)
     *  uint32 flag (podcast only)
     *  uint64 picture_id (podcast only)
     *  string image_url (podcast only)
     *  string url (podcast only)
     *  uint64 object_id (podcast only)
     *  string source_ts (podcast only)
     */
    async list(type) {
        const data = {
            resource: {
                type,
            },
        };
        const payload = await this.post('/resources/list', data);
        const total_results = payload.total_results;
        const resource = payload.resource || [];
        return [this._normalizeResources(type, resource), total_results];
    }

    /**
     * search resources
     * Request
     * string query
     * uint32 from
     * Resource resource
     * uint32 type - type can be used for filtering
     * @param {Resource_Type} type
     * @param {string} query
     * @param {number} from
     * @return
     * repeated Resource resource
     *  uint64 id
     *  string title
     *  string source
     *  string description
     *  string tags (podcast only)
     *  uint32 type (podcast only)
     *  uint32 flag (podcast only)
     *  uint64 picture_id (podcast only)
     *  string image_url (podcast only)
     *  string url (podcast only)
     *  uint64 object_id (podcast only)
     *  string source_ts (podcast only)
     */
    async search(type, query, from) {
        const data = {
            resource: {
                type,
            },
            query: query.trim(),
            from,
        };
        const payload = await this.post('/resources/search', data);
        const total_results = payload.total_results;
        const resource = payload.resource || [];
        return [this._normalizeResources(type, resource), total_results];
    }

    /**
     * get a detailed info about a resource
     * @param {Resource_Type} type
     * @param {number} id
     * @return
     * Resource
     *  uint64 id
     *  string title
     *  string description
     *  string tags
     *  string source
     *  uint32 type
     *  uint32 flag
     *  uint64 picture_id
     *  string image_url
     *  string url
     *  uint64 object_id
     *  string source_ts
     */
    async getDetail(type, id) {
        const data = {
            resource: {
                id,
            },
        };
        const payload = await this.post('/resources/get', data);
        const resource = payload.resource ? payload.resource[0] : null;
        if (resource == null) {
            return null;
        } else {
            return this._normalizeResources(type, [resource])[0];
        }
    }

    _normalizeResources(type, resources) {
        if (type === Resource_Type.Podcast) {
            // add isSoundCloud field
            return resources.map((resource) => {
                return {
                    ...resource,
                    isSoundCloud: this._isSoundCloud(resource.url),
                };
            });
        } else {
            return resources;
        }
    }

    _isSoundCloud(url) {
        if (!url || url.includes('.mp3') || url.includes('.m4a') || url.includes('.wav')) {
            return false;
        } else {
            return true;
        }
    }
}

export default new ResourceService();

export { Resource_Type };
