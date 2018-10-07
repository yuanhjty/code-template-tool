import { resolveDestFolderPath } from '../utils/pathResolver';
import { handleError } from '../utils/error';
import { selectTemplate } from '../ui/templateSelector';
import { CodesGenerator } from './codesGenerator';

export default async function newFileFromTemplate(envArgs: any) {
    try {
        const template = await selectTemplate();
        if (!template) {
            return;
        }

        const destFolder = resolveDestFolderPath(envArgs);
        if (!destFolder) {
            return;
        }
        const generator = new CodesGenerator(template, destFolder);
        await generator.generateCodesFromTemplate();

    } catch (err) {
        handleError(err);
    }
}
