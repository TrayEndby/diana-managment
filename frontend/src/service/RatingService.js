import AbstractService from './AbstractService';
import AuthService from './AuthService';
import moment from 'moment';

const RatingType = {
    course: 1,
    project: 2,
    eca_program: 3,
    educator_service: 4,
    essay: 5,
    resource: 6,
    csa_support_issue: 7,
    csa_feedback: 8
};

class RatingService extends AbstractService {
    constructor() {
        super();
        this.typeCache = null;
    }

    async listRatingType() {
        if (this.typeCache == null) {
            const payload = await this.post('/rating/ListRatingType');
            const { idNames } = payload || [];
            this.typeCache = idNames;
        }
        return this.typeCache;
    }

    async insertOrUpdateRating(id, type, data) {
        if (id == null) {
            return this.insertRating(type, data);
        } else {
            return this.updateRating(id, type, data);
        }
    }

    /**
     * @param {RatingType} type
     * @param {*} data
     * review_item: number,
     * title: string,
     * rating: number,
     * comments: string,
     * status: number,
     * helpful: number
     */
    async insertRating(type, data) {
        const payload = await this.post('/rating/ReviewRatingInfoInsert', {
            ratingInfo: [
                {
                    type,
                    ...data,
                    reviewed_by: AuthService.getUID(),
                    reviewed_ts: moment.utc().format('YYYY-MM-DD H:mm:ss'),
                },
            ],
        });
        return payload || {};
    }

    /**
     *
     * @param {number} id
     * @param {number} type
     * @param {*} data
     * review_item: number,
     * title: string,
     * rating: number,
     * comments: string,
     * status: number,
     * helpful: number
     */
    async updateRating(id, type, data) {
        const payload = await this.post('/rating/ReviewRatingInfoUpdate', {
            ratingInfo: [
                {
                    id,
                    type,
                    ...data,
                    reviewed_by: AuthService.getUID(),
                    reviewed_ts: moment.utc().format('YYYY-MM-DD H:mm:ss'),
                },
            ],
        });
        return payload || {};
    }

    async getRatingByItemId(type, item_id) {
        const payload = await this.post('/rating/getItemReviewInfo', {
            ratingInfo: [{ type, review_item: item_id }],
        });
        return payload.ratingInfo || [];
    }

    async deleteRating(id, type, item_id) {
        return this.post('/rating/ReviewRatingInfoDeleteById', {
            ratingInfo: [{ id, type, review_item: item_id }],
        });
    }

    /**
     * The API will do an insert if likeInfo is not there.
     * Otherwise, it will do an update.
     * Just don't send something like 'liked:1, disliked:1'.
     * But you can send 'liked:0, disliked:0'
     * if a user un-check liked or disliked of a reviewInfo that
     * was previously liked/disliked.
     * @param {*} data
     * reviewInfoId: number,
     * liked: number,
     * disliked: number
     */
    async updateRatingLikeInfo(id, liked, disliked) {
        const payload = await this.post('/rating/RatingLikeInfoUpdate', {
            ratingLikeInfo: [
                {
                    reviewInfoId: id,
                    liked,
                    disliked,
                },
            ],
        });
        return payload || {};
    }

    /**
     * API to get a specific feedback’s liked/disliked info.
     * @param {number} id
     */
    async getRatingLikeInfo(id) {
        const payload = await this.post('/rating/getRatingLikeInfo', {
            ratingLikeInfo: [
                {
                    reviewInfoId: id,
                },
            ],
        });
        return payload.ratingLikeInfo || [];
    }

    async getEducatorReviewInfo(profileId) {
        const payload = await this.post('/rating/getEducatorReviewInfo', {
            profileId,
        });
        return payload.ratingInfo || [];
    }
}

export default new RatingService();

export { RatingType };
