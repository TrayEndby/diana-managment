import AbstractService from './AbstractService';
import authService from './AuthService';
import { PROFILE_TYPE } from '../constants/profileTypes';

export const ProfileSearchType = {
    Id: 'profileId',
    Email: 'email',
    UserName: 'userName',
};

class UserProfileSearchService extends AbstractService {
    constructor() {
        super();
        this.profile = null;
        this.publicProfileCache = {};
    }

    // XXX what's this api trying to do?
    // async deleteProfile() {
    //     return this.post("/profile/delete", {
    //         'mode': 48,
    //         'profileId': 'test_id_johndoe2'
    //     });
    // }

    async searchProfile(profileId) {
        return this.post('/profile/search', {
            mode: 1,
            profileId
        });
    }

    async searchLimitedProfiles(type, data) {
        let preparedData;
        switch (type) {
            case ProfileSearchType.Id:
                preparedData = { "profileId": data };
                break;
            case ProfileSearchType.Email:
                preparedData = { "email": data };
                break;
            case ProfileSearchType.UserName:
                preparedData = { "userName": data };
                break;
            default:
                return null
        }
        const payload = await this.post('/profile/searchLimitedProfiles', preparedData);
        return payload.limitedProfiles || null;
    }

    async searchEducatorProfile() {
        return this.post('/profile/educatorProfileSelect', {});
    }

    async getParentProfile() {
        const resp = await this.post('/profile/getParentProfile', { mode: 1 });
        return resp?.profile;
    }

    async hasProfile() {
        try {
            let ret = await this.searchProfile();
            if (ret && ret.profile) {
                this.profile = ret.profile;
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async hasProfileType(type) {
        try {
            let ret = await this.searchProfile();
            if (ret && ret.profile) {
                this.profile = ret.profile;
            }
            const types = this.profile?.basic?.type || [];
            return types.includes(type);
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async hasEducatorProfile() {
        try {
            let ret = await this.searchEducatorProfile();
            if (ret?.educatorProfile?.uid) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    async hasParentProfile() {
        try {
            let ret = await this.searchProfile();
            const isParentType = ret?.profile?.basic?.type.includes(PROFILE_TYPE.Parent);
            if (ret?.profile && isParentType) {
                this.profile = ret.profile;
                return true;
            } else {
                return false;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     *
     * @param {string} profileId
     * @return object
     * firstName: string,
     * lastName: string,
     * gender: string,
     * graduation: string,
     * schoolName: string,
     * SchoolCity: string,
     * SchoolState: string,
     * SchoolZip: string
     */
    async fetchPublicProfile(profileId) {
        if (!this.publicProfileCache[profileId]) {
            const payload = await this.post('/profile/search', {
                mode: 2,
                profileId,
            });
            this.publicProfileCache[profileId] = payload.limitedBasicInfo || null;
        }
        return this.publicProfileCache[profileId];
    }

    getProfile() {
        return this.profile;
    }

    async getProfileAsync() {
        await this.hasProfile();
        return this.profile;
    }

    async insertBasicInfo(data) {
        let info = { ...data };
        const birthday = info['birthday'];
        const types = data.type || [];
        info['type'] = [...types, PROFILE_TYPE.RegularHSStudent];
        if (!data.firstName || !data.lastName) {
            let [firstName, lastName] = authService.getFirstAndLastName();
            if (firstName && lastName) {
                info['firstName'] = firstName;
                info['lastName'] = lastName;
            } else {
                // XXX This is a quick fix
                console.warn("no last name")
                info['firstName'] = authService.getDisplayName();
                info['lastName'] = ' ';
            }
        }
        info['birthday'] = birthday?.split('T')[0];
        info['email'] = authService.getEmail();
        return this.post('/profile/update', {
            mode: 53,
            profile: { basic: info },
        });
    }

    async insertSchoolInfo(data) {
        // this method requires school name/id, but this fields not saving on previous steps
        // change line #49, when data will be saving on previous steps
        let profileSchool = {};
        if (this.profile && this.profile.schools) {
            profileSchool = this.profile.schools[this.profile.schools.length - 1] || {};
        }
        const prepareData = { ...profileSchool, ...data };
        if (Object.keys(prepareData).length === 0) {
            return;
        }
        return this.post('/profile/update', {
            mode: 54,
            profile: {
                flag: 31,
                schools: [prepareData],
            },
        });
    }

    async insertCourseInfo(data) {
        return this.post('/profile/update', {
            mode: 55,
            profile: {
                courses: data,
            },
        });
    }

    async deleteCourse(id) {
        return this.post('/profile/delete', {
            mode: 74,
            profile: {
                courses: [
                    {
                        id,
                    },
                ],
            },
        });
    }

    async insertTestInfo(data) {
        return this.post('/profile/update', {
            mode: 56,
            profile: {
                tests: data,
            },
        });
    }

    async deleteTest(tests) {
        const ids = tests.map(({ id }) => {
            return {
                id,
            };
        });
        return this.post('/profile/delete', {
            mode: 75,
            profile: {
                tests: ids,
            },
        });
    }

    async ecaProgramInsertUpdate(title, description, categoryId, typeId) {
        const payload = await this.post('/profile/ecaProgramInsertUpdate', {
            program: {
                title,
                description,
                category: categoryId,
                type: typeId,
            },
        });
        return payload.program_id;
    }

    /**
     *
     * @param {Object[]} data
     * @param {number} data.category_id
     * @param {number} data.type_id
     * @param {number} data.program_id
     * @param {string} data.role
     * @param {string} data.frequency
     * @param {Date} data.beginDate
     * @param {Date} data.endDate
     * @param {string} data.place
     * @param {string} data.description
     * @param {number} data.avgMinutesPerEvent
     */
    async insertECAInfo(data) {
        return this.post('/profile/update', {
            mode: 57,
            profile: {
                extraCurricular: data,
            },
        });
    }

    async deleteECA(id) {
        return this.post('/profile/delete', {
            mode: 76,
            profile: {
                extraCurricular: [
                    {
                        id,
                    },
                ],
            },
        });
    }

    /**
     *
     * @param {Object[]} data
     * @param {number} data.id
     * @param {number} data.category_id
     * @param {string} data.description
     * @param {string[]} data.achievement
     * @param {string[]} data.portfolios
     */
    async insertAchievementInfo(data) {
        return this.post('/profile/update', {
            mode: 59,
            profile: {
                achievement: data,
            },
        });
    }

    async deleteAchievement(id) {
        return this.post('/profile/delete', {
            mode: 77,
            profile: {
                achievement: [
                    {
                        id,
                    },
                ],
            },
        });
    }

    async insertMajorInfo(data) {
        return this.post('/profile/update', {
            mode: 84,
            profile: {
                majors: data,
            },
        });
    }

    async insertSupplementaryInfo(data) {
        return this.post('/profile/update', {
            mode: 64,
            profile: {
                supplementary: data,
            },
        });
    }

    async update(mode, info) {
        // info is object with all profile fields
        const birthday = info.birthday;
        info.type = info.type || [PROFILE_TYPE.RegularHSStudent];
        info.birthday = birthday?.split('T')[0];
        info.email = info.email || authService.getEmail();
        return this.post('/profile/update', {
            mode: mode,
            profile: { basic: info },
        });
    }
}

export default new UserProfileSearchService();
