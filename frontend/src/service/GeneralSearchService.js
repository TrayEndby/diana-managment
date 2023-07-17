import AbstractService from './AbstractService';
import courseService from './CourseService';
import * as ROUTES from '../constants/routes';

const CATEGORY = {
    VIDEO: 'video',
    ESSAY: 'essay',
    ECA: 'eca_program',
    COLLEGE: 'college_entity',
    PODCAST: 'podcast',
    ARTICLE: 'article',
};

const NO_SEARCH_RESULTS = 'No results, try something else';

class GeneralSearchService extends AbstractService {
    /**
     *
     * @param {*} keyword
     * @param {*} section a list of sections.
     * If present, get a list of corresponding sections, if not, return all sections.
     * Valid sections: video, essay, eca, college,
     * resource:all, resource:podcast, resource:article
     * @param {*} recommend is for recommend or not
     */
    async search(keyword, section, recommend) {
        const payload = await this.post('/search', {
            query: keyword,
            section,
            recommend
        });
        return payload || [];
    }

    async searchWithNormalization(keyword, section, recommend) {
        const results = await this.search(keyword, section, recommend);
        return this._normalizeResults(results);
    }

    _normalizeResults(results) {
        delete results.total_resource;
        if (Object.keys(results).length === 0) {
            return NO_SEARCH_RESULTS;
        }

        results = this._splitResults(results);
        results = this._constructUrl(results);
        results = this._sortProperties(results);
        return results;
    }

    _splitResults(results) {
        const { resource } = results;
        if (resource) {
            const podcasts = [];
            const articles = [];
            resource.forEach((item) => {
                if (item.type === 1) {
                    articles.push(item);
                } else {
                    podcasts.push(item);
                }
            });
            results[CATEGORY.ARTICLE] = articles;
            results[CATEGORY.PODCAST] = podcasts;
            delete results.resource;
        }
        return results;
    }

    _constructUrl(results) {
        Object.keys(results).forEach((key) => {
            if (key === CATEGORY.COLLEGE && results[key]) {
                results[key].forEach((item) => (item.searchUrl = `${ROUTES.COLLEGE_DETAIL}?collegeId=${item.id}`));
            } else if (key === CATEGORY.VIDEO && results[key]) {
                results[key].forEach((item) => (item.searchUrl = courseService.getWatchURL(item)));
            } else if (key === CATEGORY.ECA && results[key]) {
                results[key].forEach((item) => (item.searchUrl = `${ROUTES.PROGRAM_DETAILS}?programId=${item.id}`));
            } else if (key === CATEGORY.PODCAST && results[key]) {
                results[key].forEach((item) => (item.searchUrl = `${ROUTES.RESOURCES_PODCASTS_DETAIL}/${item.id}`));
            } else if (key === CATEGORY.ARTICLE && results[key]) {
                results[key].forEach((item) => (item.searchUrl = `${ROUTES.RESOURCES_ARTICLES_DETAIL}/${item.id}`));
            } else if (key === CATEGORY.ESSAY && results[key]) {
                results[key].forEach((item) => (item.searchUrl = `${ROUTES.ESSAY_PUBLIC}/${item.id}`));
            }
        });
        return results;
    }



    // for putting colleges to top of search results
    _sortProperties(obj) {
        if (!obj.hasOwnProperty('college_entity')) {
            return obj;
        };
        const { college_entity, ...rest } = obj;
        return { college_entity, ...rest };
    }
}

export default new GeneralSearchService();

export { CATEGORY, NO_SEARCH_RESULTS };
