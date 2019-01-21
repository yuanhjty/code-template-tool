import { window } from 'vscode';
import ITemplate from '../model/ITemplate';
import ITemplateTable from '../model/ITemplateTable';

export default async function selectTemplate(
    templateTable: ITemplateTable
): Promise<ITemplate | undefined> {
    const templateNames = templateTable.getTemplateNames();
    const templateName = await window.showQuickPick(templateNames, {
        placeHolder: 'Select template',
    });
    return templateTable.getTemplateByName(templateName || '');
}
