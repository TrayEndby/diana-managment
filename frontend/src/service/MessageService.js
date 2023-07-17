import AbstractService from './AbstractService';
import authService from './AuthService';
import { sortByDate } from 'util/helpers';
import { STORAGE_READED_MSG_TIMESTAMP } from 'constants/storageKeys';

class MessageService extends AbstractService {
    /**
     * @param {string} to: user_id to send to
     * @param {object} content: JSON of content, which can include:
     * text: string,
     * path: string
     */
    async send(to, content, type) {
        const data = {
            mode: 'send',
            msg: {
                type,
                target_user_id: to,
                content: JSON.stringify(content),
            },
        };
        return this.post('/messaging', data);
    }

    /**
     * array of message, each item includes:
     * source_user_id: string
     * source_user_name: string
     * content: stringified JSON
     * created_ts: timestamp
     * id: number
     */
    async list() {
        const data = {
            mode: 'list',
        };
        const payload = await this.post('/messaging', data);
        return this._normalizeMessage(payload.msg || []);
    }

    /**
     * array of message from specific group from each item includes:
     * source_user_id: string
     * source_user_name: string
     * content: stringified JSON
     * created_ts: timestamp
     * id: number
     */
    async listGroupMessages(groupId, msgId) {
        const data = {
            mode: 'list',
            msg: {
                id: msgId,
                target_group_id: groupId
            }
        };
        const payload = await this.post('/messaging', data);
        return this._normalizeMessage(payload.msg || []);
    }

    /**
     * array of message, each item includes:
     * source_user_id: string
     * source_user_name: string
     * content: stringified JSON
     * created_ts: timestamp
     * id: number
     */
    async listUserMessages(userId, msgId) {
        const data = {
            mode: 'list',
            msg: {
                id: msgId,
                source_user_id: userId
            }
        };
        const payload = await this.post('/messaging', data);
        return this._normalizeMessage(payload.msg || []);
    }

    /**
     * array of message, each item includes:
     * target_user_id: string
     * target_user_name: string
     * content: stringified JSON
     * created_ts: timestamp
     * id: number
     */
    async listSentMessages() {
        const data = {
            mode: 'list_sent_messages',
        };
        const payload = await this.post('/messaging', data);
        return this._normalizeMessage(payload.msg || []);
    }

    async listSentMessagesToUser(userId, msgId) {
        const data = {
            mode: 'list_sent_messages',
            msg: {
                id: msgId,
                target_user_id: userId
            }
        };
        const payload = await this.post('/messaging', data);
        return this._normalizeMessage(payload.msg || []);
    }

    async listSentMessagesToGroup(groupId) {
        const data = {
            mode: 'list_sent_messages',
            msg: {
                target_group_id: groupId
            }
        };
        const payload = await this.post('/messaging', data);
        return this._normalizeMessage(payload.msg || []);
    }

    async listNotification() {
        const mergedRes = await this._listNotification();

        const sortedByDate = sortByDate(mergedRes).reverse();
        const lastMsgTimestamp = sortedByDate[0]?.created_ts;
        let readMsgTimestamp = localStorage.getItem(
            STORAGE_READED_MSG_TIMESTAMP,
        );

        if (!readMsgTimestamp) {
            readMsgTimestamp = lastMsgTimestamp;
            localStorage.setItem(
                STORAGE_READED_MSG_TIMESTAMP,
                readMsgTimestamp,
            );
        }

        let unreadMsgCount = 0;
        if (lastMsgTimestamp !== readMsgTimestamp) {
            unreadMsgCount = sortedByDate.findIndex(
                (item) => item.created_ts === readMsgTimestamp,
            );
        }
        return [sortedByDate, unreadMsgCount];
    }

    async _listNotification() {
        const data = {
            mode: 'list_notification',
        };
        const payload = await this.post('/messaging', data);
        return this._normalizeMessage(payload.msg || []);
    }
    
    /**
     * Return message from a specific user,
     * same return structure as list
     */
    async retrieve() {
        const data = {
            mode: 'retrieve',
            msg: {
                source_user_id: authService.getUID(),
            },
        };
        const payload = await this.post('/messaging', data);
        return this._normalizeMessage(payload.msg || []);
    }

    /**
     * status is number,
     * all statuses are in messaging {mode: const}
     */
    async setMsgStatus(msgId, status) {
        const data = {
            mode: 'set_message_status',
            msg: {
                id: msgId,
                status,
            },
        };
        const payload = await this.post('/messaging', data);
        return payload || {};
    }

    async setMsgStatusToUser(msgId, status, source_user_id) {
        const data = {
            mode: 'set_message_status',
            msg: {
                id: msgId,
                status,
                source_user_id
            },
        };
        const payload = await this.post('/messaging', data);
        return payload || {};
    }

    async setMsgStatusToGroup(msgId, status, target_group_id) {
        const data = {
            mode: 'set_message_status',
            msg: {
                id: msgId,
                status,
                target_group_id
            },
        };
        const payload = await this.post('/messaging', data);
        return payload || {};
    }

    async getMsg(msgId) {
        const data = {
            mode: 'get',
            msg: {
                id: msgId
            },
        };
        const payload = await this.post('/messaging', data);
        return payload || {};
    }

    _normalizeMessage(messages) {
        return messages.map((message) => {
            let content = null;
            try {
                content = message.content ? JSON.parse(message.content) : {};
            } catch (e) {
                console.error(e);
            }
            return {
                ...message,
                content,
            };
        });
    }

    /**
        get the number of unread messages and groups in past 30 days
        uint64 target_group_id
        string target_group_name
        string source_user_id
        string source_user_name
    */
    async getAllUnreadMessages() {
        const data = {
            mode: 'list_status',
        };
        const payload = await this.post('/messaging', data);
        return payload || {};
    }

    async getUnreadMessagesByUserId(source_user_id) {
        const data = {
            mode: 'list_status',
            msg: {
                source_user_id
            }
        };
        const payload = await this.post('/messaging', data);
        return payload || {};
    }

    async getUnreadMessagesByGroupId(target_group_id) {
        const data = {
            mode: 'list_status',
            msg: {
                target_group_id
            }
        };
        const payload = await this.post('/messaging', data);
        return payload || {};
    }
}

export default new MessageService();
