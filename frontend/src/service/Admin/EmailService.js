import AbstractService from "../AbstractService";

class EmailService extends AbstractService {
  constructor() {
    super();
  }

  async getEmailTemplateList() {
    const payload = await this.post("/admin/mailing_list", {
      mode: "list_template",
    });
    return payload.template || [];
  }

  async getEmailTemplate(templateName) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "get_template",
      template: { name: templateName },
    });
    return payload.template || [];
  }

  async addEmailTemplate(template) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "add_template",
      template: {
        name: template.name,
        template: template.template,
        subject: template.subject,
        description: template.desc,
      },
    });
    return payload.template || [];
  }

  async updateEmailTemplate(template) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "update_template",
      template: {
        name: template.name,
        template: template.template,
        subject: template.subject,
        description: template.desc,
      },
    });
    return payload.template || [];
  }

  async deleteEmailTemplate(templateName) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "delete_template",
      template: { name: templateName, type: 0 },
    });
    return payload;
  }

  async sendEmail(emailInfo) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "send",
      mailing_list: emailInfo.contacts,
      template_params: {
        name: emailInfo.name,
        from_name: emailInfo.from_name,
        subject: emailInfo.subject,
      },
    });
  }

  async sendOneEmail(emailInfo) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "send",
      mailing_list: { member: emailInfo.member },
      template_params: emailInfo.template_params,
    });
  }

  async addSchedule(emailInfo) {
    const payload = await this.post("/admin/mailing_list", {
      mode: "add_schedule",
      mailing_list: emailInfo.contacts,
      template_params: {
        name: emailInfo.name,
        from_name: emailInfo.from_name,
        subject: emailInfo.subject,
        mailing_schedule: emailInfo.schedule,
      },
    });
  }
}

export default new EmailService();
