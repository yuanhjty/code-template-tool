import { window } from 'vscode';
import { NoTemplateError } from '../utils/error';
import { Template } from '../state/template';
import templateTable from '../state/templateTable';

export async function selectTemplate(): Promise<Template | null> {
    const templateList = templateTable.getTemplateNames();
    if (templateList.length === 0) {
        throw new NoTemplateError();
    }

    const templateName = await window.showQuickPick(templateList, {
        placeHolder: 'Select template',
    });

    const template = (templateName && templateTable.getTemplate(templateName)) || null;

    return new Promise<Template | null>(resolve => {
        resolve(template);
    });
}
