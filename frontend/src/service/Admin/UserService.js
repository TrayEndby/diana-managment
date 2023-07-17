import AbstractService from "../AbstractService";

class AdminUserService extends AbstractService {
  constructor() {
    super();
  }

  async getSignedUpUsers(param) {
    const payload = await this.post("/backendoffice/getUserInfo", param);
    return payload.userInfos || [];
  }

  async getUserTransactions(param) {
    const payload = await this.post("/backendoffice/getUserTransactions", param);
    return payload.userTransactions || [];
  }

  async getCSAByCodes(param) {
    const payload = await this.post("/backendoffice/getCSAByCodes", param);
    return payload.userInfos || [];
  }

  async getListByTag(tag) {
    const payload = await this.post("/admin/kv", {
      mode: "list",
      kv: { tag: tag },
    });
    return payload.kv || [];
  }

  async updateList(tag, key, list) {
    const payload = await this.post("/admin/kv", {
      mode: "update",
      kv: { tag: tag, key: key, value: list },
    });
    return payload || [];
  }

  async deleteList(key) {
    const payload = await this.post("/admin/kv", {
      mode: "delete",
      kv: { key: key },
    });
    return payload || [];
  }

  async insertOrUpdateResource(article) {
    const payload = await this.post("/admin/resource", {
      mode: "insert_or_update",
      article: article,
    });
    return payload || [];
  }

  async deleteResource(id) {
    const payload = await this.post("/admin/resource", {
      mode: "delete",
      article: { id: id },
    });
    return payload || [];
  }

  async approveRoles(roles, ml) {
    const payload = await this.post("/backendoffice/AddUserRoles", {
      userRoles: roles,
    });
    if (payload) {
      const result = await this.post("/admin/mailing_list", {
        mode: "send",
        mailing_list: {
          member: ml.members,
        },
        template_params: {
          name: ml.template,
          from_name: ml.fromName,
          cc_email: ml.ccEmail,
          cc_name: ml.ccName,
        },
      });
      return result || [];
    }
    return payload || [];
  }

  async revokeRoles(roles) {
    const payload = await this.post("/backendoffice/RemoveUserRoles", {
      userRoles: roles,
    });
    return payload || [];
  }

}

export default new AdminUserService();
