import * as vscode from 'vscode';
import ITemplate from '../model/ITemplate';
import ITemplateTable from '../model/ITemplateTable';

export default async function selectTemplate(
    templateTable: ITemplateTable
): Promise<ITemplate | undefined> {
    const templateNames = templateTable.getTemplateNames();
    const templateName = await vscode.window.showQuickPick(templateNames, {
        placeHolder: 'Select template',
    });
    return templateTable.getTemplate(templateName || '');
}
