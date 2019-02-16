import { workspace } from 'vscode';
import { resolve } from 'path';
import { homedir } from 'os';

const filesConfig = workspace.getConfiguration('files', null);
const defaultTemplatesPath = resolve(homedir(), '.vscode/templates');
const defaultConfigFile = 'template.config.json';
const defaultIgnore: string[] = [];
const defaultEncoding = filesConfig.get('encoding', 'utf8');
const defaultVariableLeftBoundary = '{_';
const defaultVariableRightBoundary = '_}';
const defaultUserInputConfirmOnEnter = false;
const defaultUserInputCancelOnEscape = false;

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
        return this.getPluginConfiguration('ignore') || defaultIgnore;
    },

    get configFile(): string {
        return this.getPluginConfiguration('templateConfigFileName') || defaultConfigFile;
    },

    get encoding(): string {
        return this.getPluginConfiguration('encoding') || defaultEncoding;
    },

    get variableNoTransformation(): boolean {
        return this.getPluginConfiguration('variable.noTransformation');
    },

    get variableKeepUpperCase(): boolean {
        return this.getPluginConfiguration('variable.keepUpperCase');
    },

    get variableLeftBoundary(): string {
        return this.getPluginConfiguration('variable.leftBoundary') || defaultVariableLeftBoundary;
    },

    get variableRightBoundary(): string {
        return this.getPluginConfiguration('variable.rightBoundary') || defaultVariableRightBoundary;
    },

    get userInputConfirmOnEnter(): boolean {
        return this.getPluginConfiguration('userInput.confirmOnEnter') || defaultUserInputConfirmOnEnter;
    },

    get userInputCancelOnEscape(): boolean {
        return this.getPluginConfiguration('userInput.cancelOnEscape') || defaultUserInputCancelOnEscape;
    }
};

export default config;
