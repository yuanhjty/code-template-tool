import * as vscode from 'vscode';
import * as path from 'path';
import * as os from 'os';

const defaultTemplatesPath = path.resolve(os.homedir(), '.vscode/templates');
const defaultConfigFile = 'template.config.json';
const defaultIgnore: string[] = [];

const config = {
    getPluginConfiguration(field: string): any {
        return vscode.workspace.getConfiguration('codeTemplateTool').get(field);
    },

    get templatesPath(): string {
        let templatesPath =
            <string>(this.getPluginConfiguration('templatesPath')) || defaultTemplatesPath;
        if (templatesPath.slice(0, 2) === '~/') {
            templatesPath = path.resolve(os.homedir(), templatesPath.slice(2));
        }
        return templatesPath;
    },

    get ignore(): string[] {
        return <string[]>(this.getPluginConfiguration('ignore')) || defaultIgnore;
    },

    get configFile(): string {
        return (
            <string>(this.getPluginConfiguration('templateConfigFileName')) || defaultConfigFile
        );
    },

    get encoding(): string {
        const filesConfig = vscode.workspace.getConfiguration('files', null);
        return (
            <string>(this.getPluginConfiguration('encoding')) ||
            filesConfig.get('encoding', 'utf8')
        );
    },
};

export default config;
