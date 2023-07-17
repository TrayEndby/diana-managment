import AbstractService from './AbstractService';

class GeneralService extends AbstractService {
    async submitLeadForm(email, data) {
        const payload = await this.post('/p/form/submit', {
            mode: 'update',
            kv: {
                tag: 'customer_lead',
                key: `customer_lead:${email}`,
                value: data,
            },
        });
        return payload;
    }
}

export default new GeneralService();
