import AbstractService from "../AbstractService";

class MailingListService extends AbstractService {
  constructor() {
    super();
  }
  async getMailingList() {
    const payload = await this.post("/admin/mailing_list", { mode: "list" });
    return payload.mailing_list || [];
  }

  async getMailingUsers(mailingId) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "get_members",
      mailing_list: { id: mailingId },
    });
    return payload.mailing_list || [];
  }

  async addMailingUsers(mailList) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "add_members",
      mailing_list: { id: mailList.id, member: mailList.member },
    });
    return payload.mailing_list || [];
  }

  async deleteMailingUsers(mailList) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "remove_members",
      mailing_list: { id: mailList.id, member: mailList.member },
    });
    return payload;
  }

  async createMailingList(mailList) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "create",
      mailing_list: mailList,
    });
    return payload;
  }

  async updateMailingList(mailList) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "update",
      mailing_list: mailList,
    });
    return payload;
  }

  async deleteMailingList(listId) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "delete",
      mailing_list: { id: listId },
    });
    return payload;
  }

  async hasMailingList(mailList) {
    const list = await this.getMailingList();
    const existingMail = list.filter((mail) => mail.name === mailList.name);
    if (existingMail.length > 0) return existingMail[0].id;
    return 0;
  }
}

export default new MailingListService();
