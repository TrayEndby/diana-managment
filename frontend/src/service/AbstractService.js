import axios from 'axios';
import { BASE_URL, NOT_SECRET } from 'constants/server';
import { ERROR_CODE_TO_STR } from 'constants/errorTypes';

let AUTH_PARAM = {};
/**
 * Abstract Service Class that use axios to call backend apis
 * The concrete service Class should extends AbstractService
 * and use its methods (like .get, .post)
 */
class AbstractService {
    setAuthParam(data, userType) {
        if (
            process.env.NODE_ENV === 'development' &&
            process.env.REACT_APP_FAKE_AUTH_ID
        ) {
            AUTH_PARAM = {
                'AUTH-UID': process.env.REACT_APP_FAKE_AUTH_ID,
            };
            console.info('Dev use, AUTH_PARAM', AUTH_PARAM);
        } else {
            AUTH_PARAM = {
                'AUTH-EMAIL': data.email,
                'AUTH-TOKEN': data.jwt,
                'AUTH-UID': data.uid,
                'AUTH-PAGE': userType,
            };
        }
    }

    socketConnect() {
        const auth_params = encodeURIComponent(
            btoa(
                JSON.stringify({
                    SECRET: NOT_SECRET,
                    ...AUTH_PARAM,
                }),
            ),
        );
        const host = BASE_URL.split('https://')[1];
        const url = `wss://${host}/ws?auth_params=${auth_params}`;
        return new WebSocket(url);
    }

    /**
     * Send a Get request to url
     * e.g. get(/health)
     * @param url url to send request
     * @param data data in body
     * @param AUTH_UID (optional), set AUTH ID if not exist
     */
    async get(url, data, AUTH_UID) {
        const absoluteURL = this._genUrl(url);
        const headers = {
            headers: {
                SECRET: NOT_SECRET,
                ...AUTH_PARAM,
            },
        };
        this._addPublicAUTH_UID(headers, AUTH_UID);
        const response = await axios.get(absoluteURL, headers);
        if (this._isSuccessfulResponse(response)) {
            return response.data.payload;
        } else {
            this._throwError(response);
        }
    }

    async uploadPic(url, formData) {
        let absoluteURL = this._genUrl(url);
        let headers = {
            headers: {
                'Content-Type': 'multipart/form-data',
                SECRET: NOT_SECRET,
                ...AUTH_PARAM,
            },
        };
        let response = await axios.post(absoluteURL, formData, headers);
        if (this._isSuccessfulResponse(response)) {
            return response.data.payload;
        } else {
            this._throwError(response);
        }
    }

    async downloadPic(url, AUTH_UID) {
        const absoluteURL = this._genUrl(url);
        const headers = {
            responseType: 'arraybuffer',
            headers: {
                SECRET: NOT_SECRET,
                ...AUTH_PARAM,
            },
        };
        this._addPublicAUTH_UID(headers, AUTH_UID);
        const response = await axios.get(absoluteURL, headers);
        if (response.status === 200 && response) {
            return response;
        } else {
            this._throwError(response);
        }
    }

    /**
     * Send a Post request to url with data
     * e.g. post(/c/course/search, {"mode":"video", "query":"history"})
     * @param url url to send request
     * @param data data in body
     * @param AUTH_UID (optional), set AUTH ID if not exist
     */
    async post(url, data, AUTH_UID) {
        const absoluteURL = this._genUrl(url);
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                SECRET: NOT_SECRET,
                ...AUTH_PARAM,
            },
        };
        this._addPublicAUTH_UID(headers, AUTH_UID);
        const response = await axios.post(absoluteURL, data, headers);
        if (this._isSuccessfulResponse(response)) {
            return response.data.payload;
        } else {
            this._throwError(response);
        }
    }

    // update auth params
    updateAuthParam(childUid) {
        if (childUid !== '') {
            AUTH_PARAM = {
                ...AUTH_PARAM,
                'CHILD-UID': childUid,
            };
        } else {
            delete AUTH_PARAM['CHILD-UID'];
        }
    }

    // generate absolute URL by relative URL
    _genUrl(relativeURL) {
        return BASE_URL + relativeURL;
    }

    _addPublicAUTH_UID(headers, AUTH_UID) {
        if (AUTH_UID != null) {
            headers.headers['AUTH-UID'] = AUTH_UID;
        }
    }

    _isSuccessfulResponse(response) {
        return (
            response.status === 200 && response.data && response.data.success
        );
    }

    _throwError(response) {
        let error = null;
        let logged = false;
        try {
            const { data } = response;
            if (data) {
                const {
                    message,
                    details,
                    sql_error_code,
                    sql_error_name,
                } = data;
                console.error(
                    `Error message: ${message}, error code: ${sql_error_code}, error name: ${sql_error_name} details, ${details}`,
                );
                logged = true;
                error =
                    ERROR_CODE_TO_STR[sql_error_code] ||
                    'Internal Server Error';
                const parsed = JSON.parse(error);
                if (parsed.detail) {
                    error = parsed.detail;
                }
            }
        } catch {}
        if (!logged) {
            console.error(response);
        }
        error = error || 'Internal Server Error';
        throw new Error(error);
    }
}

export default AbstractService;
