import { resolveTargetFolderPath } from '../utils/pathResolver';
import { handleError } from '../utils/error';
import { selectTemplateFromCache } from '../templateCache';

export default async function newFileFromTemplate(envArgs: any) {
    try {
        const template = await selectTemplateFromCache();
        if (!template) {
            return;
        }

        const targetFolderPath = resolveTargetFolderPath(envArgs);
        if (!targetFolderPath) {
            return;
        }
        await template.generateCodes(targetFolderPath);

    } catch (err) {
        handleError(err);
    }
}
