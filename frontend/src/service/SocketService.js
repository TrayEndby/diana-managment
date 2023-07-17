import AbstractService from './AbstractService';
import authService from './AuthService';
import { defer } from '../util/helpers';

const Events = {
    Notification: 'Notification',
    Message: 'Message',
};

class SocketService extends AbstractService {
    constructor() {
        super();
        this.socket = null;
        this.isOpen = false;
        this.events = {};
        this.sentDefers = {};
    }

    connect() {
        // let socket = new WebSocket("wss://vm.kyros.ai:24000/ws/?auth_params=eyJTRUNSRVQiOiJtNzVqbmJFeG5iMHh6RDdTZmZwTXpaaWQ1IiwiQVVUSC1FTUFJTCI6ImN6aGFuZ0BreXJvcy5haSIsIkFVVEgtVE9LRU4iOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKMWFXUWlPaUl6YzB4aWVqTkdlbGRpYURWSWJrTkxZalZTZWsxUWRsVmhTWE14SWl3aVpXMWhhV3dpT2lKamVtaGhibWRBYTNseWIzTXVZV2tpTENKbGVIQWlPakUxT1Rrd01qQTFORE45Lmg1X1lnZ3dONTBsVkhRS2o4ZjRVeFJDRHlUUzQxR2gzcE5yUkNzN19ZbjgiLCJBVVRILVVJRCI6IjNzTGJ6M0Z6V2JoNUhuQ0tiNVJ6TVB2VWFJczEifQ%3D%3D&EIO=3&transport=websocket")
        this.socket = this.socketConnect();
        this.setupEvents();
    }

    setupEvents() {
        const socket = this.socket;

        socket.onopen = () => {
            this.isOpen = true;
        };

        /**
         * Return structure:
         * {msg: [{sourceUserId, sourceUserName, targetUserId, content}]}
         */
        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // This a ping message from the server, reply a pong message.
                if (data.control && data.control === 'PING') {
                    try {
                        // To set a short user status message, we can use
                        //   const pong = {mode: 'PONG', msg: [{content: '<STATUS>'}]};
                        const pong = { mode: 'PONG' };
                        this.socket.send(JSON.stringify(pong));
                    } catch (e) {
                        console.error(e);
                    }
                    return;
                }

                if (!data.msg) {
                    if (data.msg_id) {  // the field is 'msg_id' in the json response.
                        this._receiveSendResponse(data.msg_id);
                    }
                    return; // normal case
                }

                const msg = data.msg[0];
                const { sourceUserName, targetUserId, content } = msg;

                if (targetUserId && targetUserId !== authService.getUID()) {
                    return;
                }
                // const parsedContent = JSON.parse(content);
                const notificationCallback = this.events[Events.Notification];

                if (typeof notificationCallback === 'function') {
                    notificationCallback(sourceUserName);
                }

                if (!Object.keys(content).includes('path')) {
                    const msgCallback = this.events[Events.Message];
                    if (typeof msgCallback === 'function') {
                        msgCallback(msg);
                    }
                }
            } catch (e) {
                console.error(e);
            }
        };

        socket.onerror = (event) => {
            console.error('error', event);
        };

        socket.onclose = (event) => {
            setTimeout(() => {
                this.socket = this.socketConnect();
                this.setupEvents();
            }, 1000);
        };
    }

    registerEvent(name, callback) {
        this.events[name] = callback;
    }

    unregisterEvent(name) {
        delete this.events[name];
    }

    addNotificationEvenListener(callback) {
        this.registerEvent(Events.Notification, callback);
    }

    addMessageEvenListener(callback) {
        this.registerEvent(Events.Message, callback);
    }

    removeMessageEvenListener() {
        this.unregisterEvent(Events.Message);
    }

    async sendNotification(target_user_id, content, target_group_id, type, reply_to) {
        if (!this.isOpen) {
            return false;
        }
        const msg_id = this._genMsgId();
        const msg = {
            mode: 'send',
            msg: {
                type,
                target_user_id,
                target_group_id,
                content: JSON.stringify(content),
                reply_to
            },
            msg_id,
        };

        const defer = this._genDefer(msg_id);
        this.socket.send(JSON.stringify(msg));
        await defer.promise;
        return true;
    }

    _genMsgId() {
        return authService.genId();
    }

    _genDefer(msgId) {
        const deferred = defer();
        const timeout = setTimeout(() => {
            deferred.reject('Send message time out');
        }, 5 * 1000); // timeout after 5s
        this.sentDefers[msgId] = {
            deferred,
            timeout,
        };
        return deferred;
    }

    _receiveSendResponse(msgId) {
        if (!this.sentDefers[msgId]) {
            return;
        }
        const { deferred, timeout } = this.sentDefers[msgId];
        clearTimeout(timeout);
        deferred.resolve();
        delete this.sentDefers[msgId];
    }
}

export default new SocketService();
