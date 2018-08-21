import { refreshTemplatesCache as refreshCache } from '../templateCache';
import { showInfoMsg } from '../utils/message';
import { handleError } from '../utils/error';

export default async function refreshTemplatesCache() {
    try {
        await refreshCache();
        showInfoMsg('Reload templates success!');
    } catch (err) {
        handleError(err);
    }
}
