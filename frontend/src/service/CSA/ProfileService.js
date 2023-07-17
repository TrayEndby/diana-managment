import AbstractService from '../AbstractService';
import userProfileSearchService from '../UserProfileSearchService';
import { PROFILE_TYPE } from 'constants/profileTypes';

class CSAProfileService extends AbstractService {
    async getProfile() {
        const profile = await this._fetchProfile();
        if (profile == null) {
            return null;
        }
        const type = profile.basic?.type || [];
        if (type.includes(PROFILE_TYPE.CSA)) {
            return profile;
        } else {
            return null;
        }
    }

    async hasProfile() {
        try {
            const profile = await this.getProfile();
            if (profile != null) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async update(info) {
        const profile = await this._fetchProfile();
        const types = profile?.basic?.type || [];
        if (!types.includes(PROFILE_TYPE.CSA)) {
            types.push(PROFILE_TYPE.CSA);
        }
        return userProfileSearchService.update(53, {
            ...profile?.basic,
            ...info,
            type: [...types],
        });
    }

    async getLinkedAccount() {
        try {
            const payload = await this.post('/csa/getLinkedAccount', {});
            if (payload == null) {
                return [];
            }
            return payload;
        } catch (e) {
            return [];
        }
    }

    async insertLinkedAccount(info) {
        try {
            const payload = await this.post('/csa/linkedAccountInsert', { linkedAccounts: info });
            if(payload.data != null){
                return payload.data;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    async deleteLinkedAccount(info) {
        try {
            const payload = await this.post('/csa/linkedAccountDeleteById', { linkedAccounts: info });
            if(payload.data != null){
                return payload.data;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    async updateLinkedAccount(info) {
        try {
            const payload = await this.post('/csa/linkedAccountUpdate', { linkedAccounts: info });
            if(payload.data != null){
                return payload.data;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    async getUplineInfo() {
        try {
            const payload = await this.post('/csa/getUplineInfo', {});
            if (payload == null) {
                return {};
            }
            return payload.uplineInfo;
        } catch (e) {
            return {};
        }
    }

    async verifyWebsiteAlias(websiteName) {
        const data = {
            verifyInfo: {
                websiteName,
            },
        };
        const payload = await this.post('/csa/verifyUniqueWebsiteName', data);
        const res = payload?.verificationRsp || {};
        return res.exist || false;
    }

    async verifyReferralCode(referralCode) {
        const data = {
            verifyInfo: {
                referralCode,
            },
        };
        const payload = await this.post('/csa/verifyReferralCode', data);
        const res = payload?.verificationRsp || {};
        const { exist, referral_first_name, referral_last_name } = res;
        if (exist) {
            return `${referral_first_name} ${referral_last_name}`;
        } else {
            return null;
        }
    }

    async _fetchProfile() {
        const payload = await this.post('/profile/getCSAProfile', { mode: 1 });
        return payload.profile;
    }
}

export default new CSAProfileService();
