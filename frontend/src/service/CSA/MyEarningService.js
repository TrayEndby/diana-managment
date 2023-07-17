import AbstractService from '../AbstractService';

class CSAMyEarningService extends AbstractService {
    constructor() {
        super();
        this.earningReport = null;
    }
    
    async getEarningReport(startDate = null, endDate = null) {
        const param = {};
        if (startDate != null) param.earning_start_date = startDate;
        if (endDate != null) param.earning_end_date = endDate;
        const payload = await this.post('/csa/getEarningReport', param);
        
        if (payload.earning == null) {

            return null;
        }
        
        this.earningReport = payload.earning;
        return payload.earning;
    }    
}

export default new CSAMyEarningService();
