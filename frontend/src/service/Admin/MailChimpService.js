import AbstractService from "../AbstractService";

class MailChimpService extends AbstractService {
  constructor() {
    super();
  }
  async getList() {
    const payload = await this.post("/admin/mailchimp", { mode: "list" });
    return payload.mailing_list || [];
  }

  async getListSegment(listId) {
    const payload = await this.post("/admin/mailchimp", {
      mode: "list_segment",
      mailing_list: { chimp_id: listId },
    });
    return payload.mailing_list[0].segment || [];
  }

  async createList(mailList) {
    const payload = await this.post("/admin/mailchimp", {
      mode: "create_list",
      mailing_list: mailList,
    });
    return payload.counts || [];
  }
}

export default new MailChimpService();
