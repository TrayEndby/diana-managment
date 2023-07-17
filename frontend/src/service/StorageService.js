import AbstractService from './AbstractService';
import bookmarkService from './BookmarkService';

const TITLE = "storage";
/**
 * A key, value store service mimic localstorage
 */
class StorageService extends AbstractService {
    async get(key) {
        try {
            const bookmark = await bookmarkService.getByName(key);
            if (bookmark) {
                return bookmark.item[0].content;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    } 

    /**
     * return true if succeed else return false
     */
    async set(key, value) {
        try {
            const item = {
                "title": TITLE,
                "content": value
            };
            const bookmark = await bookmarkService.getByName(key);
            if (bookmark == null) {
                await bookmarkService.add(key, [item]);
                return true;
            } else {
                await bookmarkService.updateItem(bookmark.id, item);
                return true;
            }
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * return true if succeed else return false
     */
    async delete(key) {
        try {
            const bookmark = await bookmarkService.getByName(key);
            if (bookmark) {
                await bookmarkService.delete(bookmark.id);
                return true;
            } else {
                return true; // null bookmark count as succeed
            }
        } catch {
            return false;
        }
    }
}

export default new StorageService();