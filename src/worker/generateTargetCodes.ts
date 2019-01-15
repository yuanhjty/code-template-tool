import { mkdirSync, existsSync } from 'fs';
import { isDirectory } from '../utils/path';
import { NotDirError } from '../utils/error';
import config from '../utils/config';
import TemplateTable from '../model/TemplateTable';
import CodesGenerator from './CodesGenerator';
import selectTemplate from './selectTemplate';
import getUserInput from './getUserInput';

export default async function generateTargetCodes(destDir: string | undefined) {
    const templatesPath = config.templatesPath;
    if (!existsSync(templatesPath)) {
        mkdirSync(templatesPath);
    } else if (!isDirectory(templatesPath)) {
        throw new NotDirError(
            '`codeTemplateTool.templatesPath` must be a directory, check your user settings.'
        );
    }

    const templateTable = await TemplateTable.getInstance(templatesPath);
    TemplateTable.unbindInstance();

    const template = await selectTemplate(templateTable);
    if (!template) {
        return;
    }

    const userInput = await getUserInput(template, destDir);
    if (!userInput) {
        return;
    }

    template.setVariableValues(userInput.variableValues);

    const destDirPath = userInput.destDirPath || destDir;
    if (!destDirPath) {
        throw new Error('cannot resolve destination directory');
    }
    const codesGenerator = new CodesGenerator(template, destDirPath);
    await codesGenerator.execute();
}
