import AbstractService from './AbstractService';
class UserProfileService extends AbstractService {
    constructor() {
        super();
        this.listIDCache = {};
        this.listNameCache = {};
        this.categoryListCache = {};
        this.countryStateCache = {};
    }

    async listID(key) {
        if (!this.listIDCache[key]) {
            let payload = await this.post('/profile/list', { mode: key });
            this.listIDCache[key] = payload.nameIds || [];
        }
        return this.listIDCache[key];
    }

    async listName(key) {
        if (!this.listNameCache[key]) {
            let payload = await this.post('/profile/list', { mode: key });
            this.listNameCache[key] = payload || {};
        }
        return this.listNameCache[key];
    }

    async getListCountryAbbvName() {
        const payload = await this.post('/profile/listCountryAbbvName');
        const list = payload.abbvNames || [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        return list;
    }

    async getListStateByCountry(countryCode) {
        if (!this.countryStateCache[countryCode]) {
            const data = { countryCode };
            const payload = await this.post('/profile/listWorldStateInfo', data);
            const list = payload.stateInfo || [];
            const states = list.map(info => info.name);
            states.sort((a, b) => a.localeCompare(b));
            this.countryStateCache[countryCode] = states;
        }
        return this.countryStateCache[countryCode];
    }

    async getListTags() {
        const payload = await this.post('/profile/listEcaSummerProgramTag');
        const list = payload.nameIds || [];
        list.sort((a, b) => a.name.localeCompare(b.name));
        return list;
    }

    async categoryList(key, category) {
        this.categoryListCache[key] = this.categoryListCache[key] || {};
        if (!this.categoryListCache[key][category]) {
            let payload = await this.post('/profile/list', { mode: key, typeCategory: category });
            this.categoryListCache[key][category] = payload || [];
        }
        return this.categoryListCache[key][category];
    }

    async highSchoolInfo(zip) {
        let payload = await this.post('/profile/list', { mode: 15, zip: zip });
        return payload.infos || [];
    }

    async courseInfo() {
        let payload = await this.listName(17);
        return payload.infos || [];
    }
}

export default new UserProfileService();
