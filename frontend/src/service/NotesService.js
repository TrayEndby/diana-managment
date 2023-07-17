import AbstractService from './AbstractService';

class NotesService extends AbstractService {
    /**
     * List an array of notes
     * Attribute of each note:
     * {
     *  notes_id: number
     *  title: string
     *  created_ts: string
     *  updated_ts: string
     *  tags: string
     * }
     */
    async list() {
        let payload = await this.get('/notes/list_notes');
        return payload.notes || [];
    }

    /**
     * Get note by id
     * Attribute of a note:
     * {
     *  title: string
     *  course_url: string
     *  notes: string
     *  created_ts: string
     *  updated_ts: string
     * }
     */
    async getNoteById(notes_id) {
        const data = {
            notes: {
                notes_id,
            },
        };
        const payload = await this.post('/notes/get_notes', data);
        const notes = payload.notes || [];
        return notes[0] || null;
    }

    /**
     * Update a note by passing a note
     * which is the same strcuture as returnted
     * by getNoteById
     */
    async update(note) {
        let data = {
            notes: {
                ...note,
                tags: note.tags || '\u0000',
            },
        };
        return await this.post('/notes/update_notes', data);
    }

    /**
     * Add a new note
     * courseURL is optional
     */
    async add(title, notes, courseURL) {
        let data = {
            notes: {
                title,
                notes,
                course_url: courseURL || '',
            },
        };
        let payload = await this.post('/notes/add_notes', data);
        return payload.notes[0];
    }

    async delete(notes_id) {
        let data = {
            notes: {
                notes_id,
            },
        };
        return this.post('/notes/delete_notes', data);
    }

    async search(query) {
        const data = {
            query,
        };
        const payload = await this.post('/notes/search_notes', data);
        return payload.notes || [];
    }

    /** Note sharing related apis */
    /**
     * CourseNotes notes
     *  repeated CourseNotesShare share
     *  string user_id
     *  uint32 role (note used yet)
     *  string email
     */

    /**
     *  @param {number} noteId
     *  @param {string[]} userIds
     */
    async shareToUser(noteId, userIds) {
        const userIdList = userIds.map((user_id) => {
            return {
                user_id,
            };
        });
        return this._shareNote(noteId, userIdList);
    }

    /**
     *  @param {number} noteId
     *  @param {string[]} emails
     */
    async shareToEmail(noteId, emails) {
        const emailList = emails.map((email) => {
            return {
                email,
            };
        });
        return this._shareNote(noteId, emailList);
    }

    async _shareNote(noteId, list) {
        const data = {
            mode: 'add',
            notes: {
                id: noteId,
                share: list,
            },
        };
        return this.post('/notes/share_notes', data);
    }

    /**
     * Given a notes id, update the user role
     * @param {number} noteId
     * @param {string} user_id
     */
    async updateSharingUser(noteId, user_id, role) {
        const data = {
            mode: 'update',
            notes: {
                id: noteId,
                share: [
                    {
                        user_id,
                        role,
                    },
                ],
            },
        };
        return this.post('/notes/share_notes', data);
    }

    /**
     *
     * @param {number} noteId
     */
    async listSharingUsers(noteId) {
        const data = {
            mode: 'list',
            notes: {
                id: noteId,
            },
        };
        const payload = await this.post('/notes/share_notes', data);
        const res = this._getShareResult(payload);
        return res ? res.share || [] : [];
    }

    /**
     *
     * @param {number} noteId
     * @param {string} user_id
     */
    async deleteSharingUser(noteId, user_id) {
        const data = {
            mode: 'delete',
            notes: {
                id: noteId,
                share: [
                    {
                        user_id,
                    },
                ],
            },
        };
        return this.post('/notes/share_notes', data);
    }

    _getShareResult(payload) {
        const notes = payload.notes ? payload.notes : [];
        return notes[0];
    }
}

export default new NotesService();
