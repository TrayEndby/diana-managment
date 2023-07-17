import AbstractService from '../AbstractService';

class CSAContactsService extends AbstractService {
    
    /**
     * get customers referred by the CSA
     * customer list of
     *  string user_id
     *  string name
     *  string phone
     *  string email
     *  bool is_student
     *  SchoolInfo - if is student
     *      string nam
     *      string city
     *      string state
     *      string zip
     *      string graduation_date
     * int num_of_children - if is parent
     * string children - children names if is parent
     * string subscription_start_date
     * string subscription_renew_date
     * float subscription_amount
     */
    async getCustomers() {
        const customers = await this.post('/csa/getCustomers');
        if (customers == null) {
            return [];
        }
        return customers.customer;
    }

    async getTeamMembers() {
        const teamMembers = await this.post('/csa/getTeamMembers');
        if (teamMembers == null) {
            return [];
        }
        return teamMembers.teamMember;
    }
}

export default new CSAContactsService();
