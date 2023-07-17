import AbstractService from '../AbstractService';

class CSAProspectService extends AbstractService {
    constructor() {
        super();
        this._stageCache = null;
        this._leadSourceCache = null;
        this._motivationCache = null;
        this._incomeLevelCache = null;
    }
    /**
     * Example of prospect profile:
     * {
     *  "id": 1,
     *  "csa_id": "zt0EeqUq2VbVnO5TEIUp6e8GlZh1",
     *  "firstName": "prospect updated",
     *  "lastName": "customer",
     *  "email": "djiang@kyros.ai",
     *  "SecondaryEmail": "test.jiang@gmail.com",
     *  "mailingCity": "San Jose",
     *  "mailingState": "CA",
     *  "mailingCountry": "US",
     *  "mailingAdd": "1111 Test St.",
     *  "phone": "123-456-7890",
     *  "mobile": "123-456-7890",
     *  "income_level": 2,
     *  "lead_source": 2,
     *  "num_of_children": 4,
     *  "starting_date": "2020-11-20",
     *  "closing_date": "2020-11-30",
     *  "estimated_amount": 5000,
     *  "stage": 3,
     *  "motivation": "Other:1",
     *  "additional": "sold 10 licenses"
     * }
     * @param {number} id
     */
    async getById(id) {
        const data = {
            prospectId: id,
        };
        const payload = await this.post(
            '/profile/csaProspectProfileInfo',
            data,
        );
        const info = payload.csaProspectProfileInfo || {};
        return {
            ...info,
            num_of_children: info.num_of_children || 0,
        };
    }

    /**
     * Insert/update profile
     * @param {} profile
     * Profile has the same structure as get
     */
    async update(profile) {
        const data = {
            csaProspectProfileInfo: profile,
        };
        return this.post('/profile/csaProspectProfileInfoUpdate', data);
    }

    /**
     * Example of result:
     * [{
     *  "first_name": "prospect updated",
     *  "last_name": "customer",
     *  "starting_date": "2020-11-20",
     *  "closing_date": "2020-11-30",
     *  "estimated_amount": 5000,
     *  "stage": 3,
     *  "motivation": "Other:1"
     *  ? need to return id
     * }]
     */
    async listAll() {
        const payload = await this.get('/csa/prospectInfoByCsaId');
        const res = payload.prospectInfo || [];
        return res.map((info) => {
            return {
                ...info,
                name: `${info.first_name} ${info.last_name}`,
            };
        });
    }

    async listStage() {
        if (this._stageCache == null) {
            this._stageCache = await this._list(
                '/profile/listCsaProspectStage',
            );
        }
        return this._stageCache || [];
    }

    async listLeadSource() {
        if (this._leadSourceCache == null) {
            this._leadSourceCache = await this._list(
                '/profile/listCsaProspectLeadSource',
            );
        }
        return this._leadSourceCache || [];
    }

    async listMotivation() {
        if (this._motivationCache == null) {
            this._motivationCache = await this._list(
                '/profile/listCsaProspectMotivation',
            );
        }
        return this._motivationCache || [];
    }

    // XXX TODO: combine with the one in ParentService
    async listIncomeLevel() {
        if (this._incomeLevelCache == null) {
            this._incomeLevelCache = await this._list('/profile/list', {
                mode: 25,
            });
        }
        return this._incomeLevelCache || [];
    }

    async _list(url, data) {
        const payload = await this.post(url, data);
        const nameIds = payload.nameIds;
        if (nameIds != null) {
            nameIds.sort((a, b) => a.id - b.id); // sort by id
        }
        return nameIds;
    }

    // Submit CSA registration
    async formSubmit(tag, key, data) {
        const payload = await this.post('/p/form/submit', {
            mode: 'update',
            kv: {
                tag: tag,
                key: key,
                value: data,
            },
        });
        return payload;
    }
}

export default new CSAProspectService();
