import axios from 'axios';
import { NOT_SECRET } from '../constants/server';
import AbstractService from './AbstractService';
import { PROFILE_TYPE_ID, PROFILE_TYPE } from 'constants/profileTypes';
import { STORAGE_SIGN_IN_TYPE } from 'constants/storageKeys';

class AuthService extends AbstractService {
    constructor() {
        super();
        this.uid = null;
        this.authUser = null;
        this.idCnt = 0;
        this.status = null;
        this.typeIdToString = {};
        Object.entries(PROFILE_TYPE_ID).forEach(e => {
          this.typeIdToString[e[1]] = e[0];
        });
    }

    async verify(authUser, userType) {
        const userTypeId = PROFILE_TYPE_ID[userType];
        if (userTypeId == null) {
            throw new Error('Invalid user type');
        }
        this.authUser = authUser;
        const token = await authUser.getIdToken(true);
        const absoluteURL = this._genUrl('/verify-token');
        const response = await axios.get(absoluteURL, {
            headers: {
                SECRET: NOT_SECRET,
                'AUTH-ID-TOKEN': token,
                'AUTH-PAGE': userTypeId,
            },
        });
        if (this._isSuccessfulResponse(response)) {
            const payload = response.data.payload;
            this.uid = payload.uid;
            this.status = this._parseStatus(payload.status);
            this.setAuthParam(payload, userTypeId);
        } else {
            this._throwError(response);
        }
    }

    async verifyEmail() {
        const token = await this.authUser.getIdToken(true);
        const absoluteURL = this._genUrl('/verify-email');
        return axios.get(absoluteURL, {
            headers: {
                SECRET: NOT_SECRET,
                'AUTH-ID-TOKEN': token,
            },
        });
    }

    /**
     * Generate a random id
     */
    genId() {
        return new Date().getTime() + '_' + this.idCnt++;
    }

    getUser() {
        return this.authUser;
    }

    getUID() {
        return this.uid;
    }

    getEmail() {
        return this.authUser.email;
    }

    getDisplayName() {
        return this.authUser.displayName;
    }

    getFirstAndLastName() {
        let firstName = '';
        let lastName = '';
        try {
            let names = this.getDisplayName().split(' ');
            lastName = names[names.length - 1];
            firstName = names.slice(0, names.length - 1).join(' ');
        } catch (e) {
            console.error(e);
        }
        return [firstName, lastName];
    }

    getPhoneNumber() {
        return this.authUser.phoneNumber;
    }

    isVerified(userTypeId) {
        return this.status && this.status.includes(userTypeId);
    }

    getVerifiedUserTypes() {
      let v = []
      if (this.status) {
        this.status.forEach(t => v.push(this.typeIdToString[t]));
      }
      return v;
    }

    isVerifiedParentOrStudent() {
        return (
          this.isVerified(PROFILE_TYPE_ID[PROFILE_TYPE.RegularHSStudent]) ||
          this.isVerified(PROFILE_TYPE_ID[PROFILE_TYPE.Parent])
        );
    }

    getUnverifiedMessage() {
        const signInType = this.getSignInType();
        const isParent = signInType === PROFILE_TYPE.Parent;
        const as = isParent ? 'As a parent' : 'As a student';
        const name = this.getFirstAndLastName()[0];

        return (
            `**Hello dear ${name}!**\n` +
            '\n' +
            `${as}, to start using the application, you need to be invited or to go through the payment process.\n` +
            'As of now, you can only access the profile page.\n' +
            'Please contact **info@kyros.ai** for more information.'
        );
    }

    getSignInType() {
        return (
            localStorage.getItem(STORAGE_SIGN_IN_TYPE) ||
            PROFILE_TYPE.RegularHSStudent
        );
    }

    _parseStatus(status) {
        try {
            return JSON.parse(status);
        } catch {
            return null;
        }
    }
}

export default new AuthService();
