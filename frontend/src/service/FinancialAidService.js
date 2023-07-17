import AbstractService from './AbstractService';

class FinancialAidService extends AbstractService {
  constructor() {
    super();
    this.constPromise = null;
  }

  async GetFinAidConstants() {
    if (!this.constPromise) {
      // const value, cache the request in fontend and only request once
      this.constPromise = this.post('/c/finaid/const', {});
    }
    const payload = await this.constPromise;
    return payload.const_values || {};
  }

  async GetFinAidSearch(data) {
    const { from = 0, search_name = '', ...rest } = data;
    const payload = await this.post('/c/finaid/search', { "from": from, "query": search_name, "field": { ...rest } })
    return payload || [];
  }

  async GetFinAidList(data) {
    // send array of finaid_ids [{"finaid_id":717}, {"finaid_id":718}] and get full info for each one
    const payload = await this.post('/c/finaid/list', { "finaid": [...data] })
    return payload.program || [];
  }

  async GetUserFinAidList() {
    const payload = await this.get('/c/finaid/get_user_finaid')
    return payload.finaid || [];
  }

  async AddUserFinAid(data) {
    /* data = {
      finaid_id: number 
      status: number
    } */
    const payload = await this.post('/c/finaid/add_user_finaid', { "finaid": data })
    return payload.finaid || [];
  }

  async UpdateUserFinAid(data) {
    /* data = {
      finaid_id: number 
      status: number
    } */
    const payload = await this.post('/c/finaid/update_user_finaid', { "finaid": data })
    return payload.finaid || [];
  }

  async DeleteUserFinAid(id) {
    /* data = {
      finaid_id: number 
      status: number
    } */
    const payload = await this.post('/c/finaid/delete_user_finaid', { "finaid": [{ "finaid_id": id }] })
    return payload.finaid || [];
  }
}

export default new FinancialAidService();
