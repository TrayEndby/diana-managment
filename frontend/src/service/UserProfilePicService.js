import AbstractService from './AbstractService';
import authService from './AuthService';
import fileUploadService, { Category } from './FileUploadService';

class UserProfilePicService extends AbstractService {
    getFileName() {
        return authService.getUID();
    }

    async upload(file) {
        return fileUploadService.upload(file, this.getFileName(), Category.Profile, true);
    }

    async delete() {
        return fileUploadService.delete(this.getFileName(), Category.Profile);
    }

    async download() {
        const userId = this.getFileName();
        return fileUploadService.download(Category.Profile, userId, userId);
    }

    async downloadPublicImage() {
        const userId = this.getFileName();
        return fileUploadService.publicImageDownload(Category.Profile, userId, userId);
    }

    /**
     * 
     * @param {*} AUTH_UID (optional) for public access to use
     */
    async downloadByProfileId(profileId, AUTH_UID) {
        return fileUploadService.download(Category.Profile, profileId, profileId, AUTH_UID);
    }

    async downloadPublicImageByProfileId(profileId, AUTH_UID) {
        return fileUploadService.publicImageDownload(Category.Profile, profileId, profileId, AUTH_UID);
    }
}

export default new UserProfilePicService();
