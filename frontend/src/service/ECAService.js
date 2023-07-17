import AbstractService from './AbstractService';
import UserProfileSearchService from './UserProfileSearchService';
import PlayListService from './PlayListService';
import CollaborationService from './CollaborationService';
const SAVED_PROGRAMS_KEY = 'SAVED_PROGRAMS_KEY';

class ECAService extends AbstractService {
    constructor() {
        super();
        this.categoriesCache = null;
        this.organizationsCache = {};
        this.otherType = null;
    }

    getCategories = async () => {
        if (!this.categoriesCache) {
            const response = await this.post('/eca/list', { mode: 'category' });
            this.categoriesCache = this._moveOtherCategoryToLast(response.category || []);
        }

        return this.categoriesCache;
    };

    getTypesByCategory = async (categoryID) => {
        const { type: types } = await this.post('/eca/list', { mode: 'type', id: categoryID });
        return types || [];
    };

    getProgramsByType = async (typeID) => {
        const { program: programs } = await this.post('/eca/list', { mode: 'program', id: typeID });
        return programs || [];
    };

    createProgram = async (title, pic, country_code, state, city, tags, overview, description, url, categoryId, typeId) => {
        const response = await this.post('/eca/create_program', {
            program: {
                title,
                country_code,
                state,
                city,
                tags,
                overview,
                description,
                url,
                category: categoryId,
                type: typeId,
            },
        });

        const id = response.program[0].id;

        if (pic) {
            try {
                const picture_id = await CollaborationService._uploadPic(id, pic);
                await this.updateProject(id, {
                    ...response.program[0],
                    picture_id,
                });
            } catch (e) {
                console.error(e);
            }
        }

        return response.program[0];
    };

    createProgramBySaved = async (title, pic, country_code, state, city, tags, overview, description, url, categoryId, typeId) => {
        const response = await this.post('/eca/create_program', {
            program: {
                title,
                country_code,
                state,
                city,
                tags,
                overview,
                description,
                url,
                category: categoryId,
                type: typeId,
            },
        });

        const data = response.program[0];

        if (pic) {
            try {
                const picture_id = await CollaborationService._uploadPic(data.id, pic);
                await this.updateProject(data.id, {
                    ...response.program[0],
                    picture_id,
                });
            } catch (e) {
                console.error(e);
            }
        }

        try {
            await this.addProgramToSaved(data.id, data.title);
        } catch (e) {
            console.error(e);
        }

        return data;
    };

    /**
     * data structure is the same as creatProject
     */
    async updateProject(id, data) {
        let picture_id = data.picture_id;
        return this.post('/eca/update_program', {
            // ...data,
            program: {
                id,
                picture_id,
            },
        });
    }

    getCurrentPrograms = async () => {
        const response = await this.post('/profile/search', {
            mode: 1,
        });
        const { extraCurricular } = response.profile;
        const programIds = extraCurricular ? extraCurricular.map((i) => i.program_id) : [];
        const result = [];
        for (const id of programIds) {
            const program = await this.getProgramDetails(id);
            result.push({ ...program, id });
        }
        return result;
    };

    getProgramDetails = async (programId) => {
        if (!programId) {
            return null;
        }
        const response = await this.post('/eca/get_program', {
            program: {
                id: programId,
            },
        });

        return response.program ? response.program[0] : null;
    };

    /**
     *
     * @param {Object} extendedProgram
     * @param {number} extendedProgram.category_id
     * @param {number} extendedProgram.type_id
     * @param {number} extendedProgram.category_id
     * @param {number} extendedProgram.program_id
     * @param {string} extendedProgram.role
     * @param {string} extendedProgram.frequency
     * @param {string} extendedProgram.beginDate
     * @param {string} extendedProgram.endDate
     * @param {string} extendedProgram.place
     * @param {string} extendedProgram.description
     * @param {string[]} extendedProgram.achievement
     */
    addToCurrentPrograms = async (extendedProgram) => {
        return UserProfileSearchService.insertECAInfo([extendedProgram]);
    };

