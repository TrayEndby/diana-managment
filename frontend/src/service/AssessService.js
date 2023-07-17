import AbstractService from './AbstractService';

class AssessService extends AbstractService {
    async getChance(college) {
        const { college_admission } = await this.post('/assess/admission', {
            college,
        });

        return college_admission;
    };

    async searchPost(collegeName) {
        const payload = await this.post('/resources/search_post', {
            query: collegeName,
        });
        return payload?.post || [];
    };
}

export default new AssessService();
