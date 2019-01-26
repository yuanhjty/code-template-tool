import { workspace } from 'vscode';
import { resolve } from 'path';
import { homedir } from 'os';

const filesConfig = workspace.getConfiguration('files', null);
const defaultTemplatesPath = resolve(homedir(), '.vscode/templates');
const defaultConfigFile = 'template.config.json';
const defaultIgnore: string[] = [];
const defaultEncoding = filesConfig.get('encoding', 'utf8');

const config = {
    getPluginConfiguration(field: string): any {
        return workspace.getConfiguration('codeTemplateTool').get(field);
    },

    get templatesPath(): string {
        let templatesPath =
            <string>this.getPluginConfiguration('templatesPath') || defaultTemplatesPath;
        if (templatesPath.slice(0, 2) === '~/') {
            templatesPath = resolve(homedir(), templatesPath.slice(2));
        }
        return templatesPath;
    },

    get ignore(): string[] {
        return <string[]>this.getPluginConfiguration('ignore') || defaultIgnore;
    },

    get configFile(): string {
        return <string>this.getPluginConfiguration('templateConfigFileName') || defaultConfigFile;
    },

    get encoding(): string {
        return <string>this.getPluginConfiguration('encoding') || defaultEncoding;
    },
};

export default config;
