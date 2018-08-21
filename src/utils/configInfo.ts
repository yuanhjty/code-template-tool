import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';

const codeTemplateConfig = vscode.workspace.getConfiguration('codeTemplateTool');

export const templatesPath =
    codeTemplateConfig.get<string>('templatesPath') ||
    path.resolve(os.homedir(), '.vscode/templates');
export const templateConfigFileName =
    codeTemplateConfig.get<string>('templateConfigFileName') || 'template.config';
