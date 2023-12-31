import AbstractService from './AbstractService';
import * as ROUTES from '../constants/routes';

class CourseService extends AbstractService {
    constructor() {
        super();
        this._subjectsCache = null;
    }
    /**
     * Search course with keyword and return a list of course
     * Attribute of each course:
     * {
     *  title: string,
     *  description: string,
     *  date: string,
     *  author: string,
     *  channel: string,
     *  genre: string,
     *  views: number,
     *  likes: number,
     *  dislikes: number,
     *  thumbnail: string,
     *  duration: number,
     *  width: number,
     *  height: number,
     *  tags: string,
     *  vid: string
     * }
     */
    async search(keyword) {
        let payload = await this.post('/c/course/search', {
            mode: 'video',
            query: keyword,
        });
        return payload.video || [];
    }

    /**
     * Return a list of subject
     * Attribute of each subject:
     * {
     *  id: number
     *  name: string
     *  flag: number if it's 1, it may be a high school subject
     * }
     */
    async listSubjects() {
        if (!this._subjectsCache) {
            let payload = await this.post('/c/course/list', {
                mode: 'subject',
            });
            this._subjectsCache = payload.subject || [];
        }
        return this._subjectsCache;
    }

    /**
     * Return a list of categories in a subject
     * Attribute of each category:
     * {
     *  id: number
     *  name: string
     * }
     */
    async listCategoriesInSubject(subjectId) {
        let payload = await this.post('/c/course/list', {
            mode: 'subject',
            id: subjectId,
        });
        return payload.subject || [];
    }

    /**
     * Return a list of courses in a category
     * Attribute of each course:
     * {
     *  id: number
     *  title: string
     * }
     */
    async listCoursesInCategory(categoryId) {
        let payload = await this.post('/c/course/list', {
            mode: 'course',
            id: categoryId,
        });
        return payload.course || [];
    }

    /**
     * Return a list of units in a course
     * Attribute of each unit:
     * {
     *  id: number
     *  unit_number: number
     *  topic: string
     *  description: string
     *  section_number: number
     *  section: string
     * }
     */
    async listUnitsInCourse(courseId) {
        let payload = await this.post('/c/course/list', {
            mode: 'unit',
            id: courseId,
        });
        return payload.unit || [];
    }

    async listUnitVideo(unitId) {
        let payload = await this.post('/c/course/list', {
            mode: 'unit_video',
            id: unitId,
        });
        return payload.video || [];
    }

    async recommend() {
        try {
            let payload = await this.get('/c/course/recommend');
            return payload.video || [];
        } catch (e) {
            console.error(e);
            throw new Error('Recommendation is unavailable');
        }
    }

    /**
     * Change the youtube url to the embed format, which
     * is the one iframe can use to play it
     * details see https://stackoverflow.com/questions/51976152/refused-to-display-https-www-youtube-com-watchv-okzrsbjqjos-in-a-frame-beca
     */
    getEmbedUrl(vid) {
        try {
            return `https://www.youtube.com/embed/${vid}`;
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    /**
     * general a watch url based on course info
     * basic url format:
     * ...?title=...&des=...&vid=...
     */
    getWatchURL(course) {
        const { title, description, vid, from } = course;
        const params = [
            {
                key: 'title',
                value: title,
            },
            {
                key: 'des',
                value: description,
            },
            {
                key: 'vid',
                value: vid,
            },
            {
                key: 'from',
                value: from || window.location.pathname,
            },
        ];
        let searchParams = new URLSearchParams();
        params.forEach(({ key, value }) => {
            if (value) {
                searchParams.append(key, value);
            }
        });
        return `${ROUTES.COURSE_WATCH}?${searchParams.toString()}`;
    }

    /**
     * Parse the watch url generated by getWatchURL
     * Basic format:
     * {
     *  title: string,
     *  description: string,
     *  url: string
     * }
     * Return null if parse failed
     */
    parseWatchURL(url) {
        try {
            let paramsString = url.split('?')[1];
            if (paramsString) {
                let searchParams = new URLSearchParams(paramsString);
                return {
                    title: searchParams.get('title'),
                    description: searchParams.get('des'),
                    vid: searchParams.get('vid'),
                    from: searchParams.get('from'),
                };
            }
        } catch (e) {
            console.error(e);
        }
        return null;
    }
}

export default new CourseService();
