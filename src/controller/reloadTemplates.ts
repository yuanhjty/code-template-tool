import { showInfoMsg } from '../utils/message';
import { handleError } from '../utils/error';
import templateTable from '../state/templateTable';

export default async function refreshTemplatesCache() {
    try {
        await templateTable.update();
        showInfoMsg('Reload templates success!');
    } catch (err) {
        handleError(err);
    }
}
