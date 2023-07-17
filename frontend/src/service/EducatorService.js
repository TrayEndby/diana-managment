import AbstractService from './AbstractService';
import PlayListService from './PlayListService';

const SAVED_EDUCATORS_KEY = 'SAVED_EDUCATORS_KEY4';

class EducatorService extends AbstractService {
    async getServiceCategories() {
        const data = {
            mode: 24,
        };
        const { nameIds } = await this.post('/profile/list', data);
        return nameIds || [];
    }

    async getAllEducators({ gender, hourlyRateMax, serviceType, serviceName, yearsExperience }) {
        let payload = await this.post('/profile/allEducators', {
            fromRow: 0,
            educatorCondition: {
                gender,
                hourlyRateMax,
                serviceType,
                serviceName,
                yearsExperience,
            },
        });
        return payload.allEducators || [];
    }

    async getEducatorInfo(profileId) {
        let payload = await this.post('/profile/educatorProfileAllInfo', {
            profileId: profileId,
        });

        return payload.profile;
    }

    async getFrequency() {
        let payload = await this.post('/profile/listEducatorRequestFrequency');
        return payload.nameIds || [];
    }

    async getEducatorProfile() {
        const payload = await this.post('/profile/educatorProfileSelect', {});
        return payload || [];
    }

    async educatorProfileUpdate(data) {
        const payload = await this.post('/profile/educatorProfileUpdate', { profile: { educatorProfile: data } });
        return payload || [];
    }

    async getServices(profileId) {
        const payload = await this.post('/profile/educatorServiceSelect', { profileId });
        return payload || [];
    }

    async insertService(data) {
        const payload = await this.post('/profile/educatorServiceInsert', { profile: { educatorService: [data] } });
        return payload || [];
    }

    async deleteService(id) {
        const payload = await this.post('/profile/educatorServiceDelete', { profile: { educatorService: [{ id }] } });
        return payload || [];
    }

    async getServiceExperience() {
        const payload = await this.post('/profile/educatorServiceExperienceByUid', {});
        return payload || [];
    }

    async insertServiceExperience(data) {
        const payload = await this.post('/profile/educatorServiceExperienceInsert', {
            profile: { educatorEducationWorkingExperience: [data] },
        });
        return payload || {};
    }

    async updateServiceExperience(data) {
        const payload = await this.post('/profile/educatorServiceExperienceUpdate', {
            profile: { educatorEducationWorkingExperience: [data] },
        });
        return payload || {};
    }

    async deleteServiceExperience(id) {
        const payload = await this.post('/profile/educatorServiceExperienceDeleteById', {
            profile: { educatorEducationWorkingExperience: [{ id: id }] },
        });
        return payload || {};
    }

    async getEducationInfo() {
        const payload = await this.post('/profile/educatorEducationInfoByUid', {});
        return payload || [];
    }

    async insertEducationInfo(data) {
        const payload = await this.post('/profile/educatorEducationInfoInsert', {
            profile: { educatorEducationWorkingExperience: [data] },
        });
        return payload || {};
    }

    async updateEducationInfo(data) {
        const payload = await this.post('/profile/educatorEducationInfoUpdate', {
            profile: { educatorEducationWorkingExperience: [data] },
        });
        return payload || {};
    }

    async deleteEducationInfo(id) {
        const payload = await this.post('/profile/educatorEducationInfoDeleteById', {
            profile: { educatorEducationWorkingExperience: [{ id: id }] },
        });
        return payload || {};
    }

    async getCertificateInfo() {
        const payload = await this.post('/profile/educatorCertificateInfoByUid', {});
        return payload || [];
    }

    async insertCertificateInfo(data) {
        const payload = await this.post('/profile/educatorCertificateInfoInsert', {
            profile: { educatorEducationWorkingExperience: [data] },
        });
        return payload || {};
    }

    async updateCertificateInfo(data) {
        const payload = await this.post('/profile/educatorCertificateInfoUpdate', {
            profile: { educatorEducationWorkingExperience: [data] },
        });
        return payload || {};
    }

    async deleteCertificateInfo(id) {
        const payload = await this.post('/profile/educatorCertificateInfoDeleteById', {
            profile: { educatorEducationWorkingExperience: [{ id: id }] },
        });
        return payload || {};
    }

    async getProjectInfo() {
        const payload = await this.post('/profile/educatorProjectInfoByUid', {});
        return payload || [];
    }

    async insertProjectInfo(data) {
        const payload = await this.post('/profile/educatorProjectInfoInsert', {
            profile: { educatorEducationWorkingExperience: [data] },
        });
        return payload || {};
    }

    async updateProjectInfo(data) {
        const payload = await this.post('/profile/educatorProjectInfoUpdate', {
            profile: { educatorEducationWorkingExperience: [data] },
        });
        return payload || {};
    }

    async deleteProjectInfo(id) {
        const payload = await this.post('/profile/educatorProjectInfoDeleteById', {
            profile: { educatorEducationWorkingExperience: [{ id: id }] },
        });
        return payload || {};
    }

    async getSavedEducatorsPlaylist() {
        const playlists = await PlayListService.listEducators();
        let savedProgramsPlaylist = playlists.find((i) => i.name === SAVED_EDUCATORS_KEY);
        if (!savedProgramsPlaylist) {
            const { list: newPlaylists } = await PlayListService.addEducatorList(SAVED_EDUCATORS_KEY);
            savedProgramsPlaylist = newPlaylists.find((i) => i.name === SAVED_EDUCATORS_KEY);
        }
        return savedProgramsPlaylist;
    }

    async getSavedEducators() {
        const savedEducatorsPlaylist = await this.getSavedEducatorsPlaylist();
        const { item: savedEducators = [] } = await PlayListService.getEducatorsListById(savedEducatorsPlaylist.id);
        const allEducators = await this.getAllEducators({});

        return {
            savedEducators: savedEducators
                .map((i) => allEducators.find((e) => i.educator.id === e.educatorProfile.uid))
                .filter(Boolean),
            listOfIds: savedEducators.map(({ educator: { id } }) => id),
            playlistId: savedEducatorsPlaylist.id,
        };
    }

    async saveEducator(id) {
        const { savedEducators, playlistId } = await this.getSavedEducators();
        if (!savedEducators.find((i) => i.id === id)) {
            await PlayListService.addItem(playlistId, [{ educator: { id } }]);
        }
    }

    async removeEducatorFromSaved(id) {
        const { savedEducators, playlistId } = await this.getSavedEducators();
        if (savedEducators.find((i) => i.id === id)) {
            await PlayListService.deleteItem(playlistId, [{ educator: { id } }]);
        }
    }
}

export default new EducatorService();
