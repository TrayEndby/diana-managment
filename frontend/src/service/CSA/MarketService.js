import AbstractService from '../AbstractService';
import moment from 'moment-timezone';

class CSAMarketingService extends AbstractService {
    constructor() {
        super();
        this.videosCache = null;
        this.flyersCache = null;
        this.webinarsCache = null;
        this.slidesCache = null;
    }

    /**
     * @param AUTH_UID (optional) for public access to use
     *
     * Return CSA videos
     * @return videos:
     * tags: string
     * url: string
     * title: string
     * source: string
     * type: number
     * id: number
     */
    async listVideos(AUTH_UID, tags) {
        let videoList;
        if (this.videosCache == null) {
            this.videosCache = await this._getResourceByType(3, AUTH_UID);
        }
        if (tags != null) {
            videoList = this.videosCache.filter((video) => video.tags === tags);
        } else {
            videoList = this.videosCache;
        }
        return videoList;
    }

    /**
     * @param AUTH_UID (optional) for public access to use
     * Return CSA Flyers
     * @return flyers:
     * tags: string
     * url: string
     * title: string
     * type: number
     * id: number
     */
    async listFlyers(AUTH_UID) {
        if (this.flyersCache == null) {
            this.flyersCache = await this._getResourceByType(4, AUTH_UID);
        }
        return this.flyersCache;
    }

    /**
     * @param AUTH_UID (optional) for public access to use
     *
     * Return CSA webinars
     * @return webinars:
     * description: string
     * id: number
     * location: string
     * object_id: number
     * picture_id: number
     * source: string
     * startDate: string
     * tags: string
     * title: string
     * type: number
     * url: string
     */
    async listWebinars(tag, AUTH_UID) {
        let resourceList = (await this._getResourceByType(5, AUTH_UID)) || [];
        if (tag != null)
            resourceList = resourceList.filter((res) => res.tags === tag);
        this.webinarsCache = await Promise.all(
            resourceList.map((res) =>
                this.fillWebinarEventInfo(res, AUTH_UID),
            ),
        );

        return this.webinarsCache;
    }

    async listWebinarResources(AUTH_UID) {
      const resourceList = (await this._getResourceByType(5, AUTH_UID)) || [];
      return resourceList;
    }

    async getWebinarById(id, isPublic) {
        const data = {
            resource: { id, type: 5 },
        };
        let payload;
        if (!isPublic) payload = await this.post('/resources/get', data);
        else payload = await this.post('/p/resources/get', data);
        if (!payload.resource) {
            return null;
        }
        const resource = await this.fillWebinarEventInfo(payload.resource[0]);
        return resource;
    }

    async getAllRegistrants() {
      let payload = await this.post('/cal/all_event_registrants');
      if (!payload.calendar || !payload.calendar[0].event ||
          !payload.calendar[0].event[0].registrant) {
        return null;
      }
      return {
        calendarEvent: payload.calendar[0].event[0],
      };
    }

    async fillWebinarEventInfo(res, AUTH_UID) {
        const event = await this._getEventById(
            [{ id: res.object_id }],
            AUTH_UID,
        );
        if (event.length !== 0) {
            const calendarEvent = event[0].event[0];
            const location = calendarEvent.resource;
            const date = moment.utc(
                calendarEvent.start,
                'YYYY-MM-DD hh:mm::ss',
            );
            const duration = moment
                .utc(calendarEvent.end)
                .diff(date, 'minutes');
            const duration_str = `${duration} minutes`;
            const western_date = moment(date).tz('America/Los_Angeles');
            const date_str = western_date.format('MMMM DD, YYYY');
            const time_str = western_date.format('h A');
            const eastern_time = moment(date)
                .tz('America/New_York')
                .format('h A');
            const url = event[0].event[0].info.url;
            const startDateString = `${date_str} | ${time_str} PST/${eastern_time} EST`;
            return {
                ...res,
                location,
                videoURL: res.url,
                url,
                startDateTime: date,
                startDate: startDateString,
                duration: `${duration_str}`,
                calendarEvent,
            };
        } else {
            return res;
        }
    }

    async _getResourceByType(type, AUTH_UID, flag) {
        let data;
        if (flag == null) {
            data = {
                resource: { type },
            };
        } else {
            data = {
                resource: { type, flag },
            };
        }
        let payload;
        if (AUTH_UID)
            payload = await this.post('/resources/list', data, AUTH_UID);
        else payload = await this.post('/p/resources/list', data, AUTH_UID);
        return payload.resource || [];
    }

    async _getEventById(idList, AUTH_UID) {
        const data = {
            calendar: { event: idList },
        };
        let payload;
        if (AUTH_UID)
            payload = await this.post('/cal/get_event', data, AUTH_UID);
        else payload = await this.post('/p/cal/get_event', data, AUTH_UID);
        return payload.calendar || [];
    }

    async addInvitee(inviteInfo, isPublic) {
        const data = {
            calendar: inviteInfo,
        };
        let api = '/cal/add_invitee';
        if (isPublic) {
            api = '/p/cal/add_invitee';
        }
        try {
            await this.post(api, data);
            return 1;
        } catch (e) {
            if (e.message.includes('Duplicate entry')) {
                return 2;
            }
            return 3;
        }
    }

    async deleteInvitee(idList) {
        const data = {
            calendar: { event: idList },
        };
        const payload = await this.post('/cal/delete_invitee', data);
        return payload;
    }

    async getProductUpdates() {
        const payload = await this._getResourceByType(6, null, 1);
        return payload;
    }

    async listSlides(AUTH_UID) {
        if (this.slidesCache == null) {
            this.slidesCache = await this._getResourceByType(8, AUTH_UID);
        }
        return this.slidesCache;
    }
}

export default new CSAMarketingService();
