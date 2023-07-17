import AbstractService from '../AbstractService';
import { CSA_URL } from 'constants/server';
import { WEBSITE } from 'constants/CSA/routes';

class PersonalizedWebsiteService extends AbstractService {
    constructor() {
        super();
        this.typeEnums = null;
        this.idToTypeMap = null;
    }

    /**
     * {"nameIds":[
     *  {"id":1,"name":"article"},
     *  {"id":6,"name":"faq"},
     *  {"id":4,"name":"flyer"},
     *  {"id":2,"name":"podcast"},
     *  {"id":3,"name":"video"},
     *  {"id":5,"name":"webinar"}
     * ]}
     * @return {
     *  article: 1,
     *  podcast: 2,
     *  video: 3,
     *  flyer: 4,
     *  webinar: 5,
     *  faq: 6
     * }
     */
    async listTypes() {
        if (this.typeEnums == null) {
            const payload = await this.get('/profile/listCsaPersonalWebsiteContentType');
            const enums = {};
            const idToNameMap = {};
            payload.nameIds.forEach(({ id, name }) => {
                enums[name] = id;
                idToNameMap[id] = name;
            });
            this.typeEnums = enums;
            this.idToNameMap = idToNameMap;
        }
        return this.typeEnums;
    }

    /**
     * @param AUTH_UID (optional) for public access to use
     * 
     * @returns
     * id: number
     * uid: string
     * type: number
     * object_id: number
     * [{"uid":"test_id_john","type":4,"object_id":2190,"id":6},
     *  {"uid":"test_id_john","type":3,"object_id":2187,"id":7},
     *  {"uid":"test_id_john","type":4,"object_id":2190,"id":8}
     * ]
     */
    async getInfos(AUTH_UID) {
        const payload = await this.get('/profile/csaPersonalWebsiteInfoByUid', undefined, AUTH_UID);
        const infos = payload.csaPersonalWebsiteInfo || [];
        return this._splitInfosByType(infos);
    }

    async _splitInfosByType(infos) {
        await this.listTypes();
        const res = {};
        for (let typeName in this.typeEnums) {
            res[typeName] = [];
        }
        infos.forEach((info) => {
            const typeName = this.idToNameMap[info.type];
            res[typeName].push(info);
        });
        return res;
    }

    /**
     * Example:
     * [{"id":3, "type":3, "object_id":2188, "status":0},
     *  {"id":4, "type":4, "object_id":2191, "status":0}
     * ]
     */
    async insertOrUpdateInfo(info) {
        const data = {
            csaPersonalWebsiteInfo: [info],
        };
        if (this._shouldInsert(info)) {
            return this.post('/profile/csaPersonalWebsiteInfoInsert', data);
        } else {
            return this.post('/profile/csaPersonalWebsiteInfoUpdate', data);
        }
    }

    async deleteInfoById(id) {
        const data = {
            csaPersonalWebsiteInfo: [{ id }],
        };
        return this.post('/profile/csaPersonalWebsiteInfoDeleteById', data);
    }

    async deleteAllInfos() {
        return this.post('/profile/csaPersonalWebsiteInfoDeleteByUid');
    }

    /** === FAQ related apis === */
    /**
     * @returns
     * id: number
     * uid: string
     * question: string
     * answer: string
     * [{"id":5,"uid":"test_id_john","question":"question 1","answer":"my answer 1"},
     *  {"id":6,"uid":"test_id_john","question":"my question 2","answer":"my answer 2"}
     * ]
     */
    async getFAQs() {
        const payload = await this.get('/profile/csaFaqByUid');
        return payload.csaFaq || [];
    }

    /**
     * Example:
     * [{"id":3, "type":3, "object_id":2188, "status":0},
     *  {"id":4, "type":4, "object_id":2191, "status":0}
     * ]
     */
    async insertOrUpdateFAQ(faq) {
        const data = {
            csaFaq: [faq],
        };
        if (this._shouldInsert(faq)) {
            return this.post('/profile/csaFaqInsert', data);
        } else {
            return this.post('/profile/csaFaqUpdate', data);
        }
    }

    async deleteFAQById(id) {
        const data = {
            csaFaq: [{ id }],
        };
        return this.post('/profile/csaFaqDeleteById', data);
    }

    async deleteAllFAQs() {
        return this.post('/profile/csaFaqDeleteByUid');
    }

    /** === Other info related apis === */
    /**
     * @param AUTH_UID (optional) for public access to use
     * 
     * @returns
     * id: number
     * uid: string
     * bio: object
     * Example
     * {
     *  "id":1,
     *  "uid": "test_id_john",
     *  "bio": "stringified bio"
     * }
     */
    async getOthers(AUTH_UID) {
        const payload = await this.get('/profile/csaWebOtherByUid', undefined, AUTH_UID);
        const info = payload.csaWebOther || {};
        let bio = {};
        try {
            if (info.bio) {
                bio = JSON.parse(info.bio);
            }
        } catch (e) {
            console.error(e);
        }
        return {
            id: info.id,
            bio
        };
    }

    /**
     * Example:
     * {"id":1, "bio":"my bio updated", "status":0}
     */
    async insertOrUpdateOther(info) {
        const data = {
            csaWebOther: {
                ...info,
                bio: JSON.stringify(info.bio)
            },
        };
        if (this._shouldInsert(info)) {
            return this.post('/profile/csaWebOtherInsert', data);
        } else {
            return this.post('/profile/csaWebOtherUpdate', data);
        }
    }

    _shouldInsert(item) {
        return item.id == null;
    }

    async getUIDByAlias(csaAlias) {
        const data = { csaAlias };
        const payload = await this.post('/profile/csaAliasUid', data);
        return payload.csaUid;
    }

    getWebsiteURL(alias) {
        return `${CSA_URL}${WEBSITE.slice(1)}/${alias}`;
    }
}

export default new PersonalizedWebsiteService();
