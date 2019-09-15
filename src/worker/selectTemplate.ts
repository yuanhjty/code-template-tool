import { window } from 'vscode';
import { ITemplate, ITemplateTable } from '../model/types';
import { showInfoMsg } from '../utils/message';
import { compare } from '../utils/string';

export default async function selectTemplate(
  templateTable: ITemplateTable
): Promise<ITemplate | undefined> {
  const templates = templateTable.entries().sort((a, b) => compare(a.name, b.name));
  const templateNames = templates.map(template => template.name);

  if (templateNames.length === 0) {
    showInfoMsg('No Templates were found!');
    return undefined;
  }

  const templateName = await window.showQuickPick(templateNames, {
    placeHolder: 'Select template',
  });

  return templateTable.getByName(templateName || '');
}
