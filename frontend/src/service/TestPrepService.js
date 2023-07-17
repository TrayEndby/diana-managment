import AbstractService from './AbstractService';

class TestPrepService extends AbstractService {
    /**
     * Search course with keyword and return a list of course for test prep
     * (very similar to courseService.search)
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
        let payload = await this.post('/c/testprep/search', {
            query: keyword,
        });
        return payload.video || [];
    }

    /**
     * Return a list of courses in a category
     * (very similar to courseService.listCoursesInCategory)
     * Attribute of each course:
     * {
     *  id: number
     *  title: string
     * }
     */
    async listCourses() {
        let payload = await this.get('/c/testprep/list');
        return payload.course || [];
    }
}

export default new TestPrepService();
