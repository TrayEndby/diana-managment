import AbstractService from './AbstractService';
import userProfileListService from './UserProfileListService';
import userProfileSearchService from './UserProfileSearchService';

class StrategyService extends AbstractService {
    constructor() {
        super();
        this._listCache = {};
    }
    /**
     * @return
     * repeated Major major
     * uint32 id
     * string name
     * string description
     */
    async listMajors() {
        return this._list('list_majors', 'major');
    }

    /**
     *
     * @param {number[]} ids
     */
    async setMajors(ids) {
        return this._set('set_majors', 'major', ids);
    }

    /**
     * @return array of Majors
     */
    async getMajors(majorsList) {
        return this._get('get_majors', 'major', majorsList);
    }

    /**
     * @return
     * repeated StrategyItem interest
     * uint32 id
     * string name
     */
    async listInterests() {
        return this._list('list_interests', 'interest');
    }

    /**
     *
     * @param {number[]} ids
     */
    async setInterests(ids) {
        return this._set('set_interests', 'interest', ids);
    }

    /**
     * @return array of interest
     */
    async getInterests(interestsList) {
        return this._get('get_interests', 'interest', interestsList);
    }

    /**
     * @return
     * repeated StrategyItem
     * uint32 id
     * string name
     */
    async listDrives() {
        return this._list('list_drives', 'drive');
    }

    /**
     *
     * @param {number[]} ids
     */
    async setDrives(ids) {
        return this._set('set_drives', 'drive', ids);
    }

    /**
     * @return array of drives
     */
    async getDrives(driveList) {
        return this._get('get_drives', 'drive', driveList);
    }

    /**
     * @return
     * repeated Personality
     * uint32 id
     * string name
     * string career
     * string description
     */
    async listPersonalities() {
        const payload = await userProfileListService.listName(20);
        const personalities = payload.MBTIInfo || [];
        personalities.sort((a, b) => a.name.localeCompare(b.name));
        return personalities;
    }

    async setPersonality(ids) {
        const data = await userProfileSearchService.searchProfile();
        let supplementary = {};
        if (data && data.profile && data.profile.supplementary) {
            supplementary = data.profile.supplementary;
        }
        const personality = ids[0] == null ? undefined : Number(ids[0]);
        return userProfileSearchService.insertSupplementaryInfo({
            ...supplementary,
            personality
        });
    }

    async getPersonality(persionalityList) {
        const data = await userProfileSearchService.searchProfile();
        let personality = null;
        if (data && data.profile && data.profile.supplementary) {
            personality = data.profile.supplementary.personality || null;
        }
        if (personality != null) {
            return persionalityList.filter(({ id }) => id === personality);
        } else {
            return [];
        }
    }

    async recommendMajors(majorsList) {
        return this._get('recommend_majors', 'major', majorsList);
    }

    /**
     * Get annual plan overview
     * Return
     * repeated AnnualPlan annual_plan
     *  int32 id
     *  int32 grade
     *  int32 type
     *  repeated AnnualPlanItem item
     *      int32 item_id
     *      string key
     */
    async getAllAnnualPlans() {
        const data = {
            mode: "all",
        };
        const payload = await this.post('/mission/annual_plan', data);
        return payload.annual_plan || [];
    }

    /**
     * Get the detail annual plan for a given grade
     * @param {number} grade 
     * repeated AnnualPlan annual_plan
     *  int32 id
     *  int32 grade
     *  int32 type
     *  repeated AnnualPlanItem item
     *      int32 item_id
     *      string key
     *      string value
     *      int64 picture_id
     */
    async getAnnualPlanByGrade(grade) {
        const data = {
            mode: "grade",
            grade
        };
        const payload = await this.post('/mission/annual_plan', data);
        const plan = payload.annual_plan || [];
        return plan[0] || {};
    }

    async _list(mode, field) {
        if (!this._listCache[mode]) {
            const data = {
                mode,
            };
            const payload = await this.post('/mission/strategy', data);
            const strategy = payload.strategy || {};
            const list = strategy[field] || [];
            list.sort((a, b) => a.name.localeCompare(b.name));
            this._listCache[mode] = list;
        }
        return this._listCache[mode];
    }

    async _set(mode, field, ids) {
        const data = {
            mode,
            [field]: ids.map((id) => {
                return {
                    id,
                };
            }),
        };
        return this.post('/mission/strategy', data);
    }

    async _get(mode, field, list) {
        const data = {
            mode,
        };
        const payload = await this.post('/mission/strategy', data);
        const strategy = payload.strategy || {};
        const ids = strategy[field] || [];
        return this._getItemFromList(ids, list);
    }

    _getItemFromList(ids, list) {
        const map = new Map();
        list.forEach((item) => map.set(item.id, item));
        return ids.map(({ id }) => map.get(id));
    }
}

export default new StrategyService();
