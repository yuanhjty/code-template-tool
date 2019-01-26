import { window } from 'vscode';
import { ITemplate, ITemplateTable } from '../model/types';
import { showInfoMsg } from '../utils/message';

export default async function selectTemplate(
    templateTable: ITemplateTable
): Promise<ITemplate | undefined> {
    const templates = templateTable.entries();
    const templateNames = templates.map(template => template.name);

    if (templateNames.length === 0) {
        showInfoMsg('No Templates were found!');
        return;
    }

    const templateName = await window.showQuickPick(templateNames, {
        placeHolder: 'Select template',
    });

    return templateTable.getByName(templateName || '');
}
