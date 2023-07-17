import AbstractService from "./AbstractService";

class EssayService extends AbstractService {
    /**
     * Syntax of query attribute is following a Lucene grammar
     * example:
     * 1. ‘god’ or ‘father’: "god+father"
     * 2. ‘god’ and ‘father’: (god)AND(father)
     * 3. search for a regular expression: "sovi*"
     * 4. search for a title field only: "title:father"
     * 
     * Return a list of essays, each with attributes:
     * author: string
     * title: string
     * college: string
     * text: string
     * analysis: string
     * url: string
     * year: string
     * theme: string
     * prompt: string
     * word_count: number
     */
    async search(query) {
        const data = {
            mode: "Raw",
            query
        };
        const payload = await this.post('/c/essay/search', data);
        return payload.essays || [];
    }

    /**
     * Recommended essay
     * the data structure is the same as search
     */
    async recommend() {
        const payload = await this.get('/c/essay/recommend');
        return payload.essays || [];
    }

    /**
     * Return a list of essays based on given essay ids
     * @param {number[]} ids 
     */
    async getEssays(ids) {
        const data = {
            essay_id: ids,
        };
        const payload = await this.post('/c/essay/get', data);
        return payload.essays || [];
    }

    /**
     * Return essay info given an essay ID.
     * repeated EssayInfo essay_info
     *  uint64 essay_id
     *  uint32 cluster_id
     * repeated Word_cloud word_cloud
     *  string word
     *  float freq
     * repeated SimilarEssay similar_essay
     *  uint64 essay_id
     *  float similarity
     * @param {number} id 
     */
    async getInfo(id) {
        const data = {
            essay_id: [id],
        };
        const payload = await this.post('/c/essay/info', data);
        const essay_info = payload.essay_info || [];
        return essay_info[0];
    }

    /**
     * Return essay clusters.
     * Response
     * repeated ClusterInfo cluster_info
     *  uint32 id
     *  uint64 center_essay_id
     *  repeated Word_cloud word_cloud
     *     string word
     *     float freq
     */
    async getClusters() {
        const payload = await this.get('/c/essay/clusters');
        return payload.cluster_info || [];
    }

    /**
     * Return essays in a given cluster.
     * Response
     * repeated Essay essays
     *  uint32 id
     * @param {number} cluster_id 
     */
    async getClusterEssayIds(cluster_id) {
        const data = {
            cluster_id,
        };
        const payload = await this.post('/c/essay/cluster_essays', data);
        const essays =  payload.essays || [];
        return essays.map(({ id }) => id);
    }
}

export default new EssayService();