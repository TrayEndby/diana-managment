import AbstractService from './AbstractService';
import authService from './AuthService';
import userProfileSearchService from './UserProfileSearchService';

const ShareType = {
    Read: 1,
    Comment: 3,
    Edit: 7,
};

class WritingService extends AbstractService {
    /*** Composing related apis ****/

    /**
     * List all articles
     * Articles:
     * [{
     *  id: number
     *  user_id: string  - the owner of the article
     *  user_name: string
     *  title: string
     *  type: string
     *  flag: integer
     *  share_type: integer - if it is shared article
     *  updated_ts: string
     * }]
     */
    async list() {
        const payload = await super.get('/compose/list');
        return payload.list || [];
    }

    async listPublic() {
        const payload = await super.get('/compose/list_public');
        return payload.list || [];
    }

    /**
     * Create new article
     * @param {string} title
     * @return {number} id Return article id
     */
    async create(title, extraArgs) {
        const data = {
            article: {
                title,
                ...extraArgs,
            },
        };
        const payload = await this.post('/compose/insert_or_update', data);
        return payload.article.id;
    }

    /**
     * Get an article given an id
     * article includes
     *  id
     *  title
     *  updated_ts
     *  delta: [{ ops, updated_ts }]
     *  comments (added from list comments api)
     * @param {number} id
     */
    async get(id) {
        const data = { article: { id } };
        const payload = await this.post('/compose/get', data);
        const article = payload.article;
        if (article == null) {
            return null;
        }
        const { delta, user_id } = article;
        let diffs = [];
        if (delta != null) {
            diffs = delta.map((oneDelta) => {
                return JSON.parse(oneDelta.ops);
            });
        }
        // const comments = await this._getComment(id);
        let user = "";
        const shared = user_id !== authService.getUID();

        if (shared) {
            user = await this._getUserNameById(user_id);
        }

        return {
            ...article,
            diffs,
            comments: [],
            shared,
            user
        };
    }

    async _getUserNameById(id) {
        try {
            const profile = await userProfileSearchService.fetchPublicProfile(id);
            const { firstName, lastName } = profile;
            return `${firstName} ${lastName}`;
        } catch (e) {
            console.error(e);
            return "";
        }
    }

    async update(id, title, ops) {
        const ops_str = JSON.stringify(ops);
        const ops_escaped_str = ops_str
            // .replace(/\\n/g, '\\\\n')
            // .replace(/\\'/g, "\\\\'")
            // .replace(/\\"/g, '\\\\"')
            // .replace(/\\&/g, '\\\\&')
            // .replace(/\\r/g, '\\\\r')
            // .replace(/\\t/g, '\\\\t')
            // .replace(/\\b/g, '\\\\b')
            // .replace(/\\f/g, '\\\\f');
        const data = {
            article: {
                id,
                title,
                delta: [{ ops: ops_escaped_str }],
            },
        };
        return this.post('/compose/insert_or_update', data);
    }

    /**
     * Delete an article by id
     * @param {number} id
     */
    async delete(id) {
        const data = { article: { id } };
        return this.post('/compose/delete', data);
    }

    async copy(ids) {
        const data = { id_to_copy: ids };
        return this.post('/compose/copy', data);
    }

    /*** End of composing related apis ****/

    /*** Version related apis ****/
    /**
     * get a list of versions given an article
     * @param {number} id
     * Return
     * Article article
     *  repeated ArticleDelta delta
     *  string updated_ts
     */
    async listVersions(id) {
        const data = { article: { id } };
        const payload = await this.post('/compose/versions', data);
        const delta = payload.article?.delta;
        return delta || [];
    }

    /**
     * Revert article to an version
     * @param {number} id
     * @param {string} timestamp
     */
    async revert(id, timestamp) {
        const data = {
            article: {
                id,
                updated_ts: timestamp,
            },
        };
        return this.post('/compose/revert', data);
    }
    /*** End of version related apis ****/

    /*** Sharing related apis ****/
    /**
     * Share article with a user
     * @param {number} article_id
     * @param {string} user_id
     * @param {ShareType} type
     */
    async share(article_id, user_id, type) {
        const data = {
            share: {
                article_id,
                user_id,
                type,
            },
        };
        return this.post('/compose/insert_or_update_share', data);
    }

    /**
     * List article's shared users
     * @param {number} article_id
     * Return
     * repeated Share share
     *  string user_id
     *  string user_name
     *  uint32 type
     */
    async listSharedUsers(article_id) {
        const data = {
            share: {
                article_id,
            },
        };
        const payload = await this.post('/compose/list_share', data);
        return payload.share || [];
    }

    /**
     * Delete a user from a shared article
     * @param {number} article_id
     * @param {string} user_id
     */
    async deleteSharedUsers(article_id, user_id) {
        const data = {
            share: {
                article_id,
                user_id,
            },
        };
        return this.post('/compose/delete_share', data);
    }
    /*** End of sharing related apis ****/

    /*** Comment related apis ****/

    /**
     * Add comment to article
     * @param {number} article_id
     * @param {Comment} comment { range: { index, length }, comment }
     */
    async addComment(article_id, comment_info) {
        const { range, comment } = comment_info;
        const data = {
            comment: {
                article_id,
                range_start: range.index,
                range_length: range.length,
                comment,
            },
        };
        return this.post('/compose/insert_or_update_comment', data);
    }

    /**
     * Delete comment by id
     * @param {number} id
     */
    async deleteComment(id) {
        const data = {
            comment: {
                id,
            },
        };
        return this.post('/compose/delete_comment', data);
    }

    /**
     * Get comment by article id
     * @param {number} article_id
     * @return Comments, each comment has:
     *  id: number,
     *  user_id: number,
     *  article_id: number,
     *  range_start: number,
     *  range_length: number,
     *  comment: string,
     *  updated_ts: date string
     */
    async _getComment(article_id) {
        const data = { comment: { article_id } };
        const payload = await this.post('/compose/get_comment', data);
        const comments = payload.comment || [];
        return comments.map((comment) => {
            const { range_start, range_length } = comment;
            return {
                ...comment,
                range: {
                    index: range_start,
                    length: range_length,
                },
            };
        });
    }

    /*** End of comment related apis ****/
}

export default new WritingService();

export { ShareType };
