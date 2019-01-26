import { window } from 'vscode';
import { ITemplate, ITemplateTable } from '../model/types';

export default async function selectTemplate(
    templateTable: ITemplateTable
): Promise<ITemplate | undefined> {
    const templates = templateTable.entries();
    const templateNames = templates.map(template => template.name);
    const templateName = await window.showQuickPick(templateNames, {
        placeHolder: 'Select template',
    });
    return templateTable.getByName(templateName || '');
}
