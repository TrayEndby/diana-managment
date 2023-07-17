import AbstractService from '../AbstractService';

class CustomerService extends AbstractService {
    /** === FAQ related apis === */
    /**
     * @returns
     * id: number
     * feedback: string
     * description: string
     * customer_id: string
     * {
     *  "id":9,
     *  "feedback":"very good",
     *  "support":"please provide technical support",
     *  "description":"optional",
     *  "customer_id":"test_id_john",
     *  "csa_id":"test_id_john"
     * }
     */
    async getFeedbackAndSupportInfoByProfileId(profileId) {
        const data = { profileId };
        const payload = await this.post('/profile/csaProspectFeedbackByProspectId', data);
        return payload.csaProspectFeedback || {};
    }

    /**
     * @param Info
     * {
     *  id: string,
     *  customer_id: string,
     *  feedback: string,
     *  support: string
     * }
     */
    async insertOrUpdateFeedbackAndSupportInfo(info) {
        const data = {
            csaProspectFeedback: info,
        };
        if (info.id == null) {
            return this.post('/profile/csaProspectFeedbackInsert', data);
        } else {
            return this.post('/profile/csaProspectFeedbackUpdate', data);
        }
    }

    async deleteFeedbackAndSupportInfoByProfileId(profileId) {
        const data = { profileId };
        return this.post('/profile/csaProspectFeedbackDeleteByProspectId', data);
    }
}

export default new CustomerService();