import AbstractService from './AbstractService';

class PaymentService extends AbstractService {

    async stripeGetPublicKey() {
        const payload = await this.get('/stripe/setup', {});
        return payload?.publishable_key;
    }

    async stripeCreateCheckoutSession(data) {
        // data is {"promo_code": "abc123xyz", "order_total": 1128, "item":[{"user_email": "test@csa.kyros.ai", "num_years": 1}]}
        const payload = await this.post('/stripe/create-checkout-session', data);
        return payload?.session_id;
    }

    async checkPromoCode(promo_code) {
        // data is {"promo_code": "abc123xyz"}
        const payload = await this.post('/stripe/promo-code', { promo_code });
        return payload;
    }

    async setup() {
        const payload = await this.get('/stripe/setup');
        return payload || {};
    }

    async getPaymentHistory(start_date, end_date) {
        const payload = await this.post('/stripe/payment-history', { start_date, end_date });
        return payload || {};
    }
}

export default new PaymentService();