    getOrganizationDetails = async (categoryId, organizationId) => {
        const response = await this.post('/eca/list', { mode: 'type', id: categoryId });
        const organization = response.type.find(({ id }) => id === organizationId);
        return organization;
    };

    // findPrograms = async (query) => {
    //     const response = await this.post('/eca/search', { mode: 'program', query });
    //     return response.program || [];
    // };

    findPrograms = async (query, fromRows) => {
        const response = await this.post('/eca/search', {
            mode: 'program',
            query: query.query,
            from: fromRows,
            program: { ...query.program },
        });
        const program = response.program ? response.program : [];
        const totalRows = response.total_results ? response.total_results : 0;
        return {program, totalRows};
    };

    getCategoryDetails = async (categoryId) => {
        const categories = await this.getCategories();
        const category = categories.find(({ id }) => id === categoryId);
        return category;
    };

    getOrganizationsByCategory = async (categoryId) => {
        if (this.organizationsCache[categoryId] == null) {
            const response = await this.post('/eca/list', { mode: 'type', id: categoryId });
            this.organizationsCache[categoryId] = await this._addOtherType(response.type);
        }
        return this.organizationsCache[categoryId];
    };

    getSummerPrograms = async () => {
        const {
            type: [program],
        } = await this.post('/eca/list', { mode: 'type', id: 21 });
        const { program: programs } = await this.post('/eca/list', { mode: 'program', id: program.id });

        return programs;
    };

    getSavedProgramsPlaylist = async () => {
        const playlists = await PlayListService.listECAs();
        let savedProgramsPlaylist = playlists.find((i) => i.name === SAVED_PROGRAMS_KEY);
        if (!savedProgramsPlaylist) {
            const { list: newPlaylists } = await PlayListService.addECAList(SAVED_PROGRAMS_KEY);
            savedProgramsPlaylist = newPlaylists.find((i) => i.name === SAVED_PROGRAMS_KEY);
        }
        return savedProgramsPlaylist;
    };

    getSavedPrograms = async () => {
        const savedProgramsPlaylist = await this.getSavedProgramsPlaylist();
        const { item: savedPrograms = [] } = await PlayListService.getECAListById(savedProgramsPlaylist.id);

        const result = [];
        for (const program of savedPrograms) {
            if (program.eca_program.title) {
                result.push(program.eca_program);
            } else {
                if (!program.eca_program || !program.eca_program.id) {
                    continue;
                }
                const fullProgram = await this.getProgramDetails(program.eca_program.id);
                result.push({ ...fullProgram, id: program.eca_program.id });
            }
        }

        return {
            savedPrograms: result,
            playlistId: savedProgramsPlaylist.id,
        };
    };

    addProgramToSaved = async (programId, title) => {
        const { savedPrograms, playlistId } = await this.getSavedPrograms();
        if (!savedPrograms.find((i) => i.id === programId)) {
            await PlayListService.addItem(playlistId, [{ title, eca_program: { id: programId } }]);
        }
    };

    removeProgramFromSaved = async (programId, title) => {
        const { savedPrograms, playlistId } = await this.getSavedPrograms();
        if (savedPrograms.find((i) => i.id === programId)) {
            await PlayListService.deleteItem(playlistId, [{ eca_program: { id: programId } }]);
        }
    };

    _moveOtherCategoryToLast(list) {
        try {
            let other = null;
            for (let i = 0; i < list.length; i++) {
                const item = list[i];
                if (item.name === 'Other') {
                    other = list.splice(i, 1);
                }
            }
            if (other) {
                return [other[0], ...list];
            }
        } catch (e) {
            console.error(e);
        }
        return list;
    }

    async _addOtherType(types) {
        await this._findOtherType();
        if (this.otherType) {
            // filter out other type in the list if it has
            types = types.filter(({ id }) => id !== this.otherType.id);
            // add other type at first
            return [{...this.otherType}, ...types];
        }
    }

    async _findOtherType() {
        if (!this.otherType) {
            const payload = await this.post('/eca/search', { mode: 'type', query: 'Other' });
            const type = payload.type;
            for (let item of type) {
                if (item.name === 'Other') {
                    this.otherType = item;
                }
            }
        }
        return this.otherType;
    }
}

export default new ECAService();
